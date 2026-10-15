import React, { useState, useEffect } from 'react';
import childsPoseImg from '../assets/yoga_gif/Childs-Pose.webp';
import catCowImg from '../assets/yoga_gif/400x400_So_You_Want_to_Be_More_Flexible_Cat_Cow.webp';
import standingCatCowImg from '../assets/yoga_gif/Standing-Cat-Cow.webp';
import chestOpenerImg from '../assets/yoga_gif/Chest-opener.webp';
import forwardFoldImg from '../assets/yoga_gif/Forward-Fold.webp';
import plankFlowImg from '../assets/yoga_gif/High-plank-to-low-plank.webp';
import { SparklesIcon, CheckCircleIcon, PlayIcon, PauseIcon } from './Icons';

// Comprehensive biomechanical posture recovery routines mapped to all added GIF/WebP animations
const YOGA_POSES = [
  {
    id: 'childs-pose',
    name: "Balasana (Child's Pose)",
    category: 'Spinal Decompression & Relaxation',
    target: 'Lower Back, Lats, Hips & Sacrum',
    durationSeconds: 45,
    difficulty: 'Gentle Recovery',
    image: childsPoseImg,
    badge: 'Spinal Decompression',
    description:
      'A deeply restorative resting posture that gently elongates the spine, eases lower-back tension, and calms the nervous system after prolonged desk slouching.',
    cues: [
      'Kneel on the floor, bring big toes together, and sit on your heels.',
      'Separate knees hip-width apart and fold forward over your thighs.',
      'Extend arms long in front with palms grounded, gently resting forehead on mat.',
      'Breathe deeply into the back ribs, letting your sacrum release downward.',
    ],
    benefits: [
      'Decompresses lumbar intervertebral discs',
      'Encourages full diaphragm expansion',
      'Calms sympathetic posture strain & fatigue',
    ],
  },
  {
    id: 'cat-cow',
    name: 'Marjaryasana-Bitilasana (Cat-Cow)',
    category: 'Spinal Articulation & Thoracic Mobility',
    target: 'Cervical, Thoracic & Lumbar Spine',
    durationSeconds: 60,
    difficulty: 'Essential Mobility',
    image: catCowImg,
    badge: 'Thoracic Articulation',
    description:
      'Dynamic rhythmic flow synchronizing breath with movement to restore natural sagittal curvature and counteract kyphotic desk hunching.',
    cues: [
      'Begin on all fours: wrists stacked under shoulders, knees hip-width under hips.',
      'Inhale (Cow): Drop belly softly, roll shoulder blades down and back, lift chest.',
      'Exhale (Cat): Press palms into ground, draw belly button in, rounding upper back.',
      'Flow smoothly between both states matching breath cadence.',
    ],
    benefits: [
      'Lubricates facet joints throughout the vertebral column',
      'Counters static forward head and rounded shoulder posture',
      'Activates deep intrinsic multifidus stabilizers',
    ],
  },
  {
    id: 'standing-cat-cow',
    name: 'Standing Cat-Cow Flow',
    category: 'Desk-Side Microbreak Mobility',
    target: 'Upper Back, Pelvic Tilt & Thoracic Spine',
    durationSeconds: 45,
    difficulty: 'Quick Desk Reset',
    image: standingCatCowImg,
    badge: 'Desk-Side Friendly',
    description:
      'Standing variation engineered for immediate relief during work hours without needing a floor mat. Quickly balances anterior/posterior pelvic tilt.',
    cues: [
      'Stand feet hip-distance apart, soften knees, and place hands on thighs above knees.',
      'Inhale: Arch the spine, open the collarbones wide, lifting tailbone slightly.',
      'Exhale: Tuck tailbone under, round the back, pulling chin toward chest.',
      'Repeat 8–10 continuous cycles to break prolonged static seating lock.',
    ],
    benefits: [
      'Zero-equipment break feasible anywhere in the office',
      'Relieves lower thoracic and lumbosacral compression',
      'Stimulates core engagement and proprioception',
    ],
  },
  {
    id: 'chest-opener',
    name: 'Chest & Pectoral Opener',
    category: 'Anterior Chain Expansion',
    target: 'Pectoralis Major/Minor, Anterior Deltoids',
    durationSeconds: 45,
    difficulty: 'Posture Reversal',
    image: chestOpenerImg,
    badge: 'Anti-Slouch Reset',
    description:
      'Directly reverses the internal rotation of shoulders caused by keyboards and mice by opening the front ribcage and lengthening tight chest fibers.',
    cues: [
      'Stand or sit tall with an elongated spine and retracted chin.',
      'Clasp hands behind back or extend arms horizontally open with thumbs pointed backward.',
      'Gently retract shoulder blades together without flaring the lower ribs.',
      'Inhale deep thoracic breaths to feel the sternum lift and open.',
    ],
    benefits: [
      'Combats forward-rounded shoulders and hunched neck',
      'Increases lung capacity and oxygen intake during work',
      'Relieves anterior shoulder impingement pressure',
    ],
  },
  {
    id: 'forward-fold',
    name: 'Uttanasana (Forward Fold)',
    category: 'Posterior Kinetic Chain Release',
    target: 'Hamstrings, Calves, Glutes & Erector Spinae',
    durationSeconds: 50,
    difficulty: 'Deep Release',
    image: forwardFoldImg,
    badge: 'Gravity Decompression',
    description:
      'Uses gravitational traction to gently pull apart compressed spinal vertebrae while lengthening tight posterior chain muscles from prolonged chair sitting.',
    cues: [
      'Stand with feet parallel and micro-bend your knees to protect your lower back.',
      'Hinge forward from the hip joints rather than rounding at the waist.',
      'Let your head and neck hang completely relaxed like a heavy pendulum.',
      'Grasp opposite elbows or rest fingertips on the floor / shins.',
    ],
    benefits: [
      'Stretches shortened hamstrings that cause posterior pelvic tilt',
      'Provides natural gravitational cervical and lumbar traction',
      'Boosts cerebral blood flow to relieve mental fatigue',
    ],
  },
  {
    id: 'plank-flow',
    name: 'High to Low Plank Flow',
    category: 'Core Stability & Scapular Strength',
    target: 'Transverse Abdominis, Serratus Anterior, Triceps',
    durationSeconds: 40,
    difficulty: 'Active Strength',
    image: plankFlowImg,
    badge: 'Core Posture Anchor',
    description:
      'Dynamic endurance exercise reinforcing the deep abdominal wall and scapular stabilizers required to hold upright posture effortlessly all day.',
    cues: [
      'Start in solid high plank with wrists directly beneath shoulders and heels pressed back.',
      'Engage glutes and core so body forms a rigid, unbroken straight line.',
      'Transition smoothly between high plank and forearm/low plank with control.',
      'Avoid dipping the lumbar spine or sticking glutes up in the air.',
    ],
    benefits: [
      'Builds muscular endurance to prevent mid-day posture collapse',
      'Strengthens scapular stabilizers against winging',
      'Activates the entire anterior and posterior trunk corset',
    ],
  },
];

