import os
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("voice-agent")

# Load environment variables from .env file if it exists
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    logger.info(f"Loading environment from {dotenv_path}")
    load_dotenv(dotenv_path)
else:
    logger.info("No .env file found, using system environment variables")

# CORS Configuration - check both environment variable names
CORS_ALLOW_ORIGIN = os.getenv("CORS_ALLOW_ORIGIN", "")
if not CORS_ALLOW_ORIGIN:
    CORS_ALLOW_ORIGIN = os.getenv("CORS_ALLOWED_ORIGINS", "https://app.isyncso.com,http://localhost:3000")

CORS_ORIGINS = CORS_ALLOW_ORIGIN.split(",") if CORS_ALLOW_ORIGIN else ["https://app.isyncso.com", "http://localhost:3000"]
logger.info(f"CORS origins: {CORS_ORIGINS}")

# Service Configuration
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://isyncsosync-p1sl1ryj.livekit.cloud")

# Print configuration
logger.info(f"Running with configuration:")
logger.info(f"  PORT: {PORT}")
logger.info(f"  DEBUG: {DEBUG}")
logger.info(f"  LIVEKIT_URL: {LIVEKIT_URL}")
logger.info(f"  CORS_ORIGINS: {CORS_ORIGINS}") 