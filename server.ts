import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Generating Agent Config
  app.post('/api/generate-agent', async (req, res) => {
    try {
      const apiKey = req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is missing. Please provide it in settings.");
      }

      const groq = new Groq({ apiKey: apiKey as string });
      const model = (req.headers['x-groq-model'] as string) || "llama-3.3-70b-versatile";
      
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are an expert AI configuration assistant for merchants and fintech workflows.
Your sole purpose is to convert a merchant's plain English request for an automation workflow into a strictly structured AI agent configuration JSON.

CRITICAL INSTRUCTIONS:
1. You MUST output ONLY valid JSON.
2. The JSON MUST exactly match the provided schema.
3. For the trigger.type, you MUST choose one of: payment_failed | subscription_failed | cart_abandoned | dispute_created.
4. For actions[].type, you MUST choose from: send_whatsapp | create_payment_link | retry_payment | send_email | notify_merchant.
5. Create a personalized and professional message_template using {{variables}} that fits the context of the workflow.
6. The output JSON must not contain markdown blocks, backticks, or any other text before or after the JSON itself.

SCHEMA:
{
  "name": "Agent Name",
  "description": "Short description of the agent",
  "trigger": {
    "type": "One of: payment_failed | subscription_failed | cart_abandoned | dispute_created",
    "conditions": ["Conditions for the trigger (e.g. 'amount > 500', 'status == unpaid')"]
  },
  "actions": [
    {
      "type": "One of: send_whatsapp | create_payment_link | retry_payment | send_email | notify_merchant",
      "config": {
        "delay": "Optional delay before action",
        "template": "Optional template name"
      }
    }
  ],
  "message_template": "Personalized message template with {{variables}}",
  "guardrails": {
    "max_retries": 3,
    "allowed_channels": ["sms", "email"]
  }
}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      let jsonOutput = response.choices[0]?.message?.content || "{}";
      
      // Attempt to parse JSON safely in case of minor structure issues
      try {
        const config = JSON.parse(jsonOutput);
        res.json({ config });
      } catch (parseError) {
        console.error("Failed to parse Groq output:", jsonOutput);
        res.status(500).json({ error: "Failed to parse agent configuration" });
      }
      
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "An error occurred during generation" });
    }
  });

  // API Route for Simulation
  app.post('/api/simulate-agent', async (req, res) => {
    try {
      const apiKey = req.headers['x-groq-api-key'] || process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is missing. Please provide it in settings.");
      }

      const groq = new Groq({ apiKey: apiKey as string });
      const model = (req.headers['x-groq-model'] as string) || "llama-3.3-70b-versatile";

      const { agentConfig, simulationData } = req.body;
      if (!agentConfig || !simulationData) {
        return res.status(400).json({ error: "agentConfig and simulationData are required" });
      }

      const userPrompt = `Given the following AI Agent Configuration for a merchant, and the sample input data, simulate the step-by-step execution of this agent.
      
      Agent Configuration:
      ${JSON.stringify(agentConfig, null, 2)}
      
      Simulation Input Data:
      ${JSON.stringify(simulationData, null, 2)}
      
      Simulate the execution and return the steps and final output.`;

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: `You are an expert simulator for a merchant fintech automation system.
Analyze the provided agent configuration and the sample input data.
Evaluate the triggers and conditions based on the input data.
Determine if the agent would execute successfully.
Generate a realistic step-by-step execution trace (steps).
Determine the final output (e.g. the exact rendered message or action taken).
Return ONLY valid JSON matching the schema.

SCHEMA:
{
  "steps": [
    {
      "title": "Step title",
      "description": "Step description",
      "status": "success | skipped | failed"
    }
  ],
  "final_output": "The final message or action taken",
  "is_successful": true
}`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" }
      });

      res.json({ result: JSON.parse(response.choices[0]?.message?.content || "{}") });
      
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "An error occurred during simulation" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
