FROM python:3.13-slim
WORKDIR /app
COPY . /app/
RUN rm datadog-dashboard.json docker-compose.yml docker-compose-local.yml
RUN pip install -r requirements.txt