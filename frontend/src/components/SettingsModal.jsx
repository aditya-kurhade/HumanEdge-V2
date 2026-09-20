import React, { useState } from 'react';
import { SettingsIcon, XIcon, CheckCircleIcon, RefreshCwIcon } from './Icons';
import { DEFAULT_CONFIG } from '../utils/constants';

export function SettingsModal({ isOpen, onClose, config, onSaveConfig }) {
  const [formData, setFormData] = useState({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_CONFIG });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">System Configuration</h3>
              <p className="text-xs text-slate-400">ThingSpeak IoT Channel & AI Model parameters</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">
              ThingSpeak Channel ID
            </label>
            <input
              type="text"
              value={formData.channelId}
              onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono focus:border-blue-500 focus:outline-none transition-all"
              placeholder="e.g. 3448261"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">
              ThingSpeak Read API Key
            </label>
            <input
              type="text"
              value={formData.readApiKey}
              onChange={(e) => setFormData({ ...formData, readApiKey: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono focus:border-blue-500 focus:outline-none transition-all"
              placeholder="e.g. ORC88T3Q6R7ZX21J"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 font-mono">
              Decision Tree AI Endpoint URL
            </label>
            <input
              type="text"
              value={formData.decisionTreeUrl}
              onChange={(e) => setFormData({ ...formData, decisionTreeUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono focus:border-blue-500 focus:outline-none transition-all"
              placeholder="http://127.0.0.1:5000/predict"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              If endpoint is offline, dashboard automatically uses high-precision fallback heuristics.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium font-mono">
                Refresh Polling Interval: {(formData.refreshInterval / 1000).toFixed(1)}s
              </label>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={formData.refreshInterval}
              onChange={(e) =>
                setFormData({ ...formData, refreshInterval: parseInt(e.target.value, 10) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <div className="text-slate-200 font-medium">Slouch Audio Alerts</div>
              <div className="text-[10px] text-slate-400">Play gentle harmonic chime when poor posture persists</div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, audioAlertsEnabled: !formData.audioAlertsEnabled })
              }
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                formData.audioAlertsEnabled ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  formData.audioAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
