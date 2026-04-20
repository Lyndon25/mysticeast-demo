'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Settings, Sparkles } from 'lucide-react';
import { LLMConfig } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CONFIG: LLMConfig = {
  apiKey: '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
};

const PRESET_ENDPOINTS = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1' },
  { name: 'Azure OpenAI', url: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment' },
  { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
  { name: 'Local (Ollama)', url: 'http://localhost:11434/v1' },
];

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [config, setConfig] = useLocalStorage<LLMConfig>('mysticeast-llm-config', DEFAULT_CONFIG);
  const [showKey, setShowKey] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  const handleUseDemo = () => {
    setConfig({
      ...config,
      apiKey: '',
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-serif text-white">AI Configuration</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* API Endpoint */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">API Endpoint</label>
                <select
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  {PRESET_ENDPOINTS.map((endpoint) => (
                    <option key={endpoint.name} value={endpoint.url}>
                      {endpoint.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Custom endpoint URL..."
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Model</label>
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="gpt-4o-mini"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={config.apiKey}
                    onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-20 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="sk-..."
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Your API key is stored locally in your browser. It never leaves your device.
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-sm">
                {config.apiKey ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400">AI reports enabled</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-amber-400">Using demo mode (pre-written reports)</span>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-800">
              <button
                onClick={handleUseDemo}
                className="flex-1 px-4 py-2.5 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 transition-colors text-sm"
              >
                Use Demo Mode
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors font-medium text-sm"
              >
                {savedMessage ? 'Saved!' : 'Save Configuration'}
              </button>
            </div>

            {/* Decorative element */}
            <div className="absolute top-4 right-4 opacity-10">
              <Sparkles className="w-16 h-16 text-cyan-400" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
