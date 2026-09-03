from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
import os
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Missing Children AI Duplicate Detection Service",
    description="Detects duplicate missing children reports using NLP text similarity",
    version="1.0.0"
)

# Allow requests from the Java backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Request/Response Models ----

class DetectDuplicateRequest(BaseModel):
    report_id: str
    child_name: str
    physical_description: str
    last_seen_location: str

class DuplicateMatch(BaseModel):
    matched_report_id: str
    matched_child_name: str
    similarity_score: float
    is_duplicate: bool

class DetectDuplicateResponse(BaseModel):
    report_id: str
    highest_score: float
    is_duplicate: bool
    match: Optional[DuplicateMatch] = None
    message: str

# ---- Database Connection ----

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "child_tracking_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres29")
    )

def get_existing_reports(exclude_report_id: str):
    """Fetch all existing active reports from the database, excluding the new one."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT report_id, child_name, physical_description, last_seen_location
            FROM reports
            WHERE status = 'active'
            AND report_id != %s::uuid
        """, (exclude_report_id,))
        rows = cursor.fetchall()
        return [
            {
                "report_id": str(row[0]),
                "child_name": row[1],
                "physical_description": row[2],
                "last_seen_location": row[3],
                "text": f"{row[1]} {row[2]} {row[3]}"
            }
            for row in rows
        ]
    finally:
        cursor.close()
        conn.close()

# ---- Core Duplicate Detection Logic ----

def detect_duplicate(new_report_text: str, existing_reports: list, threshold: float = 0.75):
    """
    Compare new report text against all existing reports using TF-IDF and cosine similarity.
    Returns the highest match and its similarity score.
    """
    if not existing_reports:
        return None, 0.0

    # Build corpus: new report first, then all existing ones
    all_texts = [new_report_text] + [r["text"] for r in existing_reports]

    # Vectorize using TF-IDF
    vectorizer = TfidfVectorizer(
        analyzer='word',
        ngram_range=(1, 2),  # unigrams and bigrams for better matching
        min_df=1,
        stop_words=None  # keep all words — names and locations matter
    )
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Calculate cosine similarity between new report and all existing ones
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Find highest score and its index
    if len(similarity_scores) == 0:
        return None, 0.0

    best_idx = similarity_scores.argmax()
    best_score = float(similarity_scores[best_idx])

    if best_score >= threshold:
        return existing_reports[best_idx], best_score

    return None, best_score

# ---- API Endpoints ----

@app.get("/")
def root():
    return {"message": "AI Duplicate Detection Service is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/detect-duplicate", response_model=DetectDuplicateResponse)
def detect_duplicate_endpoint(request: DetectDuplicateRequest):
    """
    Accepts a new report and checks if it is a duplicate of any existing report.
    Returns the similarity score and matched report if a duplicate is found.
    """
    # Combine report fields into one text string for comparison
    new_text = f"{request.child_name} {request.physical_description} {request.last_seen_location}"

    # Fetch existing reports from the database
    existing_reports = get_existing_reports(request.report_id)

    if not existing_reports:
        return DetectDuplicateResponse(
            report_id=request.report_id,
            highest_score=0.0,
            is_duplicate=False,
            match=None,
            message="No existing reports to compare against"
        )

    # Run duplicate detection
    matched_report, score = detect_duplicate(new_text, existing_reports)

    if matched_report:
        return DetectDuplicateResponse(
            report_id=request.report_id,
            highest_score=round(score, 3),
            is_duplicate=True,
            match=DuplicateMatch(
                matched_report_id=matched_report["report_id"],
                matched_child_name=matched_report["child_name"],
                similarity_score=round(score, 3),
                is_duplicate=True
            ),
            message=f"Potential duplicate detected — {round(score * 100, 1)}% similarity with report for {matched_report['child_name']}"
        )

    return DetectDuplicateResponse(
        report_id=request.report_id,
        highest_score=round(score, 3),
        is_duplicate=False,
        match=None,
        message=f"No duplicate found — highest similarity was {round(score * 100, 1)}%"
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
