import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Production AI Agent"
    environment: str = os.getenv("ENVIRONMENT", "development")
    port: int = int(os.getenv("PORT", 8000))
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    agent_api_key: str = os.getenv("AGENT_API_KEY", "secret-key-123")
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    rate_limit_per_minute: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", 10))
    monthly_budget_usd: float = float(os.getenv("MONTHLY_BUDGET_USD", 10.0))

    class Config:
        env_file = ".env"

settings = Settings()
