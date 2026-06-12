FROM python:3.11-slim

WORKDIR /app
COPY 05-scaling-reliability/develop/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY utils /app/utils
COPY 05-scaling-reliability/production /app/

ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
