FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install LiveKit CLI for agent execution
RUN wget -q https://github.com/livekit/livekit-cli/releases/latest/download/livekit-linux-amd64 -O /usr/local/bin/livekit-cli \
    && chmod +x /usr/local/bin/livekit-cli

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent code
COPY . .

# Default command to run
CMD ["sh", "-c", "livekit-server agent run main_agent:request_fnc --url $LIVEKIT_WS_URL --api-key $LIVEKIT_API_KEY --api-secret $LIVEKIT_API_SECRET"] 