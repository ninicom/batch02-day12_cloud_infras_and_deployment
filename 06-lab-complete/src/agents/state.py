from __future__ import annotations

from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages


class AgentState(TypedDict, total=False):
    """State schema cho LangGraph agent.

    Mỗi node đọc và ghi vào state này.
    total=False cho phép tất cả fields là optional.
    """

    messages: Annotated[list, add_messages]
    context: str
    analysis: str
    response: str
    error: str
    metadata: dict
