/**
 * file sounds.ts
 * description Web Audio 音频工具（完成音效等 UI 反馈声）
 * author YanYuCloudCube Team
 * version v1.0.0
 * created: 2026-04-01
 * updated: 2026-10-07
 * status: active
 * tags: [util],[audio],[webaudio]
 *
 * notes: 2026-10-07 移植自 yyc3-ui-organized/yyc3-shader-reminder-components
 */

export type SoundType = 'reminder' | 'confirmation' | 'completion';

let audioContext: AudioContext | null = null;

export const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playCompletionSound = () => {
  if (!audioContext) return;

  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.value = 0.12;

  const createCompletionTone = (freq: number, type: OscillatorType, delay: number, gainValue: number, duration: number) => {
    const oscillator = audioContext!.createOscillator();
    const gainNode = audioContext!.createGain();

    oscillator.type = type;
    oscillator.frequency.value = freq;

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    const now = audioContext!.currentTime;
    gainNode.gain.setValueAtTime(0, now + delay);
    gainNode.gain.linearRampToValueAtTime(gainValue, now + delay + 0.08);

    gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

    oscillator.start(now + delay);
    oscillator.stop(now + delay + duration);
  };

  const baseFreq = 440;

  createCompletionTone(baseFreq, 'sine', 0, 0.3, 0.7);
  createCompletionTone(baseFreq * 1.25, 'sine', 0.1, 0.2, 0.6);
  createCompletionTone(baseFreq * 1.5, 'sine', 0.2, 0.15, 0.5);
};
