FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY website_guide_agent.py ./

CMD ["python", "website_guide_agent.py", "start"] 