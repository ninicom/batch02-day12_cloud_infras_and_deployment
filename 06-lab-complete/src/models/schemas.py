from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000, description="Tin nhắn từ user")
    session_id: str | None = Field(default=None, description="ID của phiên chat để nhớ ngữ cảnh")


class ChatResponse(BaseModel):
    response: str = Field(..., description="Phản hồi từ agent")
    analysis: str = Field(default="", description="Phân tích nội bộ")

class LogRequest(BaseModel):
    level: str = Field(..., description="Mức độ log (info, error, warn)")
    component: str = Field(..., description="Thành phần phát sinh log")
    message: str = Field(..., description="Nội dung log")
    details: dict | None = Field(default=None, description="Chi tiết lỗi")
