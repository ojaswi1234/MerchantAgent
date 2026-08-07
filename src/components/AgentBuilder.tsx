import React, { useState, useEffect, useRef } from 'react';
import { useAgentStore } from '../store';
import { Button, Textarea, Card, CardContent } from './ui';
import { Bot, Sparkles, MessageSquare, Clock, ArrowRight, Settings } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedTitle from './AnimatedTitle';
import { motion } from 'motion/react';

const EXAMPLES = [
  { title: "Subscription Recovery", text: "When a subscription payment fails, wait 2 hours and send a friendly WhatsApp reminder with a payment link.", color: "bg-[#4ECDC4]" },
  { title: "Abandoned Cart", text: "If a high-value cart (>$100) is abandoned for 1 hour, send an email with a 10% discount code.", color: "bg-[#FF6B6B]" },
  { title: "Dispute Alert", text: "When a new dispute is created on Razorpay, immediately notify the merchant on WhatsApp and email the customer to clarify.", color: "bg-[#FFE66D]" },
  { title: "Payment Reminder", text: "Send a payment reminder via SMS 3 days before the due date for all unpaid invoices.", color: "bg-[#3B82F6]" },
];

export default function AgentBuilder({ onGenerated }: { onGenerated: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const addAgent = useAgentStore((state) => state.addAgent);
  const agents = useAgentStore((state) => state.agents);
  const setCurrentAgent = useAgentStore((state) => state.setCurrentAgent);
  const chipsRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "e.g., When a customer's payment fails, send a WhatsApp message...",
    "e.g., If a cart is abandoned for 1 hour, email a 10% discount code...",
    "e.g., Send a payment reminder via SMS 3 days before the due date...",
    "e.g., When a new dispute is created, immediately notify the merchant...",
  ];

  useEffect(() => {
    let currentText = '';
    let isDeleting = false;
    let loopNum = 0;
    let typingSpeed = 50;
    let timer: NodeJS.Timeout;
    let isPaused = false;
    let blinkCount = 0;

    const tick = () => {
      const i = loopNum % placeholders.length;
      const fullText = placeholders[i];

      if (isPaused) {
        // Blinking effect
        setPlaceholder(currentText + (blinkCount % 2 === 0 ? '|' : ''));
        blinkCount++;
        
        if (blinkCount > 6) { // 3 blinks (6 state changes)
          isPaused = false;
          isDeleting = true;
          blinkCount = 0;
          typingSpeed = 20;
        } else {
          typingSpeed = 400; // Blink interval
        }
      } else {
        if (isDeleting) {
          currentText = fullText.substring(0, currentText.length - 1);
          typingSpeed = 15;
        } else {
          currentText = fullText.substring(0, currentText.length + 1);
          typingSpeed = 40;
        }

        setPlaceholder(currentText + '|');

        if (!isDeleting && currentText === fullText) {
          isPaused = true;
          typingSpeed = 400;
        } else if (isDeleting && currentText === '') {
          isDeleting = false;
          loopNum++;
          typingSpeed = 500;
        }
      }

      timer = setTimeout(tick, typingSpeed);
    };

    timer = setTimeout(tick, typingSpeed);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe what you want the agent to do.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-agent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-groq-api-key': localStorage.getItem('groq_api_key') || '',
          'x-groq-model': localStorage.getItem('groq_model') || 'llama-3.3-70b-versatile'
        },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate agent');
      }
      
      addAgent(data.config);
      toast.success('Agent generated successfully!');
      onGenerated();
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl bg-[#3B82F6] text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2 sm:mb-4">
          <Bot className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <AnimatedTitle text="Build your automation agent" className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white leading-tight font-display" />
        <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300 max-w-2xl mx-auto px-2">
          Describe your business automation in plain English, and we'll convert it into a working AI agent configuration.
        </p>
      </div>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 }
          }
        }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap sm:justify-center gap-2 sm:gap-3 pb-2 sm:pb-0 px-2"
      >
        {EXAMPLES.map((example, i) => (
          <motion.button
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: { type: "spring", stiffness: 200, damping: 15 }
              }
            }}
            onClick={() => setPrompt(example.text)}
            className={`rounded-full px-3 sm:px-5 py-2 text-xs sm:text-sm font-bold text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all ${example.color}`}
          >
            {example.title}
          </motion.button>
        ))}
      </motion.div>

      <Card className={`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-opacity duration-300 ${isGenerating ? 'opacity-80 pointer-events-none' : ''}`}>
        <CardContent className="p-0 flex flex-col relative overflow-hidden">
          {isGenerating && (
            <motion.div 
              className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FF6B6B] border-t-transparent mb-4" />
                <p className="font-bold text-lg animate-pulse text-black dark:text-white">Crafting Agent Configuration...</p>
              </div>
            </motion.div>
          )}
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="min-h-[160px] sm:min-h-[240px] border-0 focus-visible:ring-0 text-lg sm:text-xl md:text-2xl font-bold p-6 sm:p-8 rounded-none shadow-none resize-none bg-white dark:bg-[#252830] rounded-t-2xl caret-[#FF6B6B] placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-[#FAF7F2] dark:bg-[#2F333D] border-t-2 border-black rounded-b-2xl gap-4 sm:gap-0">
            <div className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center w-full sm:w-auto justify-center sm:justify-start">
              <MessageSquare className="w-5 h-5 mr-2 text-[#FF6B6B]" />
              Powered by Groq
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-black bg-[#FF6B6B] hover:bg-[#ff5252] text-white"
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Sparkles className="mr-3 h-6 w-6" />
                  Generate Agent
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {agents.length > 0 && (
        <div className="space-y-4 pt-4 sm:pt-8">
          <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-[#FF6B6B]" />
            Recent Agents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {agents.slice(0, 3).map((agent, i) => (
              <motion.div
                key={agent.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card 
                  className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer h-full border-2 border-black"
                  onClick={() => {
                    setCurrentAgent(agent);
                    onGenerated();
                  }}
                >
                  <CardContent className="p-4 sm:p-5 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg leading-tight line-clamp-1">{agent.name}</h4>
                        <div className={`p-1.5 rounded-lg border-2 border-black shrink-0 ml-2 ${
                          agent.trigger.type === 'payment_failed' ? 'bg-[#FF6B6B]' :
                          agent.trigger.type === 'abandoned_cart' ? 'bg-[#4ECDC4]' :
                          agent.trigger.type === 'dispute_created' ? 'bg-[#FFE66D]' :
                          'bg-[#3B82F6]'
                        }`}>
                          <Bot className="w-4 h-4 text-black" />
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                        {agent.description}
                      </p>
                    </div>
                    <div className="flex items-center text-sm font-bold text-[#FF6B6B] mt-auto">
                      View Agent <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
