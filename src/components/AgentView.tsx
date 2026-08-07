import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from './ui';
import { useAgentStore } from '../store';
import { Play, Code, CheckCircle, Smartphone, ArrowRight, Copy, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedTitle from './AnimatedTitle';

export default function AgentView({ onSimulate }: { onSimulate: () => void }) {
  const currentAgent = useAgentStore((state) => state.currentAgent);

  if (!currentAgent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-[#FFE66D] p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
          <MessageCircle className="w-16 h-16 text-black" />
        </div>
        <h2 className="text-3xl font-black mb-4 dark:text-white">No Agent Selected</h2>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400 max-w-md">
          Go back to the Builder and describe your automation workflow to generate a new agent, or select a recent one.
        </p>
      </div>
    );
  }

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(currentAgent, null, 2));
    toast.success('Agent configuration copied to clipboard');
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-8 sm:space-y-12 max-w-5xl mx-auto">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center bg-white dark:bg-[#252830] p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <AnimatedTitle text={currentAgent.name} className="text-3xl sm:text-4xl font-black tracking-tight text-black dark:text-white font-display" />
          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 mt-2">{currentAgent.description}</p>
        </div>
        <div className="flex flex-row w-full sm:w-auto gap-3 shrink-0">
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

      {/* Visual Flow Representation */}
      <div className="relative">
        <h3 className="text-xl font-black mb-6 flex items-center dark:text-white">
          <ArrowRight className="mr-2 w-6 h-6 text-[#FF6B6B]" />
          Execution Flow
        </h3>
        
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-4 md:gap-0 relative">
          
          {/* Trigger Node */}
          <div className="bg-white dark:bg-[#252830] p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-1/3 flex flex-col items-center justify-center text-center z-10 relative">
            <div className="bg-[#4ECDC4] w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="w-6 h-6 text-black" />
            </div>
            <h4 className="font-black text-lg mb-1 dark:text-white">Trigger</h4>
            <Badge className="bg-[#4ECDC4]/20 text-[#2db5ab] dark:text-[#4ECDC4] border-transparent hover:bg-[#4ECDC4]/30">{currentAgent.trigger.type}</Badge>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-1 items-center justify-center z-0 -mx-4">
            <div className="h-1 w-full bg-black dark:bg-white border-y border-black dark:border-white opacity-20"></div>
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-black dark:border-l-white border-b-[8px] border-b-transparent opacity-20 -ml-1"></div>
          </div>

          <div className="flex md:hidden h-8 w-1 bg-black dark:bg-white opacity-20 my-2"></div>

          {/* Conditions Node */}
          <div className="bg-white dark:bg-[#252830] p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-1/3 flex flex-col items-center justify-center text-center z-10 relative">
            <div className="bg-[#FFE66D] w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-black text-xl text-black">?</span>
            </div>
            <h4 className="font-black text-lg mb-1 dark:text-white">Conditions</h4>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
               {currentAgent.trigger.conditions.map((cond, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-slate-100 dark:bg-slate-800">{cond}</Badge>
               ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex flex-1 items-center justify-center z-0 -mx-4">
             <div className="h-1 w-full bg-black dark:bg-white border-y border-black dark:border-white opacity-20"></div>
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-black dark:border-l-white border-b-[8px] border-b-transparent opacity-20 -ml-1"></div>
          </div>

          <div className="flex md:hidden h-8 w-1 bg-black dark:bg-white opacity-20 my-2"></div>

          {/* Action Node */}
          <div className="bg-white dark:bg-[#252830] p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full md:w-1/3 flex flex-col items-center justify-center text-center z-10 relative">
            <div className="bg-[#FF6B6B] w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Smartphone className="w-6 h-6 text-black" />
            </div>
            <h4 className="font-black text-lg mb-1 dark:text-white">Actions</h4>
            <div className="flex flex-col gap-1 mt-1 w-full">
               {currentAgent.actions.map((action, i) => (
                  <Badge key={i} className="bg-[#FF6B6B] text-black border-black hover:bg-[#ff5252] w-full justify-center">{action.type}</Badge>
               ))}
            </div>
          </div>

        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <Card className="bg-[#FAF7F2] dark:bg-[#2F333D] overflow-hidden flex flex-col">
          <CardHeader className="bg-white dark:bg-[#252830] border-b-2 border-black p-4 sm:p-6 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl sm:text-2xl font-display">
              <MessageCircle className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-[#4ECDC4]" />
              Message Preview
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => copyText(currentAgent.message_template, 'Message template')} className="hover:bg-slate-200 dark:hover:bg-slate-700">
               <Copy className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 sm:p-6 bg-slate-200 dark:bg-slate-900 flex flex-col">
            {/* WhatsApp style preview */}
            <div className="mt-2 flex-1">
               <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-2xl p-4 min-h-[200px] border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-y-auto">
                 <div className="flex flex-col gap-2">
                   <div className="self-end bg-[#dcf8c6] dark:bg-[#005c4b] text-black dark:text-[#e9edef] p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] border border-black/10">
                      <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{currentAgent.message_template}</p>
                      <div className="text-[10px] text-right mt-1 opacity-60">12:00 PM</div>
                   </div>
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#FAF7F2] dark:bg-[#2F333D] overflow-hidden flex flex-col">
          <CardHeader className="bg-white dark:bg-[#252830] border-b-2 border-black p-4 sm:p-6 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl sm:text-2xl">
              <Smartphone className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-[#FF6B6B]" />
              Action Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 p-4 pt-5 sm:p-6 sm:pt-6 flex-1 bg-white dark:bg-[#252830]">
            <div>
              <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Configuration</span>
              <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                {currentAgent.actions.map((action, i) => (
                  <div key={i} className="flex flex-col space-y-2 rounded-xl border-2 border-black bg-slate-50 dark:bg-slate-800 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-white text-xs sm:text-sm font-black border-2 border-black">
                           {i + 1}
                         </div>
                         <p className="text-sm sm:text-base font-bold text-black dark:text-white">{action.type}</p>
                       </div>
                    </div>
                    {action.config && (
                       <div className="ml-11 text-sm bg-white dark:bg-[#1A1C23] border-2 border-black/10 dark:border-white/10 rounded-lg p-2 font-mono">
                          {action.config.delay && <div className="dark:text-slate-300"><span className="font-bold text-black dark:text-white">delay:</span> {action.config.delay}</div>}
                          {action.config.template && <div className="dark:text-slate-300"><span className="font-bold text-black dark:text-white">template:</span> {action.config.template}</div>}
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {currentAgent.guardrails && (
              <div className="pt-4 border-t-2 border-black/10 dark:border-white/10">
                <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Guardrails</span>
                <div className="mt-3 flex flex-wrap gap-2">
                   <Badge variant="outline" className="bg-white dark:bg-slate-800">
                     Max Retries: {currentAgent.guardrails.max_retries}
                   </Badge>
                   {currentAgent.guardrails.allowed_channels?.map(channel => (
                     <Badge key={channel} variant="secondary" className="bg-slate-200 dark:bg-slate-700">
                       Channel: {channel}
                     </Badge>
                   ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
