# Optiflow

Optiflow is a next-generation, AI-powered workflow and communication platform designed for seamless multi-user, multi-agent collaboration. It enables users to connect their favorite SaaS tools, orchestrate advanced automations, and interact with intelligent agents—all in real time, with robust voice and chat capabilities.

---

## 🚀 Overview

Optiflow brings together real-time communication, AI orchestration, and deep SaaS integrations to create a "Jarvis-like" assistant for modern teams. Each user gets a persistent, secure LiveKit room where they can interact with agents (LLMs), connect their own SaaS accounts (via Pipedream), and automate complex workflows with natural language.

---

## ✨ Features

- **Persistent LiveKit Rooms:** Each user has a dedicated, secure room for voice and chat, with multi-user and multi-agent support.
- **AI Agent Orchestration:** Agents (powered by Claude, OpenAI, etc.) can perform actions, remember context, and coordinate with other agents.
- **Pipedream Connect Integrations:** Users can connect their own accounts for 30+ SaaS tools (Gmail, Slack, Salesforce, Notion, etc.) and automate actions securely.
- **Memory & Context:** All conversations and actions are stored in Mem0, providing agents with persistent, context-aware memory.
- **Modern Frontend:** A beautiful, responsive UI with a persistent voice agent orb, notifications, and easy access to settings and integrations.
- **Production-Ready Security:** All sensitive operations are server-side, with robust access control and data privacy.

---

## 🏗️ Architecture

- **Frontend:** Next.js (React), Tailwind CSS, LiveKit client, modern hooks and state management.
- **Backend:** Next.js API routes, Prisma ORM (PostgreSQL), Pipedream SDK, Mem0 SDK, secure token and room management.
- **Integrations:**
  - **LiveKit:** Real-time audio/video rooms for each user.
  - **Pipedream:** Secure, user-scoped API proxy for 2,500+ SaaS integrations.
  - **Claude/LLMs:** Advanced agent orchestration and natural language understanding.
  - **Mem0:** Persistent, multi-level memory for agents (user, team, org).

---

## 🔌 Supported Integrations (via Pipedream Connect)

- Gmail, Outlook, Google Drive, OneDrive, Slack, Microsoft Teams, Salesforce, Hubspot, Notion, Trello, Jira, LinkedIn, Mailchimp, Calendly, Monday, Figma, Product Hunt, WhatsApp Business, Clearbit, Zoho, and many more.

See the [Pipedream Connected Accounts docs](https://pipedream.com/docs/integrations/connected-accounts) for the full list.

---

## 🛠️ Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-org/optiflow.git
   cd optiflow
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env.local` and fill in your credentials (LiveKit, Pipedream, Mem0, etc.)
4. **Run the app locally:**
   ```bash
   npm run dev
   ```
5. **Database setup:**
   - Run `npx prisma migrate dev` to set up the database schema.

---

## 👤 User Experience

- **Connect Integrations:** Go to your account settings, click "Connections," and link your SaaS accounts securely via Pipedream.
- **Voice Agent:** Interact with your personal AI agent via the persistent orb in the UI. Ask it to perform actions, answer questions, or automate workflows.
- **Multi-Agent, Multi-User:** Invite teammates, assign agents, and orchestrate complex tasks in real time.
- **Memory:** All interactions are context-aware, with persistent memory for smarter, more helpful agents.

---

## 🤖 Developer Notes

- **Prisma models** define persistent room, user, agent, and connection mappings.
- **API routes** are organized by feature (LiveKit, agent, Pipedream, etc.) and use server-side validation and security best practices.
- **No legacy/mocks:** All integrations are real, production-ready, and database-backed.
- **Testing:** See `/tests` for unit and e2e tests. Use Vitest for new tests.

---

## 🤝 Contributing

We welcome contributions! Please open issues or pull requests for bugs, features, or improvements. See `CONTRIBUTING.md` for guidelines.

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for details.

---

## 📚 References
- [Pipedream Connected Accounts](https://pipedream.com/docs/integrations/connected-accounts)
- [LiveKit Docs](https://docs.livekit.io/)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Mem0 SDK](https://mem0.com/)

---

**Optiflow: The future of AI-powered, integrated teamwork.**
