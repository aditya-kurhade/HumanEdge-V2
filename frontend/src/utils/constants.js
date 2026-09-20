export const DEFAULT_CONFIG = {
  channelId: import.meta.env.VITE_THINGSPEAK_CHANNEL_ID || '3448261',
  readApiKey: import.meta.env.VITE_THINGSPEAK_READ_API_KEY || 'ORC88T3Q6R7ZX21J',
  refreshInterval: import.meta.env.VITE_REFRESH_INTERVAL
    ? parseInt(import.meta.env.VITE_REFRESH_INTERVAL, 10)
    : 2000, // 2 seconds
  decisionTreeUrl: import.meta.env.VITE_DECISION_TREE_URL || 'http://127.0.0.1:5000/predict',
  audioAlertsEnabled: import.meta.env.VITE_AUDIO_ALERTS_ENABLED === 'true',
};

export const POSTURE_THRESHOLDS = {
  GOOD_ANGLE_MAX: 15,
  MODERATE_ANGLE_MAX: 25,
  MAX_SCALE_ANGLE: 45,
};

export const STORAGE_KEYS = {
  CONFIG: 'humanedge_posture_config_v2',
  SESSION_HISTORY: 'humanedge_session_history_v2',
};
