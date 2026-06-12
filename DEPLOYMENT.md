# Deployment Information

## Public URL
https://ai-agent-3l8d.onrender.com

## Platform
Render

## Test Commands

### Health Check
```bash
curl https://ai-agent-3l8d.onrender.com/health
# Expected: {"status":"ok","env":"production"}
```

### API Test (with authentication)
```bash
curl -X POST https://ai-agent-3l8d.onrender.com/api/v1/chat \
  -H "X-API-Key: secret-key-123" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "session_id": "test"}'
```

## Environment Variables Set
- `ENVIRONMENT` = `production`
- `PYTHON_VERSION` = `3.11.0`
- `OPENAI_API_KEY` = `(Hidden)`
- `AGENT_API_KEY` = `secret-key-123`

## Screenshots
- Deployment dashboard: (Đã kiểm tra trên Render Dashboard)
- Service running: (Giao diện React/Vite đã hoạt động)
- Test results: (Test health check và API thành công)
