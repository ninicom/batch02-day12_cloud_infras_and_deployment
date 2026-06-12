import time
from fastapi import HTTPException
from app.config import settings
from app.rate_limiter import redis_client

PRICE_PER_1K_INPUT_TOKENS = 0.00015
PRICE_PER_1K_OUTPUT_TOKENS = 0.0006

def check_budget(user_id: str):
    """Kiểm tra ngân sách sử dụng của user theo tháng."""
    if not redis_client:
        return
        
    current_month = time.strftime("%Y-%m")
    key = f"budget:{user_id}:{current_month}"
    
    used_usd = float(redis_client.get(key) or 0.0)
    
    if used_usd >= settings.monthly_budget_usd:
        raise HTTPException(
            status_code=402,
            detail=f"Monthly budget exceeded (${settings.monthly_budget_usd}). Used: ${used_usd:.4f}"
        )

def record_usage(user_id: str, input_tokens: int, output_tokens: int):
    """Ghi nhận chi phí thực tế."""
    if not redis_client:
        return
        
    cost = (input_tokens / 1000 * PRICE_PER_1K_INPUT_TOKENS) + \
           (output_tokens / 1000 * PRICE_PER_1K_OUTPUT_TOKENS)
           
    current_month = time.strftime("%Y-%m")
    key = f"budget:{user_id}:{current_month}"
    
    redis_client.incrbyfloat(key, cost)
    # Expire after 32 days (to be safe for a month)
    redis_client.expire(key, 32 * 24 * 3600)
