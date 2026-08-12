<script lang="ts">
  import { onDestroy } from 'svelte';
  export let text: string;
  export let speed = 14;
  export let oncomplete: () => void = () => undefined;
  export let onadvance: () => void = () => undefined;
  export let oninteract: () => void = () => undefined;
  export let onaudiopulse: () => void = () => undefined;
  let shown = '';
  let done = false;
  let timer: number | undefined;
  let audioTimer: number | undefined;

  const stopTimers = () => {
    if (timer) window.clearInterval(timer);
    if (audioTimer) window.clearInterval(audioTimer);
    timer = undefined;
    audioTimer = undefined;
  };

  const start = () => {
    stopTimers();
    shown = '';
    done = false;
    let index = 0;
    onaudiopulse();
    audioTimer = window.setInterval(onaudiopulse, 150);
    timer = window.setInterval(() => {
      shown = text.slice(0, ++index);
      if (index >= text.length) {
        done = true;
        stopTimers();
        oncomplete();
      }
    }, speed);
  };
  $: if (text) start();
  const complete = () => {
    oninteract();
    if (!done) {
      stopTimers();
      shown = text;
      done = true;
      oncomplete();
      return;
    }
    onadvance();
  };
  onDestroy(stopTimers);
</script>

<button class="typewriter" type="button" aria-label={done ? 'Avançar' : 'Completar texto'} on:click={complete}>
  {shown}<span class:done class="caret">█</span>
</button>

<style>
  .typewriter { width: 100%; padding: 0; color: inherit; background: transparent; border: 0; font: inherit; text-align: left; white-space: pre-wrap; line-height: 1.42; cursor: default; }
  .caret { animation: blink .7s steps(1) infinite; }
  .caret.done { opacity: 0; animation: none; }
  @keyframes blink { 50% { opacity: 0; } }
</style>
