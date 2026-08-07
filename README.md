# MerchantAgent

MerchantAgent is a simple and elegant AI configuration builder for fintech and merchant automation workflows. 
Describe your workflow in plain English, and the application generates a structured AI agent configuration, ready for integration.

## Features

- **Agent Builder:** Quickly create complex automation workflows by describing them naturally (powered by Groq / Llama-3.3-70b-versatile).
- **Execution Flow Visualization:** View your generated agent's trigger, conditions, and actions in a clean, visual representation.
- **Message Preview:** See how your customer communications will look in a realistic WhatsApp-style preview.
- **Simulator:** Test your agent's behavior against mock JSON data to ensure it behaves exactly as intended.
- **Dark Mode Support:** Fully responsive dark and light themes with a distinct, elegant neobrutalist design.
- **Local History:** Your recent agents are automatically saved in the browser so you can revisit them easily.

## Getting Started

1. Set up your environment variables. Copy `.env.example` to `.env` and provide your Groq API key (or configure it via the UI settings modal).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:3000`.

## Architecture

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, framer-motion, Zustand (state management).
- **Backend:** Express, Groq API SDK.