export function YogaSection() {
  const [activePoseId, setActivePoseId] = useState('childs-pose');
  const [isPlayingTimer, setIsPlayingTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [completedPoses, setCompletedPoses] = useState({});

  const activePose = YOGA_POSES.find((p) => p.id === activePoseId) || YOGA_POSES[0];

  // Timer countdown handler
  useEffect(() => {
    let interval = null;
    if (isPlayingTimer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlayingTimer(false);
      setCompletedPoses((prev) => ({ ...prev, [activePose.id]: true }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingTimer, timeLeft, activePose.id]);

  const selectPose = (pose) => {
    setActivePoseId(pose.id);
    setTimeLeft(pose.durationSeconds);
    setIsPlayingTimer(false);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(activePose.durationSeconds);
      setIsPlayingTimer(true);
    } else {
      setIsPlayingTimer((prev) => !prev);
    }
  };

  const resetTimer = () => {
    setIsPlayingTimer(false);
    setTimeLeft(activePose.durationSeconds);
  };

  const progressPercent = Math.round(
    ((activePose.durationSeconds - timeLeft) / activePose.durationSeconds) * 100
  );

  const totalCompletedCount = Object.keys(completedPoses).length;

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 border border-slate-800 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
              Ergonomic Yoga & Posture Recovery
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-medium">
                {YOGA_POSES.length} Animated Flows
              </span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Targeted biomechanical yoga flows and micro-movements designed to relieve spinal compression,
            mobilize thoracic segments, and re-anchor alignment after desk slouching.
          </p>
        </div>

        {/* Routine Progress Overview Badge */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Session Routine</span>
            <span className="text-sm font-bold font-heading text-emerald-400">
              {totalCompletedCount} of {YOGA_POSES.length} Poses Done
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-mono font-bold text-emerald-300">
            {Math.round((totalCompletedCount / YOGA_POSES.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Quick Pose Selector Strip */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-slate-800">
        {YOGA_POSES.map((pose) => {
          const isSelected = pose.id === activePoseId;
          const isDone = completedPoses[pose.id];
          return (
            <button
              key={pose.id}
              onClick={() => selectPose(pose)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {isDone ? (
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              )}
              <span>{pose.name.split(' (')[0]}</span>
              <span className="text-[10px] font-mono opacity-60">({pose.durationSeconds}s)</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 items-start">
        {/* Left Column: Visual Asset Display / Media Showcase */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-[#0b1322] shadow-2xl p-4 flex flex-col items-center justify-center min-h-[360px]">
            {/* Visual Badge */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-700/60 text-[11px] font-mono text-emerald-400 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{activePose.badge}</span>
            </div>

            <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-700/60 text-[11px] font-mono text-slate-300 backdrop-blur-md">
              {activePose.difficulty}
            </div>

            {/* Media: Display Animated GIF / WebP */}
            <div className="relative w-full flex items-center justify-center p-2 group">
              <img
                key={activePose.id}
                src={activePose.image}
                alt={activePose.name}
                className="w-full max-h-[290px] object-contain rounded-xl drop-shadow-[0_15px_30px_rgba(16,185,129,0.18)] transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-1 inset-x-2 text-center text-[11px] text-slate-400 font-mono bg-slate-950/75 py-1 rounded-md backdrop-blur-sm border border-slate-800/80">
                Visual Biomechanical Reference • Dynamic Form
              </div>
            </div>
          </div>

          {/* Interactive Guided Timer Strip */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimer}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-95"
                title={isPlayingTimer ? 'Pause' : 'Start Timer'}
              >
                {isPlayingTimer ? (
                  <PauseIcon className="w-5 h-5 text-slate-950" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-slate-950 ml-0.5" />
                )}
              </button>

              <div>
                <div className="text-xs text-slate-400 font-mono">Stretch Timer</div>
                <div className="text-lg font-bold font-mono text-white">
                  00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex-1 max-w-[140px] flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Hold</span>
                <span className="text-emerald-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={resetTimer}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-800 hover:border-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Column: Biomechanical Analysis & Coaching Cues */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Card Header Info */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                {activePose.category}
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">
                Target: {activePose.target}
              </span>
            </div>

            <h3 className="text-xl font-bold font-heading text-white">{activePose.name}</h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{activePose.description}</p>
          </div>

          {/* Stepped Alignment Instructions */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/70">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Ergonomic Alignment Protocol
            </h4>

            <div className="space-y-2.5">
              {activePose.cues.map((cue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-300"
                >
                  <span className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{cue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Posture Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activePose.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/15 flex flex-col gap-1.5"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>Clinical Benefit</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default YogaSection;
