import React, { useState } from 'react';
import { usePostureData } from './hooks/usePostureData';
import { Header } from './components/Header';
import { TopMonitoring } from './components/TopMonitoring';
import { VisualizerCard } from './components/VisualizerCard';
import { SensorCard } from './components/SensorCard';
import { AnalyticsSection } from './components/AnalyticsSection';
import { SettingsModal } from './components/SettingsModal';
import { FeedTableModal } from './components/FeedTableModal';
import { WifiIcon, ShieldCheckIcon } from './components/Icons';

export function App() {
  const {
    config,
    updateConfig,
    isDemoMode,
    setIsDemoMode,
    demoPostureState,
    setDemoPostureState,
    feeds,
    connectionStatus,
    lastSyncTime,
    aiResult,
    angle,
    isCorrect,
    score,
    accel,
    gyro,
    imuCalculations,
    sessionDurationMs,
    goodDurationMs,
    badDurationMs,
    alertCount,
    refreshData,
  } = usePostureData();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const toggleAudio = () => {
    updateConfig({ audioAlertsEnabled: !config.audioAlertsEnabled });
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]"></div>
        <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[140px]"></div>
        <div className="absolute bottom-[-10%] left-[35%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto p-3 sm:p-5 md:p-6 space-y-4 md:space-y-5 flex-1">
        {/* 1. Header */}
        <Header
          connectionStatus={connectionStatus}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          demoPostureState={demoPostureState}
          setDemoPostureState={setDemoPostureState}
          onRefresh={refreshData}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTable={() => setIsTableOpen(true)}
          config={config}
          onToggleAudio={toggleAudio}
          lastSyncTime={lastSyncTime}
        />

        {/* 2. Top Monitoring KPI & AI Prediction */}
        <TopMonitoring
          aiResult={aiResult}
          score={score}
          angle={angle}
          isCorrect={isCorrect}
          sessionDurationMs={sessionDurationMs}
          goodDurationMs={goodDurationMs}
          badDurationMs={badDurationMs}
          alertCount={alertCount}
          connectionStatus={connectionStatus}
        />

        {/* 3. Middle Section: Visualizer & Sensor Telemetry */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <VisualizerCard isCorrect={isCorrect} angle={angle} aiResult={aiResult} />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <SensorCard
              accel={accel}
              gyro={gyro}
              imuCalculations={imuCalculations}
              connectionStatus={connectionStatus}
              lastSyncTime={lastSyncTime}
            />
          </div>
        </section>

        {/* 4. Analytics & Risk Awareness Section */}
        <AnalyticsSection feeds={feeds} />
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-3 px-6 glass-card border-t border-slate-800/80 text-xs text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1600px] w-full mx-auto rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Wi-Fi & IoT Stream: Active</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">ESP32 + MPU6050</span>
        </div>

        <div className="text-slate-400">
          HumanEdge AI Smart Posture Corrector • Decision Tree Biomechanical Engine
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
          <span>Clinical Ergonomics Grade</span>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={updateConfig}
      />

      <FeedTableModal
        isOpen={isTableOpen}
        onClose={() => setIsTableOpen(false)}
        feeds={feeds}
      />
    </div>
  );
}

export default App;
