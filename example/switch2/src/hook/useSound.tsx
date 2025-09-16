import { useEffect, useRef } from "react";


export default function useSound() {
  const unlockRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (unlockRef.current == null) return;
    // 1) 创建 AudioContext（大多数浏览器要求用户交互后 resume）
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    // 用于缓存解码后的音频数据
    const bufferCache = new Map();

    // 要加载的声音文件映射（key -> url）
    const sounds = {
      click: 'src/assets/sound/Select.mp3',     // 替换成真实文件路径
    };

    // 2) 预加载并解码所有音频（Promise 返回）
    async function loadAll() {
      const entries = Object.entries(sounds);
      await Promise.all(entries.map(async ([name, url]) => {
        const resp = await fetch(url);
        const arrayBuffer = await resp.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        bufferCache.set(name, audioBuffer);
      }));
    }

    // 3) 播放函数（每次创建独立 BufferSource -> 无冲突且可并发）
    function playSound(name: string, when = 0) {
      const buf = bufferCache.get(name);
      if (!buf) return;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(ctx.currentTime + when);
    }

    // 4) 首次需要用户交互来解锁 audio context（移动端/Chrome）
    unlockRef.current.addEventListener('click', unlockNLoad);

    // 5) 键盘事件：按下任何键播放 click
    window.addEventListener('keydown', () => {
      playSound('click');
    });

    async function unlockNLoad() {
      try {
        if (ctx.state === 'suspended') await ctx.resume();
        // 只在首次点击时加载音频（避免自动下载）
        await loadAll();
        console.log('Audio unlocked and sounds loaded.');
      } catch (err) {
        console.error('解锁或加载失败：', err);
      }
    }
  }, []);

  return unlockRef;
}