import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink } from 'lucide-react';
import { Button, Input } from './ui';

export default function SettingsModal({ 
  isOpen, 
  onClose,
  isFirstLoad = false
}: { 
  isOpen: boolean; 
  onClose: () => void;
  isFirstLoad?: boolean;
}) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('llama-3.3-70b-versatile');

  useEffect(() => {
    if (isOpen) {
      setApiKey(localStorage.getItem('groq_api_key') || '');
      setModel(localStorage.getItem('groq_model') || 'llama-3.3-70b-versatile');
    }
  }, [isOpen]);

  const placeholders = [
    "gsk_...",
    "Paste your Groq API key here...",
    "Enter the key to unlock the builder..."
  ];

  const [placeholder, setPlaceholder] = useState('');

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
        setPlaceholder(currentText + (blinkCount % 2 === 0 ? '|' : ''));
        blinkCount++;
        
        if (blinkCount > 6) {
          isPaused = false;
          isDeleting = true;
          blinkCount = 0;
          typingSpeed = 20;
        } else {
          typingSpeed = 400;
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

  const handleSave = () => {
    localStorage.setItem('groq_api_key', apiKey.trim());
    localStorage.setItem('groq_model', model);
    onClose();
  };

  const handleRemove = () => {
    localStorage.removeItem('groq_api_key');
    setApiKey('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FAF7F2] dark:bg-[#1A1C23] border-4 border-black w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-300">
        {!isFirstLoad && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        )}

        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-[#3B82F6] p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-black dark:text-white">
            {isFirstLoad ? "Welcome!" : "Settings"}
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-black dark:text-white mb-2">
              Enter your Groq API Key
            </label>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
              Your key stays in your browser. We never store it. 
              {!apiKey && (
                <span className="block mt-1 font-bold text-[#FF6B6B]">
                  No key is currently saved. You need one to use the builder.
                </span>
              )}
            </p>
            <Input
              type="password"
              placeholder={placeholder}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-lg py-6 caret-[#3B82F6] placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-black dark:text-white mb-2">
              Select Model
            </label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="flex h-12 w-full rounded-xl border-2 border-black bg-white px-4 py-2 text-base font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#3B82F6] dark:bg-[#252830] dark:text-white transition-colors cursor-pointer"
            >
              <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
              <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant</option>
              <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
              <option value="gemma2-9b-it">Gemma 2 9B</option>
            </select>
          </div>

          <a 
            href="https://console.groq.com/keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-bold text-[#3B82F6] hover:underline"
          >
            Get a free Groq API key <ExternalLink className="w-4 h-4 ml-1" />
          </a>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-black/10 dark:border-white/10">
            <Button 
              onClick={handleSave} 
              disabled={!apiKey.trim()}
              className="flex-1 bg-[#4ECDC4] hover:bg-[#45b8b0] text-black font-bold text-lg py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Save Key
            </Button>
            {!isFirstLoad && (
              <Button 
                onClick={handleRemove} 
                variant="outline"
                className="flex-1 font-bold text-lg py-6 text-[#FF6B6B] border-[#FF6B6B] hover:bg-[#FF6B6B]/10"
              >
                Remove Key
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
