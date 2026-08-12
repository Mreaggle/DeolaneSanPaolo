<script lang="ts">
  import { onDestroy } from 'svelte';
  export let text: string;
  export let speed = 14;
  export let oncomplete: () => void = () => undefined;
  export let onadvance: () => void = () => undefined;
  export let oninteract: () => void = () => undefined;
  export let oncharacter: (character: string) => void = () => undefined;
  let shown = '';
  let done = false;
  let timer: number | undefined;

  const start = () => {
    if (timer) window.clearInterval(timer);
    shown = '';
    done = false;
    let index = 0;
    timer = window.setInterval(() => {
      const character = text[index] ?? '';
      shown = text.slice(0, ++index);
      if (/\S/.test(character)) oncharacter(character);
      if (index >= text.length) {
        done = true;
        if (timer) window.clearInterval(timer);
        oncomplete();
      }
    }, speed);
  };
  $: if (text) start();
  const complete = () => {
    oninteract();
    if (!done) {
      if (timer) window.clearInterval(timer);
      shown = text;
      done = true;
      oncomplete();
      return;
    }
    onadvance();
  };
  onDestroy(() => { if (timer) window.clearInterval(timer); });
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
