import os
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.voice.agent import Agent
from livekit.plugins import elevenlabs, openai

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    participant = await ctx.wait_for_participant()

    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "You are Sync, the IYCNSO website guide. Greet the user, explain what IYCNSO is, "
            "and help them find information or pages on the website. "
            "If the user asks about features, pricing, or support, tell them where to find it and offer to route them. "
            "If they want to visit a page, confirm first, then say 'Great! Taking you to the [Page Name] page now.' and include 'ROUTE: /page-path' at the end of your response."
        ),
    )

    agent = Agent(
        instructions=initial_ctx.items[0].text,
        chat_ctx=initial_ctx,
        stt=openai.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=elevenlabs.TTS(
            voice_id="ODq5zmih8GrVes37Dizd",
            model="eleven_multilingual_v2"
        ),
    )

    await ctx.start(agent)
    await ctx.say(
        "Hello! I'm Sync, your AI website guide. IYCNSO helps you connect your favorite tools, automate workflows, and boost productivity. "
        "Ask me anything about the platform, or tell me where you'd like to go!",
        allow_interruptions=True
    )

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint)) 