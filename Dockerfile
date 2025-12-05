FROM python:3.13-slim
WORKDIR /app
COPY ./api /app/
RUN pip install --no-cache-dir -r requirements.txt