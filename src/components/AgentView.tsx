import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './ui';
import { useAgentStore } from '../store';
import { Play, Code, CheckCircle, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedTitle from './AnimatedTitle';

export default function AgentView({ onSimulate }: { onSimulate: () => void }) {
  const currentAgent = useAgentStore((state) => state.currentAgent);

  if (!currentAgent) return null;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentAgent, null, 2));
    toast.success('Agent configuration copied to clipboard');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <AnimatedTitle text={currentAgent.name} className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white font-display" />
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 mt-2">{currentAgent.description}</p>
        </div>
        <div className="flex flex-row w-full sm:w-auto gap-3">
          <Button variant="outline" onClick={copyJson} className="font-bold flex-1 sm:flex-none justify-center">
            <Code className="mr-2 h-5 w-5 text-[#3B82F6]" />
            Copy JSON
          </Button>
          <Button onClick={onSimulate} variant="secondary" className="font-bold bg-[#FFE66D] hover:bg-[#ffdb4d] text-black border-black flex-1 sm:flex-none justify-center">
            <Play className="mr-2 h-5 w-5 fill-current" />
            Simulate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <Card className="bg-[#FAF7F2] dark:bg-[#2F333D]">
          <CardHeader className="bg-white dark:bg-[#252830] border-b-2 border-black p-4 sm:p-6">
            <CardTitle className="flex items-center text-xl sm:text-2xl font-display">
              <CheckCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-[#4ECDC4]" />
              Trigger & Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 p-4 pt-5 sm:p-6 sm:pt-6">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Event Type</span>
              <div className="mt-2">
                <Badge className="bg-[#4ECDC4] text-black border-black text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-1.5">{currentAgent.trigger.type}</Badge>
              </div>
            </div>
            {currentAgent.trigger.conditions.length > 0 && (
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conditions</span>
                <ul className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                  {currentAgent.trigger.conditions.map((cond, i) => (
                    <li key={i} className="rounded-xl bg-white dark:bg-[#252830] px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-bold text-black dark:text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {cond}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#FAF7F2] dark:bg-[#2F333D]">
          <CardHeader className="bg-white dark:bg-[#252830] border-b-2 border-black p-4 sm:p-6">
            <CardTitle className="flex items-center text-xl sm:text-2xl">
              <Smartphone className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-[#FF6B6B]" />
              Actions & Output
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 p-4 pt-5 sm:p-6 sm:pt-6">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Execution Steps</span>
              <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                {currentAgent.actions.map((action, i) => (
                  <div key={i} className="flex items-center space-x-3 sm:space-x-4 rounded-xl border-2 border-black bg-white dark:bg-[#252830] p-2 sm:p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white text-xs sm:text-sm font-black border-2 border-black">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-black dark:text-white">{action.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message Template</span>
              <div className="mt-2 sm:mt-3 rounded-xl bg-black dark:bg-[#252830] p-4 sm:p-5 font-mono text-sm sm:text-base font-medium text-[#4ECDC4] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {currentAgent.message_template}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
