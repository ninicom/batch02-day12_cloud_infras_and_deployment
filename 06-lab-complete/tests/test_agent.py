from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_chat_without_api_key():
    response = client.post(
        "/api/v1/chat",
        json={"message": "Hello", "session_id": "test"}
    )
    assert response.status_code == 401
    assert "Missing API key" in response.json()["detail"]

def test_chat_with_invalid_api_key():
    response = client.post(
        "/api/v1/chat",
        headers={"X-API-Key": "invalid-key"},
        json={"message": "Hello", "session_id": "test"}
    )
    assert response.status_code == 403
    assert "Invalid API key" in response.json()["detail"]
