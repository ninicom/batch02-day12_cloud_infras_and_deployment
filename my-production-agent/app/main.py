import os
import time
import json
import logging
import signal
from contextlib import asynccontextmanager
import uuid

from fastapi import FastAPI, Depends, Request, HTTPException
from pydantic import BaseModel
import uvicorn

from app.config import settings
from app.auth import verify_api_key
from app.rate_limiter import check_rate_limit, redis_client
from app.cost_guard import check_budget, record_usage
from app.utils.mock_llm import ask

# Structured JSON Logger
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
        }
        return json.dumps(log_obj)

logger = logging.getLogger(__name__)
logger.setLevel(getattr(logging, settings.log_level))
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)

# Graceful shutdown state
_is_ready = False
_in_flight_requests = 0

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _is_ready
    logger.info("Agent starting up...")
    _is_ready = True
    yield
    _is_ready = False
    logger.info("Graceful shutdown initiated. Waiting for in-flight requests...")
    timeout = 30
    while _in_flight_requests > 0 and timeout > 0:
        time.sleep(1)
        timeout -= 1
    logger.info("Shutdown complete.")

app = FastAPI(title=settings.app_name, lifespan=lifespan)

@app.middleware("http")
async def track_requests(request: Request, call_next):
    global _in_flight_requests
    _in_flight_requests += 1
    try:
        response = await call_next(request)
        return response
    finally:
        _in_flight_requests -= 1

class AskRequest(BaseModel):
    question: str
    session_id: str | None = None
    user_id: str

@app.post("/ask")
async def ask_agent(req: AskRequest, api_key: str = Depends(verify_api_key)):
    if not _is_ready:
        raise HTTPException(503, "Agent not ready")
        
    check_rate_limit(req.user_id)
    check_budget(req.user_id)
    
    session_id = req.session_id or str(uuid.uuid4())
    history_key = f"history:{session_id}"
    
    if redis_client:
        redis_client.rpush(history_key, f"User: {req.question}")
        redis_client.expire(history_key, 3600)
    
    answer = ask(req.question)
    
    if redis_client:
        redis_client.rpush(history_key, f"Agent: {answer}")
        
    # Mock token usage
    input_tokens = len(req.question.split()) * 2
    output_tokens = len(answer.split()) * 2
    record_usage(req.user_id, input_tokens, output_tokens)
    
    return {
        "session_id": session_id,
        "question": req.question,
        "answer": answer
    }

@app.get("/health")
def health():
    return {"status": "ok", "environment": settings.environment}

@app.get("/ready")
def ready():
    if not _is_ready:
        raise HTTPException(503, "Agent not ready")
    if redis_client:
        try:
            redis_client.ping()
        except Exception:
            raise HTTPException(503, "Redis disconnected")
    return {"ready": True}

def handle_sigterm(signum, frame):
    logger.info("Received SIGTERM")

signal.signal(signal.SIGTERM, handle_sigterm)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
