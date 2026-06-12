from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_community.callbacks.manager import get_openai_callback

from src.agents.state import AgentState
from src.utils.logger import agent_logger, llm_cost_logger

llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

SYSTEM_PROMPT = SystemMessage(content="""Bạn là chuyên viên tư vấn tuyển sinh nhiệt tình của VinUniversity.
Hãy trả lời các câu hỏi một cách ngắn gọn, súc tích, lịch sự và chuyên nghiệp.
Tránh trả lời quá dài. Nếu không biết thông tin cụ thể, hãy khuyên học sinh liên hệ văn phòng tuyển sinh.
""")

async def analyze_node(state: AgentState) -> dict:
    """Phân tích query từ user và gọi LLM."""
    messages = state.get("messages", [])
    
    # Tạo context có system prompt
    full_messages = [SYSTEM_PROMPT] + messages
    
    try:
        with get_openai_callback() as cb:
            # Gọi LLM
            response_msg = await llm.ainvoke(full_messages)
            
            # Ghi log chi phí LLM
            llm_cost_logger.info(
                f"LLM Call - Prompt Tokens: {cb.prompt_tokens}, "
                f"Completion Tokens: {cb.completion_tokens}, "
                f"Total Tokens: {cb.total_tokens}, "
                f"Total Cost (USD): ${cb.total_cost:.5f}"
            )
            
        return {
            "messages": [response_msg],
            "analysis": f"Đã sử dụng ChatOpenAI. Cost: ${cb.total_cost:.5f}",
            "response": response_msg.content
        }
    except Exception as e:
        agent_logger.error(f"Error in analyze_node calling LLM: {str(e)}", exc_info=True)
        return {
            "error": str(e)
        }

async def respond_node(state: AgentState) -> dict:
    """Node format response cuối cùng nếu cần."""
    error = state.get("error")
    if error:
        return {"response": f"Xin lỗi, có lỗi xảy ra: {error}"}

    return {} # response đã được tạo từ analyze_node
