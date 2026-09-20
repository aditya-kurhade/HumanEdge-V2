import React, { useState } from 'react';
import { getDetailedAssessment } from '../utils/postureCalculations';
import { UserCheckIcon, SparklesIcon, ShieldCheckIcon, AlertTriangleIcon } from './Icons';

export function VisualizerCard({ isCorrect, angle, aiResult }) {
  const [showOverlays, setShowOverlays] = useState(true);
  const assessment = getDetailedAssessment(isCorrect, angle);

  // SVG spine path coordinates based on posture
  const spinePathD = isCorrect
    ? 'M150 45 C150 65, 151 85, 153 110 C155 135, 156 160, 158 190'
    : 'M150 45 C160 62, 168 82, 178 110 C188 135, 198 165, 208 190';

  const neckPos = isCorrect ? { cx: 150, cy: 45 } : { cx: 150, cy: 45 };
  const shoulderPos = isCorrect ? { cx: 151, cy: 85 } : { cx: 168, cy: 82 };
  const upperBackPos = isCorrect ? { cx: 153, cy: 110 } : { cx: 178, cy: 110 };
  const lumbarPos = isCorrect ? { cx: 158, cy: 190 } : { cx: 208, cy: 190 };

  return (
    <div
      className={`glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-500 border ${
        isCorrect
          ? 'border-emerald-500/30'
          : 'border-rose-500/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-bold text-base md:text-lg text-white tracking-tight flex items-center gap-2">
            <UserCheckIcon className="w-5 h-5 text-cyan-400" />
            NECK & BACK ANALYSIS
          </h2>
          <p className="text-xs text-slate-400">Real-time biomechanical posture visualization</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowOverlays((v) => !v)}
            className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white transition-all"
          >
            {showOverlays ? 'Hide X-Ray HUD' : 'Show X-Ray HUD'}
          </button>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
              isCorrect
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isCorrect ? 'CORRECT' : 'INCORRECT'}
          </span>
        </div>
      </div>

      {/* Visualizer and Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-3 items-stretch">
        {/* Left: 3D X-Ray Posture Scene */}
        <div className="md:col-span-6 relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 border border-slate-800/80 aspect-[4/5] max-h-[380px] flex items-center justify-center scanline-effect shadow-inner">
          {/* Background medical grid */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          {/* Correct Posture Image Layer */}
          <img
            src="/posture_correct.jpeg"
            alt="Correct Sitting Posture"
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-700 ease-in-out ${
              isCorrect ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          />

          {/* Incorrect Posture Image Layer */}
          <img
            src="/posture_incorrect.jpeg"
            alt="Incorrect Slouching Posture"
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-700 ease-in-out ${
              !isCorrect ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          />

          {/* Anatomical HUD SVG Overlay */}
          {showOverlays && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 300 240"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Spine Path glow */}
              <path
                d={spinePathD}
                fill="none"
                stroke={isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}
                strokeWidth="10"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <path
                d={spinePathD}
                fill="none"
                stroke={isCorrect ? '#10b981' : '#f43f5e'}
                strokeWidth="3.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
                className="transition-all duration-700"
              />

              {/* Vertebrae Markers */}
              {/* Cervical Node */}
              <circle
                cx={neckPos.cx}
                cy={neckPos.cy}
                r="5"
                fill={isCorrect ? '#10b981' : '#f43f5e'}
                className="animate-ping opacity-60"
              />
              <circle
                cx={neckPos.cx}
                cy={neckPos.cy}
                r="4.5"
                fill="#ffffff"
                stroke={isCorrect ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
              />

              {/* Shoulder Node */}
              <circle
                cx={shoulderPos.cx}
                cy={shoulderPos.cy}
                r="4"
                fill="#ffffff"
                stroke={isCorrect ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
              />

              {/* Thoracic Node */}
              <circle
                cx={upperBackPos.cx}
                cy={upperBackPos.cy}
                r="4"
                fill="#ffffff"
                stroke={isCorrect ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
              />

              {/* Lumbar Node */}
              <circle
                cx={lumbarPos.cx}
                cy={lumbarPos.cy}
                r="4.5"
                fill="#ffffff"
                stroke={isCorrect ? '#10b981' : '#f43f5e'}
                strokeWidth="2"
              />
            </svg>
          )}

          {/* Live Analysis Badge Overlays */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            3D BIOMECHANICAL MODEL
          </div>

          <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px]">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCorrect ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400 animate-pulse'
                }`}
              ></span>
              <span className="text-slate-300 font-medium">Spine Analysis Active</span>
            </div>
            <span className="font-mono text-slate-400 text-[10px]">
              Deviation: {angle !== null ? `${angle > 0 ? '+' : ''}${angle.toFixed(1)}°` : '0.0°'}
            </span>
          </div>
        </div>

        {/* Right: Detailed Posture Assessment Breakdown */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-3">
          {/* Main Assessment Header Card */}
          <div
            className={`p-3.5 rounded-xl border transition-all duration-300 ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-widest uppercase font-mono">
                CLINICAL EVALUATION
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-950/40">
                {isCorrect ? 'Class A (Normal)' : 'Class C (Kyphotic Slump)'}
              </span>
            </div>
            <div className="font-heading font-bold text-lg text-white">
              {isCorrect ? 'Optimal Ergonomic Posture' : 'Correction Recommended'}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isCorrect
                ? 'Neck and thoracolumbar spine are maintaining the natural physiological curve.'
                : 'Excessive forward thoracic flexion detected. Spine load is significantly elevated.'}
            </p>
          </div>

          {/* Assessment Breakdown List */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-slate-400 font-medium">Neck Alignment (C1-C7)</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  assessment.neck.status === 'good'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : assessment.neck.status === 'warning'
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {assessment.neck.text}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-slate-400 font-medium">Spine Curvature (T1-L5)</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  assessment.spine.status === 'good'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : assessment.spine.status === 'warning'
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {assessment.spine.text}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-slate-400 font-medium">Shoulder Retraction</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  assessment.shoulder.status === 'good'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : assessment.shoulder.status === 'warning'
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {assessment.shoulder.text}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
              <span className="text-slate-400 font-medium">Pelvic Base Seating</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  assessment.sitting.status === 'good'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : assessment.sitting.status === 'warning'
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {assessment.sitting.text}
              </span>
            </div>
          </div>

          {/* AI Coach Live Tip */}
          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs flex items-start gap-2.5">
            <SparklesIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">AI Ergonomic Coach: </span>
              <span className="text-slate-300">{assessment.recommendation}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
