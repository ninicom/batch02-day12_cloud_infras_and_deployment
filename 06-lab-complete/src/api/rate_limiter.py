import time
import redis
from fastapi import HTTPException
from src.config import get_settings

def get_redis_client():
    settings = get_settings()
    try:
        client = redis.from_url(settings.redis_url, decode_responses=True)
        client.ping()
        return client
    except Exception:
        return None

def check_rate_limit(user_id: str):
    settings = get_settings()
    client = get_redis_client()
    if not client:
        return
        
    current_minute = int(time.time() / 60)
    key = f"rate_limit:{user_id}:{current_minute}"
    
    requests = client.incr(key)
    if requests == 1:
        client.expire(key, 60)
        
    if requests > settings.rate_limit_per_minute:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Maximum {settings.rate_limit_per_minute} requests per minute."
        )
