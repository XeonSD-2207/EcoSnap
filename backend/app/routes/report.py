from fastapi import APIRouter, UploadFile, File
from app.services.ai import analyze_image
{
  "severity": "high",
  "type": "Illegal Dumping",
  "boxes": [
    {"x": 100, "y": 150, "width": 50, "height": 50},
    {"x": 300, "y": 200, "width": 80, "height": 60}
  ]
}
router = APIRouter()

@router.post("/")
async def create_report(file: UploadFile = File(...)):
    result = await analyze_image(file)

    return {
        "message": "Report received",
        "analysis": result
    }

@router.get("/")
async def get_reports():
    return [
        {"lat": 10.76, "lng": 106.66}
    ]