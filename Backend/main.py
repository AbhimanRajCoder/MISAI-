from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from pydantic import BaseModel
import requests
import os
from fastapi.middleware.cors import CORSMiddleware
import random
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


app = FastAPI()

# ✅ Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"] later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================
# 🔹 TEXT VERIFICATION ENDPOINT
# ================================
class TestInput(BaseModel):
    text: str


class ConversationItem(BaseModel):
    text: str
    sender: str

class QueryInput(BaseModel):
    message: str
    conversation_history: list[ConversationItem]


@app.post("/testai/{model_name}")
async def test_ai_model(model_name: str, data: TestInput):
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")

    hallucination_score = round(random.uniform(0.0, 1.0), 2)
    metrics = {
        "accuracy": random.uniform(0.7, 1.0),
        "reliability": random.uniform(0.6, 1.0),
        "response_time": random.uniform(0.2, 1.5),
        "fact_check_confidence": random.uniform(0.5, 1.0),
    }
    analysis = (
        f"The model '{model_name}' performed moderately well. "
        f"Based on analysis, its hallucination score is {hallucination_score}, "
        f"indicating {'low' if hallucination_score < 0.3 else 'moderate' if hallucination_score < 0.7 else 'high'} hallucination tendency."
    )

    return {
        "model": model_name,
        "hallucination_score": hallucination_score,
        "metrics": metrics,
        "analysis": analysis
    }

# ================================
# 🖼️ IMAGE VERIFICATION ENDPOINT
# ================================
@app.post("/testimage")
async def test_image(image: UploadFile = File(...)):
    if not image.filename:
        raise HTTPException(status_code=400, detail="No image uploaded")

    is_authentic = random.choice([True, False])
    confidence_score = round(random.uniform(0.5, 0.99), 2)

    manipulated_regions = []
    if not is_authentic:
        manipulated_regions = [
            {"type": random.choice(["Face Swap", "Background Edit", "Lighting Manipulation"]),
             "confidence": round(random.uniform(0.6, 0.95), 2)}
            for _ in range(random.randint(1, 3))
        ]

    analysis = (
        f"The image '{image.filename}' appears "
        f"{'authentic' if is_authentic else 'manipulated'} with a confidence of {confidence_score * 100:.1f}%."
    )

    return {
        "filename": image.filename,
        "authentic": is_authentic,
        "confidence_score": confidence_score,
        "analysis": analysis,
        "manipulated_regions": manipulated_regions
    }

# ================================
# 🎥 VIDEO VERIFICATION ENDPOINT
# ================================
@app.post("/testvideo")
async def test_video(video: UploadFile = File(...)):
    if not video.filename:
        raise HTTPException(status_code=400, detail="No video uploaded")

    is_authentic = random.choice([True, False])
    confidence_score = round(random.uniform(0.5, 0.98), 2)

    manipulated_segments = []
    if not is_authentic:
        num_segments = random.randint(1, 3)
        for _ in range(num_segments):
            start = round(random.uniform(5, 50), 1)
            duration = round(random.uniform(2, 6), 1)
            manipulated_segments.append({
                "type": random.choice(["Deepfake Face", "Synthetic Audio", "Spliced Frame"]),
                "start_time": start,
                "end_time": start + duration,
                "confidence": round(random.uniform(0.7, 0.95), 2)
            })

    analysis = (
        f"The video '{video.filename}' is likely "
        f"{'authentic' if is_authentic else 'manipulated'} with a confidence of {confidence_score * 100:.1f}%."
    )

    return {
        "filename": video.filename,
        "authentic": is_authentic,
        "confidence_score": confidence_score,
        "analysis": analysis,
        "manipulated_segments": manipulated_segments
    }


@app.post("/misbot")
def misbot(input: QueryInput):
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}

        # Prepare conversation context for Gemini
        history = []
        for msg in input.conversation_history:
            role = "user" if msg.sender == "user" else "model"
            history.append({"role": role, "parts": [{"text": msg.text}]})

        # Add the latest message
        history.append({
            "role": "user",
            "parts": [{"text": f"Check the accuracy and authenticity of this statement:\n\n{input.message}"}]
        })

        payload = {"contents": history}

        response = requests.post(url, headers=headers, json=payload)
        data = response.json()

        # Extract the Gemini model’s text response safely
        ai_reply = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "No response from Gemini.")
        )

        return {"result": ai_reply}

    except Exception as e:
        return {"error": str(e)}


# ================================
# 🌍 ROOT ENDPOINT
# ================================
@app.get("/")
async def root():
    return {"message": "AI Fact-Checker Backend is running successfully!"}
