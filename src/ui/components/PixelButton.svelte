<script lang="ts">
  export let label: string;
  export let disabled = false;
  export let active = false;
  export let title = '';
  export let onactivate: () => void;
</script>

<button class:active disabled={disabled} {title} on:click={onactivate}><slot />{label}</button>

<style>
  button {
    min-height: 25px;
    padding: 3px 7px;
    color: #050505;
    background: #dedede;
    border: 2px solid;
    border-color: #fff #444 #444 #fff;
    border-radius: 0;
    box-shadow: inset -1px -1px #888, inset 1px 1px #f8f8f8;
    font: inherit;
    text-transform: uppercase;
    cursor: pointer;
  }
  button:hover:not(:disabled), button:focus-visible { color: #970f12; outline: 1px dotted #050505; outline-offset: -5px; }
  button:active:not(:disabled), button.active { border-color: #444 #fff #fff #444; padding: 4px 6px 2px 8px; }
  button:disabled { color: #777; background: #aaa; cursor: default; }
</style>

