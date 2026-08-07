# MerchantAgent 🤖💳

**MerchantAgent** is an AI-powered automation workflow builder designed specifically for fintech and e-commerce merchants. By combining **LangGraph**, **Zod**, and **Groq**, it translates plain-English business rules into strictly structured, production-ready AI agent configurations.

---

## 🛑 The Real-Life Problem

Merchants and fintech operators lose millions annually to **failed payments, abandoned carts, and disputed charges**. 

While automation tools exist to recover these losses, configuring them is often a massive pain point:
1. **Complex UIs:** Traditional drag-and-drop rule builders are overwhelming for non-technical merchants.
2. **Brittle Logic:** Setting up nested conditions (e.g., "If cart > $500 AND user is VIP AND 2 hours have passed") often requires engineering support.
3. **Impersonal Messaging:** Standardized automated messages feel robotic, leading to low conversion and recovery rates.
4. **No Confidence:** Merchants are often afraid to hit "Deploy" because they cannot easily simulate how the automation will behave in the real world.

## 💡 The Solution: MerchantAgent

MerchantAgent flips the paradigm. Instead of wrestling with a complex UI, merchants simply **describe what they want** in natural language. 

*Example:* > *"When a subscription payment fails for a VIP customer, wait 2 hours, then send a personalized WhatsApp reminder with a payment link. If that fails, notify the merchant."*

Behind the scenes, MerchantAgent uses a multi-step **LangGraph Agentic Flow** to:
1. **Understand** the merchant's intent.
2. **Translate** it into a rigorous JSON configuration.
3. **Validate** the logic (Are there missing steps? Does an abandoned cart trigger lack a communication action?).
4. **Self-Correct** (If validation fails, the AI loops back to fix its own configuration).
5. **Simulate** the workflow visually so the merchant can test it with mock data before deploying.

---

## ✨ Key Features

- **🗣️ Natural Language Builder:** Convert plain English into complex automation workflows powered by Groq and the `llama-3.3-70b-versatile` model.
- **🧠 Agentic Self-Correction:** Built with LangGraph. The AI validates its own generated configurations and iterates to fix missing fields or illogical action combinations before presenting them to the user.
- **👁️ Execution Flow Visualization:** View generated triggers, conditions, and sequential actions in a clean, visual pipeline.
- **💬 Realistic Message Previews:** See exactly how customer communications will look in a realistic WhatsApp-style UI.
- **🧪 Built-in Simulator:** Test your agent's behavior against mock JSON payload data to ensure it behaves exactly as intended.
- **🎨 Elegant UI:** Fully responsive dark and light themes utilizing a distinct, modern neobrutalist design language.
- **🔐 Bring Your Own Key (BYOK):** Securely provide your own Groq API key via the settings UI (stored locally).

---

## 🏗️ Architecture

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS + custom neobrutalist styling
- **Animations:** framer-motion
- **State Management:** Zustand
- **Icons:** Lucide React

### Backend (AI Engine)
- **Server:** Express (Node.js)
- **Orchestration:** `@langchain/langgraph`
- **Models:** `@langchain/groq` 
- **Validation:** `zod` for strict structured output and schema adherence

### 🔄 The LangGraph Flow
The backend `/api/generate-agent` endpoint doesn't just make a single LLM call. It runs a state graph:
1. `Generate Node:` Drafts the initial JSON config based on the user prompt.
2. `Validate Node:` Evaluates the config using custom heuristics (e.g., ensuring actions make sense for the chosen trigger, validating template richness).
3. `Improve Node:` (Conditional) If validation fails, the LLM is prompted to fix the specific issues found.
4. `Finalize Node:` Returns the polished, production-ready config.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A [Groq API Key](https://console.groq.com/)

### Installation

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env` and add your Groq API key (alternatively, you can enter this directly in the app's Settings modal).
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and add:* `GROQ_API_KEY=gsk_your_key_here`

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Example Workflows to Try

Try pasting these into the Agent Builder:
- *"If a high-value cart (over $1000) is abandoned for 1 hour, send an email with a 10% discount code."*
- *"When a new dispute is created on Stripe, immediately notify the merchant on WhatsApp and email the customer to clarify the situation."*
- *"Send a payment reminder via SMS 3 days before the due date for all unpaid invoices."*

---
