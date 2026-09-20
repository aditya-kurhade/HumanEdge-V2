import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_CONFIG, STORAGE_KEYS } from '../utils/constants';
import {
  calculatePostureScore,
  calculateIMUCalculations,
  classifyPostureDecisionTree,
} from '../utils/postureCalculations';
import { playAlertSound } from '../utils/audioAlerts';

export function usePostureData() {
  // Load saved configuration or use defaults
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoPostureState, setDemoPostureState] = useState('good'); // 'good' | 'slouch' | 'dynamic'

  // Data states
  const [feeds, setFeeds] = useState([]);
  const [latestFeed, setLatestFeed] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING'); // 'CONNECTED' | 'OFFLINE' | 'CONNECTING' | 'DEMO'
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [aiResult, setAiResult] = useState({
    prediction: 'WAITING',
    confidence: '--',
    source: 'Decision Tree AI',
  });

  // Session Statistics
  const [sessionStartTime] = useState(() => Date.now());
  const [sessionDurationMs, setSessionDurationMs] = useState(0);
  const [goodDurationMs, setGoodDurationMs] = useState(0);
  const [badDurationMs, setBadDurationMs] = useState(0);
  const [alertCount, setAlertCount] = useState(0);

  const prevStatusRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Save config changes
  const updateConfig = useCallback((newConfig) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save config to localStorage', err);
      }
      return updated;
    });
  }, []);

  // Master Session Timer tick (every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDurationMs(Date.now() - sessionStartTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Main ThingSpeak Fetch function
  const fetchThingSpeak = useCallback(async () => {
    if (isDemoMode || isFetchingRef.current) return;

    isFetchingRef.current = true;
    const url = `https://api.thingspeak.com/channels/${config.channelId}/feeds.json?api_key=${encodeURIComponent(
      config.readApiKey
    )}&results=100`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`ThingSpeak returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.feeds) || data.feeds.length === 0) {
        throw new Error('No feeds available in ThingSpeak channel');
      }

      const fetchedFeeds = data.feeds;
      setFeeds(fetchedFeeds);

      const latest = fetchedFeeds[fetchedFeeds.length - 1];
      setLatestFeed(latest);
      setLastSyncTime(new Date());
      setConnectionStatus('CONNECTED');

      // Process Metrics & Duration
      processFeedsForMetrics(fetchedFeeds);

      // Process AI Classification
      processAIClassification(latest);
    } catch (err) {
      console.warn('ThingSpeak poll error:', err.message);
      setConnectionStatus((prev) => (prev === 'CONNECTED' ? 'OFFLINE' : 'OFFLINE'));
    } finally {
      isFetchingRef.current = false;
    }
  }, [config.channelId, config.readApiKey, isDemoMode]);

  // Process today's feeds to calculate good / bad posture time
  const processFeedsForMetrics = (feedList) => {
    if (!feedList || feedList.length < 2) return;

    let goodMs = 0;
    let badMs = 0;

    for (let i = 0; i < feedList.length - 1; i++) {
      const t1 = new Date(feedList[i].created_at).getTime();
      const t2 = new Date(feedList[i + 1].created_at).getTime();
      const delta = Math.max(0, Math.min(60000, t2 - t1)); // cap gaps at 60s

      const rawStatus = String(feedList[i].field2 ?? '').trim().toUpperCase();
      const isGood = rawStatus === '1' || rawStatus === 'GOOD' || rawStatus === 'CORRECT';

      if (isGood) {
        goodMs += delta;
      } else {
        badMs += delta;
      }
    }

    setGoodDurationMs(goodMs);
    setBadDurationMs(badMs);
  };

  // AI Classification with fallback
  const processAIClassification = async (feed) => {
    if (!feed) return;

    const angle = parseFloat(feed.field1);
    const ax = parseFloat(feed.field3);
    const ay = parseFloat(feed.field4);
    const az = parseFloat(feed.field5);

    // First try Python Decision Tree AI Server
    try {
      if (config.decisionTreeUrl && Number.isFinite(ax) && Number.isFinite(ay) && Number.isFinite(az)) {
        const aiUrl = `${config.decisionTreeUrl}?Ax=${encodeURIComponent(ax)}&Ay=${encodeURIComponent(
          ay
        )}&Az=${encodeURIComponent(az)}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const aiRes = await fetch(aiUrl, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson && aiJson.ok) {
            const pred = String(aiJson.project_prediction || aiJson.prediction || 'CORRECT').toUpperCase();
            const conf = aiJson.confidence !== undefined ? aiJson.confidence : 92;

            setAiResult({
              prediction: pred,
              confidence: conf,
              source: 'Decision Tree AI (Live Model Server)',
            });

            handleAlertTracking(pred);
            return;
          }
        }
      }
    } catch {
      // Flask AI server not running, seamless fallback to embedded Decision Tree rules
    }

    // Heuristic Fallback using exact decision tree rules
    const fallback = classifyPostureDecisionTree(ax, ay, az, angle);
    const statusField = String(feed.field2 ?? '').trim().toUpperCase();
    const finalPrediction =
      statusField === '1' || statusField === 'GOOD' || statusField === 'CORRECT'
        ? 'CORRECT'
        : statusField === '0' || statusField === 'BAD' || statusField === 'INCORRECT'
        ? 'INCORRECT'
        : fallback.prediction;

    setAiResult({
      prediction: finalPrediction,
      confidence: fallback.confidence || 94,
      source: 'Decision Tree Classifier',
    });

    handleAlertTracking(finalPrediction);
  };

  // Alert tracking & Audio notifications
  const handleAlertTracking = (prediction) => {
    if (prediction === 'INCORRECT') {
      if (prevStatusRef.current === 'CORRECT') {
        setAlertCount((c) => c + 1);
        if (config.audioAlertsEnabled) {
          playAlertSound('warning');
        }
      }
    }
    prevStatusRef.current = prediction;
  };

  // Demo / Simulator Mode Logic
  useEffect(() => {
    if (!isDemoMode) return;

    setConnectionStatus('DEMO');
    let step = 0;

    const demoInterval = setInterval(() => {
      step++;
      const now = new Date();
      let angleVal = 4.2;
      let statusVal = 'CORRECT';
      let ax = 0.08, ay = 0.12, az = 0.98;
      let gx = 0.15, gy = -0.22, gz = 0.05;

      if (demoPostureState === 'slouch') {
        // Forward neck hunch
        angleVal = 28.5 + Math.sin(step * 0.4) * 3.5;
        statusVal = 'INCORRECT';
        ax = 0.22 + Math.sin(step * 0.2) * 0.05;
        ay = 0.48 + Math.cos(step * 0.3) * 0.08;
        az = 0.72;
        gx = 1.4; gy = 2.1; gz = -0.8;
      } else if (demoPostureState === 'dynamic') {
        // Alternating wave
        const isCurrentlyGood = Math.sin(step * 0.2) > 0;
        angleVal = isCurrentlyGood ? 6.5 + Math.sin(step) * 4 : 26.0 + Math.cos(step) * 5;
        statusVal = isCurrentlyGood ? 'CORRECT' : 'INCORRECT';
        ax = isCurrentlyGood ? 0.05 : 0.28;
        ay = isCurrentlyGood ? 0.14 : 0.52;
        az = isCurrentlyGood ? 0.96 : 0.68;
      } else {
        // Good posture with subtle organic breathing motion
        angleVal = 3.5 + Math.sin(step * 0.3) * 2.0;
        statusVal = 'CORRECT';
        ax = 0.04 + Math.sin(step * 0.1) * 0.02;
        ay = 0.11 + Math.cos(step * 0.1) * 0.03;
        az = 0.99;
      }

      const mockFeed = {
        created_at: now.toISOString(),
        field1: angleVal.toFixed(1),
        field2: statusVal,
        field3: ax.toFixed(2),
        field4: ay.toFixed(2),
        field5: az.toFixed(2),
        field6: gx.toFixed(2),
        field7: gy.toFixed(2),
        field8: gz.toFixed(2),
      };

      setLatestFeed(mockFeed);
      setLastSyncTime(now);

      setFeeds((prev) => {
        const next = [...prev, mockFeed];
        return next.slice(-60);
      });

      // Update simulation durations
      if (statusVal === 'CORRECT') {
        setGoodDurationMs((ms) => ms + 2000);
      } else {
        setBadDurationMs((ms) => ms + 2000);
      }

      const isCorrect = statusVal === 'CORRECT';
      const pred = isCorrect ? 'CORRECT' : 'INCORRECT';
      setAiResult({
        prediction: pred,
        confidence: isCorrect ? 96 : 91,
        source: 'Decision Tree AI (Simulator Engine)',
      });

      handleAlertTracking(pred);
    }, 2000);

    return () => clearInterval(demoInterval);
  }, [isDemoMode, demoPostureState, config.audioAlertsEnabled]);

  // Polling loop for Live Hardware Mode
  useEffect(() => {
    if (isDemoMode) return;

    fetchThingSpeak();
    const interval = setInterval(fetchThingSpeak, config.refreshInterval || 2500);
    return () => clearInterval(interval);
  }, [fetchThingSpeak, isDemoMode, config.refreshInterval]);

  // Derived current metrics
  const angle = latestFeed ? parseFloat(latestFeed.field1) : null;
  const isCorrect =
    aiResult.prediction === 'CORRECT' ||
    (latestFeed &&
      (String(latestFeed.field2).toUpperCase() === '1' ||
        String(latestFeed.field2).toUpperCase() === 'GOOD' ||
        String(latestFeed.field2).toUpperCase() === 'CORRECT'));

  const score = calculatePostureScore(angle !== null ? angle : isCorrect ? 8 : 32);

  const accel = {
    x: latestFeed ? parseFloat(latestFeed.field3) : null,
    y: latestFeed ? parseFloat(latestFeed.field4) : null,
    z: latestFeed ? parseFloat(latestFeed.field5) : null,
  };

  const gyro = {
    x: latestFeed ? parseFloat(latestFeed.field6) : null,
    y: latestFeed ? parseFloat(latestFeed.field7) : null,
    z: latestFeed ? parseFloat(latestFeed.field8) : null,
  };

  const imuCalculations = calculateIMUCalculations(accel.x, accel.y, accel.z);

  return {
    config,
    updateConfig,
    isDemoMode,
    setIsDemoMode,
    demoPostureState,
    setDemoPostureState,
    feeds,
    latestFeed,
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
    refreshData: fetchThingSpeak,
  };
}
