import React from 'react';
import {
  ActivityIcon,
  WifiIcon,
  WifiOffIcon,
  RefreshCwIcon,
  SettingsIcon,
  Volume2Icon,
  VolumeXIcon,
  TableIcon,
  SparklesIcon,
} from './Icons';

export function Header({
  connectionStatus,
  isDemoMode,
  setIsDemoMode,
  demoPostureState,
  setDemoPostureState,
  onRefresh,
  onOpenSettings,
  onOpenTable,
  config,
  onToggleAudio,
  lastSyncTime,
}) {
  return (
    <header className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 py-3 px-4 glass-card rounded-2xl border border-slate-800/80">
      {/* Brand & Title */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center">
            <span className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-lg">
              HE
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-lg md:text-xl tracking-tight text-white flex items-center gap-2">
              HUMANEDGE AI
              <span className="text-xs px-2 py-0.5 rounded-md font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.4
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            ESP32 + MPU6050 Decision Tree IoT Posture Monitoring System
          </p>
        </div>
      </div>

      {/* Simulator / Quick Demo Mode Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setIsDemoMode(false)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              !isDemoMode
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Hardware
          </button>
          <button
            type="button"
            onClick={() => setIsDemoMode(true)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              isDemoMode
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            Simulator
          </button>
        </div>

        {/* Demo Sub-states when simulator is on */}
        {isDemoMode && (
          <div className="flex items-center bg-slate-900/90 border border-amber-500/30 rounded-xl p-1 text-xs animate-fadeIn">
            <button
              type="button"
              onClick={() => setDemoPostureState('good')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                demoPostureState === 'good'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Good Posture
            </button>
            <button
              type="button"
              onClick={() => setDemoPostureState('slouch')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                demoPostureState === 'slouch'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Slouch
            </button>
            <button
              type="button"
              onClick={() => setDemoPostureState('dynamic')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                demoPostureState === 'dynamic'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wave
            </button>
          </div>
        )}

        {/* Status indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wider uppercase ${
            connectionStatus === 'CONNECTED'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : connectionStatus === 'DEMO'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-400'
                  : connectionStatus === 'DEMO'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-emerald-500'
                  : connectionStatus === 'DEMO'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            ></span>
          </span>
          <span>{connectionStatus}</span>
        </div>

        {/* Actions Button Toolbar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Audio alerts"
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border transition-all ${
              config.audioAlertsEnabled
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {config.audioAlertsEnabled ? (
              <Volume2Icon className="w-4 h-4" />
            ) : (
              <VolumeXIcon className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            title="Raw Feed Inspector"
            onClick={onOpenTable}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Sync Now"
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 active:rotate-180 transition-all duration-300"
          >
            <RefreshCwIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Channel & AI Settings"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
