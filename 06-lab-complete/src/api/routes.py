from fastapi import APIRouter, HTTPException

from src.agents.graph import agent
from src.models.schemas import ChatRequest, ChatResponse, LogRequest
from src.utils.logger import api_logger, frontend_logger

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Chat với AI agent."""
    try:
        import uuid
        thread_id = request.session_id if request.session_id else str(uuid.uuid4())
        config = {"configurable": {"thread_id": thread_id}}
        result = await agent.ainvoke({"messages": [("user", request.message)]}, config)
        return ChatResponse(
            response=result.get("response", ""),
            analysis=result.get("analysis", ""),
        )
    except Exception as e:
        api_logger.error(f"Error in /chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/log")
async def receive_log(request: LogRequest):
    """Nhận log từ frontend."""
    log_msg = f"[{request.component}] {request.message} - Details: {request.details}"
    if request.level.lower() == "error":
        frontend_logger.error(log_msg)
    elif request.level.lower() == "warn":
        frontend_logger.warning(log_msg)
    else:
        frontend_logger.info(log_msg)
    return {"status": "ok"}


@router.get("/status")
async def agent_status():
    """Kiểm tra trạng thái agent."""
    return {"status": "ready", "agent": "LangGraph Agent v1.0"}
