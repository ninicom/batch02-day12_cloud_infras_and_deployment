import time
import redis
from fastapi import HTTPException
from app.config import settings

# Global redis client connection
redis_client = None
try:
    redis_client = redis.from_url(settings.redis_url, decode_responses=True)
    redis_client.ping()
except Exception:
    redis_client = None

def check_rate_limit(user_id: str):
    """Giới hạn tần suất request (Fixed window)."""
    if not redis_client:
        return  # Bỏ qua nếu không có Redis

    current_minute = int(time.time() / 60)
    key = f"rate_limit:{user_id}:{current_minute}"
    
    # Tăng biến đếm
    requests = redis_client.incr(key)
    
    if requests == 1:
        redis_client.expire(key, 60)  # hết hạn sau 60 giây
        
    if requests > settings.rate_limit_per_minute:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Maximum {settings.rate_limit_per_minute} requests per minute."
        )
