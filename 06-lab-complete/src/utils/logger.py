import logging
import os
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

def setup_logger(name: str, log_file: str, level=logging.INFO) -> logging.Logger:
    """Thiết lập một logger riêng lẻ, ghi vào file tương ứng."""
    logger = logging.getLogger(name)
    
    if logger.hasHandlers():
        return logger
        
    logger.setLevel(level)
    
    formatter = logging.Formatter(
        '[%(asctime)s] - [%(levelname)s] - [%(name)s] - %(message)s'
    )
    
    file_handler = logging.FileHandler(LOG_DIR / log_file, encoding='utf-8')
    file_handler.setFormatter(formatter)
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Khởi tạo các logger theo thành phần
api_logger = setup_logger("backend.api", "api.log")
agent_logger = setup_logger("backend.agent", "agent.log")
llm_cost_logger = setup_logger("llm.tracker", "llm_cost.log")
frontend_logger = setup_logger("frontend.client", "frontend.log")
