import React, { useState } from 'react';
import { useAgentStore } from '../store';
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from './ui';
import { Play, ArrowLeft, CheckCircle2, XCircle, Clock, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { SimulationResult } from '../types';
import AnimatedTitle from './AnimatedTitle';

export default function Simulator({ onBack }: { onBack: () => void }) {
  const currentAgent = useAgentStore((state) => state.currentAgent);
  const [simulationData, setSimulationData] = useState('{\n  "customerName": "John Doe",\n  "amount": 500,\n  "currency": "USD",\n  "reason": "insufficient_funds",\n  "phone": "+1234567890"\n}');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  if (!currentAgent) return null;

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(simulationData);
      } catch (e) {
        throw new Error('Invalid JSON input for simulation data');
      }

      const response = await fetch('/api/simulate-agent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-groq-api-key': localStorage.getItem('groq_api_key') || '',
          'x-groq-model': localStorage.getItem('groq_model') || 'llama-3.1-70b-versatile'
        },
        body: JSON.stringify({ agentConfig: currentAgent, simulationData: parsedData }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Simulation failed');
      }
      
      setResult(data.result);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-4">
        <Button variant="ghost" onClick={onBack} className="p-2 h-10 w-10 sm:h-12 sm:w-12 rounded-xl text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 border-2 border-transparent">
          <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
        <AnimatedTitle text="Simulation Mode" className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white font-display" />
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        <Card className="h-fit">
          <CardHeader className="bg-[#FFE66D] text-black p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-display">Input Data</CardTitle>
            <p className="text-xs sm:text-sm font-bold text-black/70 mt-1 sm:mt-2">Provide sample JSON data to test how the agent behaves.</p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 pt-5 sm:p-6 sm:pt-6">
            <Textarea
              value={simulationData}
              onChange={(e) => setSimulationData(e.target.value)}
              className="font-mono text-xs sm:text-sm min-h-[200px] sm:min-h-[300px] bg-[#FAF7F2] dark:bg-[#252830] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            <Button onClick={handleSimulate} disabled={isSimulating} className="w-full text-base sm:text-lg py-4 sm:py-6 bg-[#3B82F6] hover:bg-blue-600">
              {isSimulating ? 'Running Simulation...' : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 fill-current" />
                  Run Simulation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardHeader className={`${result.is_successful ? "bg-[#4ECDC4]" : "bg-[#FF6B6B]"} text-black p-4 sm:p-6`}>
                  <CardTitle className="flex items-center text-xl sm:text-2xl font-display">
                    {result.is_successful ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-black" />
                    ) : (
                      <XCircle className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-black" />
                    )}
                    Execution Trace
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-5 sm:p-6 sm:pt-6">
                  <div className="relative border-l-4 border-black ml-3 sm:ml-4 space-y-6 sm:space-y-8 py-2 sm:py-4">
                    {result.steps.map((step, i) => (
                      <div key={i} className="relative pl-6 sm:pl-8">
                        <span className="absolute -left-[13px] sm:-left-[14px] top-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white dark:bg-[#252830] border-4 border-black">
                          {step.status === 'success' && <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#4ECDC4]" />}
                          {step.status === 'failed' && <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FF6B6B]" />}
                          {step.status === 'skipped' && <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FFE66D]" />}
                        </span>
                        <h4 className="font-bold text-lg sm:text-xl text-black dark:text-white font-display">{step.title}</h4>
                        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black text-white border-2 border-black">
                <CardHeader className="bg-[#252830] border-b-2 border-slate-700 p-4 sm:p-6">
                  <CardTitle className="text-white text-lg sm:text-xl font-display">Final Output</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-5 sm:p-6 sm:pt-6">
                  <div className="font-mono text-sm sm:text-lg text-[#FFE66D] whitespace-pre-wrap font-bold">
                    {result.final_output}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center text-black dark:text-white border-4 border-dashed border-black rounded-3xl p-6 sm:p-12 text-center bg-white/50 dark:bg-[#252830]/50 mx-4 sm:mx-0">
              <div className="bg-[#FFE66D] p-3 sm:p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4 sm:mb-6">
                <Bot className="w-8 h-8 sm:w-12 sm:h-12 text-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">Ready to Simulate</h3>
              <p className="text-sm sm:text-lg font-medium text-slate-600 dark:text-slate-400 max-w-xs">Click run to see how your agent processes the input data step-by-step.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
