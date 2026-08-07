import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// Load environment variables
dotenv.config();

// --- LangGraph Agent Schema & Setup ---
const AgentConfigSchema = z.object({
  name: z.string().describe("Creative and descriptive name of the agent"),
  description: z.string().describe("Short description of the agent's purpose"),
  trigger: z.object({
    type: z.enum(["payment_failed", "subscription_failed", "cart_abandoned", "dispute_created"]),
    conditions: z.array(z.string()).describe("Array of realistic condition strings (e.g. 'amount > 500')")
  }),
  actions: z.array(z.object({
    type: z.enum(["send_whatsapp", "create_payment_link", "retry_payment", "send_email", "notify_merchant"]),
    config: z.record(z.string(), z.any()).describe("Optional meaningful configuration, e.g., delay or template")
  })),
  message_template: z.string().describe("Rich, personalized message template with {{variables}}"),
  guardrails: z.object({
    max_retries: z.number(),
    allowed_channels: z.array(z.string())
  })
});

type AgentConfig = z.infer<typeof AgentConfigSchema>;

const AgentStateAnnotation = Annotation.Root({
  userPrompt: Annotation<string>(),
  config: Annotation<AgentConfig | null>({
    default: () => null,
    reducer: (state, update) => update ?? state,
  }),
  validationIssues: Annotation<string[]>({
    default: () => [],
    reducer: (state, update) => update ?? state,
  }),
  iterations: Annotation<number>({
    default: () => 0,
    reducer: (state, update) => state + update,
  })
});

function createAgentGraph(apiKey: string, modelName: string) {
  const llm = new ChatGroq({
    apiKey: apiKey,
    model: modelName,
    temperature: 0.2,
  });

  const structuredLlm = llm.withStructuredOutput(AgentConfigSchema);

  // 1. Generate Node
  const generateConfig = async (state: typeof AgentStateAnnotation.State) => {
    const prompt = `You are an expert AI configuration assistant for merchants and fintech workflows.
Convert the following merchant request into a strictly structured AI agent configuration JSON.
Make sure the trigger type is one of the allowed enums.
Provide a rich personalized message_template and meaningful action configs.

Merchant Request: ${state.userPrompt}`;

    const config = await structuredLlm.invoke(prompt);
    return { config, iterations: 1 };
  };

  // 2. Validate Node
  const validateConfig = async (state: typeof AgentStateAnnotation.State) => {
    const config = state.config;
    if (!config) return { validationIssues: ["No config generated"] };

    const issues: string[] = [];
    
    if (!config.name || !config.description) {
      issues.push("Missing name or description.");
    }
    if (!config.message_template || config.message_template.length < 10) {
      issues.push("Message template is too weak or generic. Needs more detail and {{variables}}.");
    }
    if (config.actions.length === 0) {
      issues.push("Must have at least one action.");
    }
    
    // Check illogical combinations
    const trigger = config.trigger.type;
    const hasWhatsApp = config.actions.some(a => a.type === "send_whatsapp");
    const hasEmail = config.actions.some(a => a.type === "send_email");
    if (!hasWhatsApp && !hasEmail && trigger === "cart_abandoned") {
      issues.push("Cart abandoned trigger should probably send a message (whatsapp or email).");
    }

    return { validationIssues: issues };
  };

  // 3. Improve Node
  const improveConfig = async (state: typeof AgentStateAnnotation.State) => {
    const prompt = `You are an expert AI configuration assistant.
The previously generated configuration has some issues. Please fix them.

Original Merchant Request: ${state.userPrompt}
Current Config: ${JSON.stringify(state.config, null, 2)}
Validation Issues to fix:
${state.validationIssues.map(i => "- " + i).join("\\n")}

Generate an improved configuration that strictly fixes these issues.`;

    const config = await structuredLlm.invoke(prompt);
    return { config, iterations: 1 };
  };

  // Edges
  const shouldImprove = (state: typeof AgentStateAnnotation.State) => {
    if (state.validationIssues.length > 0 && state.iterations < 3) {
      return "improve";
    }
    return "finalize";
  };

  const workflow = new StateGraph(AgentStateAnnotation)
    .addNode("generate", generateConfig)
    .addNode("validate", validateConfig)
    .addNode("improve", improveConfig)
    .addNode("finalize", async (state) => state) // No-op node for clarity
    .addEdge(START, "generate")
    .addEdge("generate", "validate")
    .addConditionalEdges("validate", shouldImprove, {
      improve: "improve",
      finalize: "finalize"
    })
    .addEdge("improve", "validate")
    .addEdge("finalize", END);

  return workflow.compile();
}

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

      const modelName = (req.headers['x-groq-model'] as string) || "llama-3.3-70b-versatile";
      
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const graph = createAgentGraph(apiKey as string, modelName);
      
      const initialState = {
        userPrompt: prompt,
        config: null,
        validationIssues: [],
        iterations: 0
      };

      const finalState = await graph.invoke(initialState);

      if (!finalState.config) {
        return res.status(500).json({ error: "Failed to generate a valid configuration" });
      }

      res.json({ config: finalState.config });
      
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
