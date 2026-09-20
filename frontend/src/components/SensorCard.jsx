import React from 'react';
import { CpuIcon, ActivityIcon, WifiIcon } from './Icons';

export function SensorCard({ accel, gyro, imuCalculations, connectionStatus, lastSyncTime }) {
  // Level bar percentage calculation [-2g to +2g mapped to 0-100%]
  const getAccelBarPct = (val) => {
    if (!Number.isFinite(val)) return 50;
    const clamped = Math.max(-2, Math.min(2, val));
    return ((clamped + 2) / 4) * 100;
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between border border-slate-800/80">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="font-heading font-bold text-base md:text-lg text-white tracking-tight flex items-center gap-2">
            <CpuIcon className="w-5 h-5 text-indigo-400" />
            MPU6050 SENSOR DATA
          </h2>
          <p className="text-xs text-slate-400">6-DOF Inertial Measurement Unit (IMU) stream</p>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
            connectionStatus === 'CONNECTED'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : connectionStatus === 'DEMO'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {connectionStatus}
        </span>
      </div>

      {/* Main Sensor Grids */}
      <div className="space-y-4 my-3">
        {/* 1. ACCELEROMETER */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
              ACCELEROMETER (g-force)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Fields 3, 4, 5</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Accel X */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400">Accel X</span>
              <div className="my-1 font-mono font-bold text-base text-cyan-300">
                {Number.isFinite(accel.x) ? `${accel.x > 0 ? '+' : ''}${accel.x.toFixed(2)}` : '--'}
                <span className="text-[10px] text-slate-400 font-normal ml-0.5">g</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${getAccelBarPct(accel.x)}%` }}
                ></div>
              </div>
            </div>

            {/* Accel Y */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400">Accel Y (Tilt)</span>
              <div className="my-1 font-mono font-bold text-base text-blue-300">
                {Number.isFinite(accel.y) ? `${accel.y > 0 ? '+' : ''}${accel.y.toFixed(2)}` : '--'}
                <span className="text-[10px] text-slate-400 font-normal ml-0.5">g</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${getAccelBarPct(accel.y)}%` }}
                ></div>
              </div>
            </div>

            {/* Accel Z */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400">Accel Z (Vert)</span>
              <div className="my-1 font-mono font-bold text-base text-indigo-300">
                {Number.isFinite(accel.z) ? `${accel.z > 0 ? '+' : ''}${accel.z.toFixed(2)}` : '--'}
                <span className="text-[10px] text-slate-400 font-normal ml-0.5">g</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${getAccelBarPct(accel.z)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. GYROSCOPE */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
              GYROSCOPE (angular rate)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Fields 6, 7, 8</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Gyro X */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400">Gyro X</span>
              <div className="my-0.5 font-mono font-bold text-sm text-slate-200">
                {Number.isFinite(gyro.x) ? `${gyro.x > 0 ? '+' : ''}${gyro.x.toFixed(2)}` : '--'}
              </div>
              <span className="text-[9px] text-slate-400">°/sec</span>
            </div>

            {/* Gyro Y */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400">Gyro Y</span>
              <div className="my-0.5 font-mono font-bold text-sm text-slate-200">
                {Number.isFinite(gyro.y) ? `${gyro.y > 0 ? '+' : ''}${gyro.y.toFixed(2)}` : '--'}
              </div>
              <span className="text-[9px] text-slate-400">°/sec</span>
            </div>

            {/* Gyro Z */}
            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400">Gyro Z</span>
              <div className="my-0.5 font-mono font-bold text-sm text-slate-200">
                {Number.isFinite(gyro.z) ? `${gyro.z > 0 ? '+' : ''}${gyro.z.toFixed(2)}` : '--'}
              </div>
              <span className="text-[9px] text-slate-400">°/sec</span>
            </div>
          </div>
        </div>

        {/* 3. COMPUTED KINEMATICS */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Calculated Pitch</div>
            <div className="font-heading font-bold text-sm text-white mt-0.5">
              {imuCalculations.pitch}°
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Calculated Roll</div>
            <div className="font-heading font-bold text-sm text-white mt-0.5">
              {imuCalculations.roll}°
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">Vector Magnitude</div>
            <div className="font-heading font-bold text-sm text-emerald-400 mt-0.5">
              {imuCalculations.magnitude} g
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>ESP32 Node: <strong className="text-slate-200">3448261</strong></span>
        </div>
        <div>
          Last Sync:{' '}
          <strong className="text-slate-200">
            {lastSyncTime ? lastSyncTime.toLocaleTimeString() : '--:--:--'}
          </strong>
        </div>
      </div>
    </div>
  );
}
