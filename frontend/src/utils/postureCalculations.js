import { POSTURE_THRESHOLDS } from './constants';

/**
 * Calculate session score 0 - 100 based on posture angle deviation
 */
export function calculatePostureScore(angle) {
  if (!Number.isFinite(angle)) return 0;
  const rawScore = 100 - (Math.abs(angle) / POSTURE_THRESHOLDS.MAX_SCALE_ANGLE) * 100;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Format milliseconds into HH:MM:SS
 */
export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return '00:00:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format milliseconds into Xh Ym or Xm
 */
export function formatMinutes(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return '0m';
  const minutes = Math.round(milliseconds / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
}

/**
 * Compute pitch, roll, and magnitude from 3-axis accelerometer
 */
export function calculateIMUCalculations(ax, ay, az) {
  if (!Number.isFinite(ax) || !Number.isFinite(ay) || !Number.isFinite(az)) {
    return { pitch: 0, roll: 0, magnitude: 1.0 };
  }
  const magnitude = Math.sqrt(ax * ax + ay * ay + az * az);
  const pitchRad = Math.atan2(ay, Math.sqrt(ax * ax + az * az));
  const rollRad = Math.atan2(-ax, az);
  const pitch = (pitchRad * 180) / Math.PI;
  const roll = (rollRad * 180) / Math.PI;
  return {
    pitch: Number(pitch.toFixed(1)),
    roll: Number(roll.toFixed(1)),
    magnitude: Number(magnitude.toFixed(2)),
  };
}

/**
 * Local Decision Tree classifier fallback based on accelerometer tilt & posture angle
 */
export function classifyPostureDecisionTree(ax, ay, az, angle) {
  // Posture angle primary check
  if (Number.isFinite(angle)) {
    if (Math.abs(angle) <= POSTURE_THRESHOLDS.GOOD_ANGLE_MAX) {
      return {
        prediction: 'CORRECT',
        confidence: Math.min(98, Math.max(82, Math.round(100 - Math.abs(angle) * 1.5))),
        source: 'Decision Tree (Angle Rules)',
      };
    } else {
      return {
        prediction: 'INCORRECT',
        confidence: Math.min(99, Math.max(78, Math.round(65 + Math.abs(angle) * 0.9))),
        source: 'Decision Tree (Angle Rules)',
      };
    }
  }

  // Fallback to Accel Y (forward tilt) and Accel Z (gravitational alignment)
  if (Number.isFinite(ay) && Number.isFinite(az)) {
    if (Math.abs(ay) < 0.28 && az > 0.85) {
      return {
        prediction: 'CORRECT',
        confidence: 90,
        source: 'Decision Tree (IMU G-Vector)',
      };
    } else {
      return {
        prediction: 'INCORRECT',
        confidence: 88,
        source: 'Decision Tree (IMU G-Vector)',
      };
    }
  }

  return {
    prediction: 'UNKNOWN',
    confidence: 0,
    source: 'Waiting for Sensor Stream',
  };
}

/**
 * Posture Assessment detailed metrics
 */
export function getDetailedAssessment(isCorrect, angle) {
  const absAngle = Math.abs(angle || 0);

  if (isCorrect && absAngle < 15) {
    return {
      neck: { text: 'Optimal (12°)', status: 'good' },
      spine: { text: 'Aligned / Neutral S-Curve', status: 'good' },
      shoulder: { text: 'Balanced & Retracted', status: 'good' },
      sitting: { text: 'Upright 90°-100° Pelvic Base', status: 'good' },
      recommendation: 'Outstanding spinal alignment! Keep maintaining your core stability.',
    };
  } else if (absAngle >= 15 && absAngle < 25) {
    return {
      neck: { text: 'Mild Forward Flexion (22°)', status: 'warning' },
      spine: { text: 'Moderate Thoracic Curve', status: 'warning' },
      shoulder: { text: 'Slight Protractions', status: 'warning' },
      sitting: { text: 'Slight Forward Shift', status: 'warning' },
      recommendation: 'Noticeable forward head posture. Gently pull your chin back and relax shoulders.',
    };
  } else {
    return {
      neck: { text: 'High Cervical Strain (>30°)', status: 'bad' },
      spine: { text: 'Excessive Slouch (Kyphotic)', status: 'bad' },
      shoulder: { text: 'Rounded Shoulders', status: 'bad' },
      sitting: { text: 'Posterior Pelvic Slump', status: 'bad' },
      recommendation: 'Correction required! Sit back against chair lumbar support and bring chest up.',
    };
  }
}
