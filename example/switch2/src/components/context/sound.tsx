import { useMemo, useRef, type ReactNode } from "react";
import { SoundContext } from "@/context";

export default function SoundProvider({ children }: { children: ReactNode }) {

  // 1) 创建 AudioContext（大多数浏览器要求用户交互后 resume）
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = useRef(new AudioContext());

  // 用于缓存解码后的音频数据
  const bufferCache = useRef(new Map());

  // 要加载的声音文件映射（key -> url）
  const sounds = {
    select: 'src/assets/sound/Select.mp3',     // 替换成真实文件路径
  };

  const contextVal = useMemo(() => ({
    playSound,
    unlockNLoad
  }), []);

  return <SoundContext value={contextVal}>{ children }</SoundContext>;

  // 2) 预加载并解码所有音频（Promise 返回）
  async function loadAll() {
    const entries = Object.entries(sounds);
    await Promise.all(entries.map(async ([name, url]) => {
      const resp = await fetch(url);
      const arrayBuffer = await resp.arrayBuffer();
      const audioBuffer = await ctx.current.decodeAudioData(arrayBuffer);
      bufferCache.current.set(name, audioBuffer);
    }));
  }

  // 3) 播放函数（每次创建独立 BufferSource -> 无冲突且可并发）
  function playSound(name: string, when = 0) {
    const buf = bufferCache.current.get(name);
    if (!buf) return;
    const src = ctx.current.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.current.destination);
    src.start(ctx.current.currentTime + when);
  }

  async function unlockNLoad() {
    try {
      if (ctx.current.state === 'suspended') await ctx.current.resume();
      // 只在首次点击时加载音频（避免自动下载）
      await loadAll();
      console.log('Audio unlocked and sounds loaded.');
    } catch (err) {
      console.error('解锁或加载失败：', err);
    }
  }
}