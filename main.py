import io
import csv
import base64
import qrcode
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from supabase import create_client, Client

app = FastAPI(title="Wedding Invitation API")

# ---------------------------------------------
# CORS Configuration
# ---------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from Vite (http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------
# Supabase Client Initialization
# ---------------------------------------------
SUPABASE_URL = "https://edbhgwevjmqyynoivbpa.supabase.co"
SUPABASE_KEY = "sb_secret_D738juhhz3Wtsyord0LyXw__LCfg2A5"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Temporary in-memory fallback store if Supabase table is missing columns/tables
local_wishes = []

# ---------------------------------------------
# Pydantic Data Models
# ---------------------------------------------
class RSVPRequest(BaseModel):
    slug: Optional[str] = None
    guest_name: Optional[str] = "Honored Guest"
    email: Optional[str] = None
    rsvp_status: str  # 'attending' or 'declined'
    plus_ones: Optional[int] = 0
    dietary_preference: Optional[str] = "None"

class WishRequest(BaseModel):
    guest_name: str
    message: str

class GuestCreateRequest(BaseModel):
    guest_name: str
    slug: str
    email: Optional[str] = None
    phone: Optional[str] = None

class CheckInRequest(BaseModel):
    guest_name: Optional[str] = None
    slug: Optional[str] = None


# ---------------------------------------------
# Helper Functions
# ---------------------------------------------
def generate_qr(data: str) -> str:
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#6b2d39", back_color="white")
    
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{qr_base64}"


# ---------------------------------------------
# Public API Endpoints
# ---------------------------------------------

@app.get("/")
def read_root():
    return {"message": "Wedding Invitation API is up and running!"}


@app.get("/api/invite/{slug}")
def get_invitation(slug: str):
    response = supabase.table("guests").select("*").eq("slug", slug).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Invitation link not found")
    return response.data[0]


@app.post("/api/rsvp")
def submit_rsvp(data: RSVPRequest):
    guest_slug = data.slug or data.guest_name.lower().replace(" ", "-")
    
    qr_data = f"INVITE_VERIFIED:{guest_slug}:{data.email or 'no-email'}"
    qr_code_base64 = generate_qr(qr_data)
    
    payload = {
        "guest_name": data.guest_name,
        "email": data.email,
        "rsvp_status": data.rsvp_status,
        "plus_ones": data.plus_ones,
        "dietary_preference": data.dietary_preference,
        "qr_code_url": qr_code_base64
    }
    
    try:
        if data.slug:
            res = supabase.table("guests").update(payload).eq("slug", data.slug).execute()
        else:
            payload["slug"] = guest_slug
            res = supabase.table("guests").upsert(payload).execute()

        return {"status": "success", "data": res.data[0] if res.data else payload}
    except Exception as e:
        print("Supabase Error:", e)
        return {"status": "success", "data": payload}


@app.post("/api/wishes")
def post_wish(data: WishRequest):
    new_wish = {"guest_name": data.guest_name, "message": data.message}
    try:
        res = supabase.table("wishes").insert(new_wish).execute()
        if res.data:
            return {"status": "success", "data": res.data}
    except Exception as e:
        print("Supabase Wish Insert Notice:", e)
    
    # Store in memory fallback if database operation is bypassed or missing column
    local_wishes.insert(0, new_wish)
    return {"status": "success", "data": [new_wish]}


@app.get("/api/wishes")
def get_wishes():
    try:
        res = supabase.table("wishes").select("*").execute()
        if res.data:
            # Combine Supabase data with any temporary local submissions
            return local_wishes + res.data
    except Exception as e:
        print("Supabase Wish Fetch Notice:", e)
    
    return local_wishes


# ---------------------------------------------
# Admin & Gate Check-in Endpoints
# ---------------------------------------------

@app.get("/api/admin/guests")
def get_admin_dashboard():
    try:
        guests_res = supabase.table("guests").select("*").execute()
        
        try:
            wishes_res = supabase.table("wishes").select("*").execute()
            wishes_count = len(wishes_res.data or []) + len(local_wishes)
        except Exception:
            wishes_count = len(local_wishes)

        guests = guests_res.data or []
        
        attending_guests = [g for g in guests if g.get('rsvp_status') == 'attending']
        declined_count = sum(1 for g in guests if g.get('rsvp_status') == 'declined')
        total_plus_ones = sum((g.get('plus_ones') or 0) for g in attending_guests)
        total_confirmed = len(attending_guests) + total_plus_ones
        
        dietary_stats = {
            "Halal": 0,
            "Non-Vegetarian": 0,
            "Vegetarian": 0
        }
        
        checked_in_count = 0

        for g in attending_guests:
            pref = g.get('dietary_preference') or 'Non-Vegetarian'
            if pref in dietary_stats:
                dietary_stats[pref] += 1 + (g.get('plus_ones') or 0)
            else:
                dietary_stats[pref] = 1 + (g.get('plus_ones') or 0)
                
            if g.get('checked_in') is True:
                checked_in_count += 1

        return {
            "summary": {
                "total_responses": len(guests),
                "attending_count": len(attending_guests),
                "declined_count": declined_count,
                "total_expected_guests": total_confirmed,
                "checked_in_count": checked_in_count,
                "total_wishes": wishes_count,
                "dietary_stats": dietary_stats
            },
            "guests": guests
        }
    except Exception as e:
        return {"error": str(e), "summary": {}, "guests": []}


@app.post("/api/admin/guests")
def create_guest_link(data: GuestCreateRequest):
    try:
        res = supabase.table("guests").insert(data.dict()).execute()
        return {"status": "success", "data": res.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/admin/export-csv")
def export_csv():
    try:
        guests_res = supabase.table("guests").select("*").execute()
        guests = guests_res.data or []

        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header Row
        writer.writerow(["Guest Name", "Email", "RSVP Status", "Plus Ones", "Dietary Preference", "Checked In", "Slug"])

        for g in guests:
            writer.writerow([
                g.get("guest_name", ""),
                g.get("email", ""),
                g.get("rsvp_status", "Pending"),
                g.get("plus_ones", 0),
                g.get("dietary_preference", "None"),
                "Yes" if g.get("checked_in") else "No",
                g.get("slug", "")
            ])

        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=wedding_guests_list.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/admin/checkin")
def checkin_guest(data: CheckInRequest):
    try:
        query = supabase.table("guests").select("*")
        
        if data.slug:
            res = query.eq("slug", data.slug).execute()
        elif data.guest_name:
            res = query.eq("guest_name", data.guest_name).execute()
        else:
            raise HTTPException(status_code=400, detail="Must provide guest_name or slug")

        if not res.data:
            raise HTTPException(status_code=404, detail="Guest Record Not Found!")

        guest = res.data[0]
        
        supabase.table("guests").update({"checked_in": True}).eq("id", guest["id"]).execute()

        return {
            "status": "success",
            "message": f"VALID TICKET - {guest.get('guest_name')}",
            "guest_name": guest.get("guest_name"),
            "plus_ones": guest.get("plus_ones", 0),
            "dietary_preference": guest.get("dietary_preference", "None")
        }
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------
# Direct Execution Entry Point
# ---------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)