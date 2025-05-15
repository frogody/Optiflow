FROM python:3.11-slim

WORKDIR /app

# Install minimal dependencies
RUN pip install --no-cache-dir fastapi uvicorn

# Copy app.py
COPY app.py .

# Expose the port
EXPOSE 8000

# Run the app
CMD ["python", "app.py"]
