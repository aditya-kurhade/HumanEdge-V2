import React from 'react';
import { formatDuration, formatMinutes } from '../utils/postureCalculations';
import { ActivityIcon, BrainIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon, WifiIcon } from './Icons';

export function TopMonitoring({
  aiResult,
  score,
  angle,
  isCorrect,
  sessionDurationMs,
  goodDurationMs,
  badDurationMs,
  alertCount,
  connectionStatus,
}) {
  // Score circle parameters
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColorClass = 'text-emerald-400 stroke-emerald-500';
  let scoreBgClass = 'bg-emerald-500/10 border-emerald-500/20';
  let scoreGrade = 'Optimal Posture';

  if (score < 60) {
    scoreColorClass = 'text-rose-400 stroke-rose-500';
    scoreBgClass = 'bg-rose-500/10 border-rose-500/20';
    scoreGrade = 'Critical Slouch';
  } else if (score < 80) {
    scoreColorClass = 'text-amber-400 stroke-amber-500';
    scoreBgClass = 'bg-amber-500/10 border-amber-500/20';
    scoreGrade = 'Moderate Fatigue';
  }

  // Good/Bad percentages
  const totalTracked = goodDurationMs + badDurationMs;
  const goodPct = totalTracked > 0 ? Math.round((goodDurationMs / totalTracked) * 100) : 100;
  const badPct = totalTracked > 0 ? Math.round((badDurationMs / totalTracked) * 100) : 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5">
      {/* 1. CURRENT AI PREDICTION PANEL */}
      <div
        className={`lg:col-span-3 glass-card rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
          isCorrect
            ? 'border-emerald-500/30 glow-emerald'
            : 'border-rose-500/30 glow-rose'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <BrainIcon className="w-3.5 h-3.5 text-blue-400" />
            CURRENT AI PREDICTION
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isCorrect
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {aiResult.confidence !== '--' ? `${aiResult.confidence}% AI CONF` : 'EVALUATING'}
          </span>
        </div>

        <div className="my-2.5 text-center">
          <div
            className={`font-heading text-3xl font-extrabold tracking-tight transition-all duration-300 ${
              isCorrect ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'
            }`}
          >
            {aiResult.prediction || (isCorrect ? 'CORRECT' : 'INCORRECT')}
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            {isCorrect
              ? 'Posture within acceptable ergonomic range'
              : 'Forward hunch detected • Correction required'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
          <span>Model: Decision Tree</span>
          <span className="text-slate-400">{aiResult.source || 'IoT Feed Sync'}</span>
        </div>
      </div>

      {/* 2. SESSION POSTURE SCORE GAUGE */}
      <div className="lg:col-span-3 glass-card rounded-2xl p-4 flex flex-col justify-between border border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <ActivityIcon className="w-3.5 h-3.5 text-indigo-400" />
            SESSION POSTURE SCORE
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBgClass} ${scoreColorClass}`}>
            {scoreGrade}
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 my-1">
          {/* Circular SVG Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                className="stroke-slate-800"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                className={`transition-all duration-700 ease-out ${scoreColorClass}`}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading font-extrabold text-2xl text-white leading-none">
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="flex flex-col justify-center text-xs space-y-1">
            <div className="text-slate-300 font-medium">Daily Compliance</div>
            <div className="text-[11px] text-slate-400">
              Good Ratio: <span className="font-bold text-emerald-400">{goodPct}%</span>
            </div>
            <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${goodPct}%` }}
              ></div>
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${badPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Target Score: ≥ 85</span>
          <span className="text-blue-400 font-medium">Real-time dynamic</span>
        </div>
      </div>

      {/* 3. MONITORING KPI TILES GRID */}
      <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Posture Angle */}
        <div className="glass-card rounded-xl p-3 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Posture Angle</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              Field 1
            </span>
          </div>
          <div className="my-1 flex items-baseline gap-1">
            <span
              className={`font-heading font-extrabold text-2xl ${
                Math.abs(angle || 0) <= 15
                  ? 'text-emerald-400'
                  : Math.abs(angle || 0) <= 25
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {angle !== null ? `${angle > 0 ? '+' : ''}${angle.toFixed(1)}` : '--'}
            </span>
            <span className="text-sm font-bold text-slate-400">°</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Tilt Axis</span>
            <span className={Math.abs(angle || 0) <= 15 ? 'text-emerald-400' : 'text-rose-400'}>
              {Math.abs(angle || 0) <= 15 ? 'Optimal' : angle > 0 ? 'Fwd Flex' : 'Back Tilt'}
            </span>
          </div>
        </div>

        {/* Session Time */}
        <div className="glass-card rounded-xl p-3 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Session Time</span>
            <ClockIcon className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-1">
            <span className="font-mono font-bold text-xl text-white tracking-wider">
              {formatDuration(sessionDurationMs)}
            </span>
          </div>
          <div className="text-[10px] text-slate-400">Active monitoring window</div>
        </div>

        {/* Good Posture */}
        <div className="glass-card rounded-xl p-3 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Good Posture</span>
            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-2xl text-emerald-400">
              {formatMinutes(goodDurationMs)}
            </span>
            <span className="text-xs font-mono text-slate-400">({goodPct}%)</span>
          </div>
          <div className="text-[10px] text-emerald-400/80">Spine aligned duration</div>
        </div>

        {/* Bad Posture */}
        <div className="glass-card rounded-xl p-3 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Bad Posture</span>
            <AlertTriangleIcon className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="my-1 flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-2xl text-rose-400">
              {formatMinutes(badDurationMs)}
            </span>
            <span className="text-xs font-mono text-slate-400">({badPct}%)</span>
          </div>
          <div className="text-[10px] text-rose-400/80">Slouch accumulated</div>
        </div>

        {/* Slouch Alerts */}
        <div className="glass-card rounded-xl p-3 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Posture Alerts</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="my-1">
            <span className="font-heading font-bold text-2xl text-amber-400">{alertCount}</span>
          </div>
          <div className="text-[10px] text-slate-400">Slouch triggers today</div>
        </div>

        {/* System Node */}
        <div className="glass-card rounded-xl p-3 flex flex-col justify-between border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>System State</span>
            <WifiIcon className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1">
            <span
              className={`font-mono font-bold text-lg ${
                connectionStatus === 'CONNECTED'
                  ? 'text-emerald-400'
                  : connectionStatus === 'DEMO'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {connectionStatus === 'CONNECTED'
                ? 'ESP32 ONLINE'
                : connectionStatus === 'DEMO'
                ? 'SIM ACTIVE'
                : 'OFFLINE'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400">Decision Tree Engine</div>
        </div>
      </div>
    </section>
  );
}
