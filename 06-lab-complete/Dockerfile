# Stage 1: Build Frontend (Node.js)
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy frontend package files
COPY src/frontend/package*.json ./
# Install dependencies
RUN npm install
# Copy rest of frontend source
COPY src/frontend/ ./
# Build for production
RUN npm run build

# Stage 2: Build Backend (Python)
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Copy built frontend from Stage 1 into the location expected by FastAPI
COPY --from=frontend-builder /app/frontend/dist /app/src/frontend/dist

ENV PYTHONPATH=/app
EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
