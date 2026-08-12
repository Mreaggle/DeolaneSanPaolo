<script lang="ts">
  import { onMount } from 'svelte';
  import { actions, gameState, hasSave, uiState, type UiScreen } from './state/GameStore';
  import { resolveAsset } from './assets/registry';
  import { traitLabels, traitValueLabels } from './content';
  import type { TraitCategory } from './content';
  import type { WarrantInput } from './engine/types';
  import { displayCaseTime, investigationCost } from './engine/TimeEngine';
  import { AudioManager, type AudioSnapshot } from './audio/AudioManager';
  import { preloadGroups, type AudioCueId } from './audio/audioRegistry';
  import { arrivalAudioEvent, cueForAudioEvent, type AudioEventId } from './audio/audioEvents';
  import PixelButton from './ui/components/PixelButton.svelte';
  import TypewriterText from './ui/components/TypewriterText.svelte';

  let playerName = '';
  let root: HTMLDivElement;
  let warrant: WarrantInput = {};
  let scale = 1;
  let selectedPlaceId = '';
  let witnessTextComplete = true;
  let showOptions = false;
  let audioManager: AudioManager | undefined;
  let audioSnapshot: AudioSnapshot = { enabled: true, volume: .75, unlocked: false, ambientPlaying: false };
  let lastAudioKey = '';
  let detectingPlayer = false;
  let warrantBusy = false;
  let resultAnimationComplete = true;
  let actionsAreDisabled = false;
  let travelAnimationRun = 0;
  let sceneAssetId = 'agency-emblem';
  let sceneAlt = 'Cena da investigação';
  let scenePresentationKey = 'initial';
  let showSupport = false;
  let pixCopied = false;
  const categories: TraitCategory[] = ['sex', 'hair', 'hobby', 'feature', 'vehicle'];
  const supportPixCode = '00020126540014BR.GOV.BCB.PIX0111470052348470217DEOLANE-SAN-PAOLO5204000053039865802BR5916Kauan Crema Dias6009SAO PAULO62140510K1EVZGAMpp63044A02';
  const supportPaymentUrl = 'https://nubank.com.br/cobrar/18cvy/6a7bd4b6-3ce0-4c59-9431-5f49cd51dd9d';
  const supportQrCodeUrl = `${import.meta.env.BASE_URL}pix-qrcode.png`;

  const cityById = (id?: string) => actions.content.cities.find((city) => city.id === id);
  const placeById = (id?: string) => actions.content.places.find((place) => place.id === id);
  const suspectById = (id?: string) => actions.content.suspects.find((suspect) => suspect.id === id);
  const itemById = (id?: string) => actions.content.stolenItems.find((item) => item.id === id);
  const rankById = (id?: string) => actions.content.ranks.find((rank) => rank.id === id);
  const rankAssetId = (id?: string) => id ? `rank-${id}-badge` : 'rank-rookie-badge';
  const asset = resolveAsset;

  const updateScale = () => {
    const fit = Math.min((window.innerWidth - 8) / 640, (window.innerHeight - 28) / 400);
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse || fit < 2) scale = Math.max(.35, Math.floor(fit * 20) / 20);
    else scale = Math.max(2, Math.floor(fit));
    document.documentElement.style.setProperty('--stage-scale', String(scale));
  };

  const fullscreen = async () => {
    if (!document.fullscreenElement) {
      await root.requestFullscreen?.();
      const orientation = screen.orientation as ScreenOrientation & { lock?: (value: 'landscape') => Promise<void> };
      await orientation.lock?.('landscape').catch(() => undefined);
    } else await document.exitFullscreen?.();
    updateScale();
  };

  const submitName = () => {
    if (!playerName.trim() || detectingPlayer) return;
    detectingPlayer = true;
    requestAudioEvent('DETECTIVE_LOOKUP_STARTED');
    window.setTimeout(() => {
      actions.createProfile(playerName.trim().slice(0, 18));
      detectingPlayer = false;
    }, 650);
  };

  const computeWarrant = () => {
    if (warrantBusy) return;
    warrantBusy = true;
    window.setTimeout(() => {
      actions.warrant(warrant);
      warrantBusy = false;
    }, 850);
  };

  const requestCue = (cue: AudioCueId) => audioManager?.request(cue);
  const requestAudioEvent = (event: AudioEventId) => requestCue(cueForAudioEvent(event));

  const openWarrantComputer = () => {
    requestAudioEvent('WARRANT_COMPUTER_OPENED');
    actions.go('warrant', true);
  };

  const beginTravel = (cityId: string) => {
    travelAnimationRun += 1;
    requestAudioEvent('TRAVEL_STARTED');
    actions.travel(cityId);
  };

  const finishResultAnimation = () => {
    resultAnimationComplete = true;
    if ($uiState.event?.type !== 'CASE_SOLVED') return;
    requestAudioEvent($gameState?.activeCase?.definition.caseType === 'FINAL_DEOLANE' ? 'DEOLANE_CAPTURED' : 'CASE_SOLVED');
  };

  const screenAudioKey = (): string => {
    const event = $uiState.event;
    const detail = event?.type === 'ARRIVED' ? `${event.cityId}:${event.classification}:${event.henchmanAppeared}`
      : event?.type === 'INVESTIGATION_COMPLETED' ? event.clue.id
      : event?.type === 'CASE_FAILED' ? event.status
      : event?.type ?? '';
    return `${$gameState?.activeCase?.definition.id ?? 'none'}:${$uiState.screen}:${detail}`;
  };

  const syncScreenAudio = () => {
    if (!audioManager) return;
    const key = screenAudioKey();
    if (key === lastAudioKey) return;
    lastAudioKey = key;
    const active = $gameState?.activeCase;
    const event = $uiState.event;
    let requestedEvent: AudioEventId | undefined;
    const play = (audioEvent: AudioEventId) => {
      requestedEvent = audioEvent;
      requestAudioEvent(audioEvent);
    };
    if ($uiState.screen === 'title') play('TITLE_ENTERED');
    else if ($uiState.screen === 'signin') play('HEADQUARTERS_ENTERED');
    else if ($uiState.screen === 'new-player') play('DETECTIVE_NOT_FOUND');
    else if ($uiState.screen === 'news') {
      audioManager.preload(preloadGroups.case);
      if (active?.definition.caseType === 'FINAL_DEOLANE') audioManager.preload(preloadGroups.finale);
      play('NEWS_FLASH_STARTED');
    }
    else if ($uiState.screen === 'assignment') play(active?.definition.caseType === 'FINAL_DEOLANE' ? 'DEOLANE_THEME_REQUESTED' : 'CASE_ASSIGNMENT_SHOWN');
    else if ($uiState.screen === 'dossiers') play('DOSSIERS_OPENED');
    else if ($uiState.screen === 'traveling' && event?.type === 'ARRIVED') play('TRAVEL_STARTED');
    else if ($uiState.screen === 'warrant' && !event) play('WARRANT_COMPUTER_OPENED');
    else if ($uiState.screen === 'warrant' && event?.type === 'WARRANT_ISSUED') play('WARRANT_ISSUED');
    else if ($uiState.screen === 'warrant' && (event?.type === 'WARRANT_NO_MATCH' || event?.type === 'WARRANT_MULTIPLE_MATCHES')) play('WARRANT_INCONCLUSIVE');
    else if ($uiState.screen === 'witness' && active && event?.type === 'INVESTIGATION_COMPLETED' && !event.reviewed) {
      if (active.runtime.currentCityId === active.definition.finalCityId && selectedPlaceId !== active.definition.finalHideoutPlaceId) {
        play('FINAL_HIDEOUT_MISSED');
      } else if (active.definition.route.indexOf(active.runtime.currentCityId) === active.definition.route.length - 2 && active.runtime.investigationsThisVisit === 1) {
        play('CULPRIT_PROXIMITY_HIGH');
      }
    }
    else if ($uiState.screen === 'city' && event?.type === 'ARRIVED') {
      const arrivalEvent = arrivalAudioEvent(event.classification, event.henchmanAppeared, active?.runtime.audioFlags.finalCityPlayed ?? false);
      if (arrivalEvent) play(arrivalEvent);
      if (arrivalEvent === 'FINAL_CITY_REACHED') {
        actions.markAudioFlag('finalCityPlayed');
      }
    }
    else if ($uiState.screen === 'result' && event?.type === 'CASE_SOLVED') {
      resultAnimationComplete = false;
      play(active?.definition.caseType === 'FINAL_DEOLANE' ? 'FINAL_DEOLANE_FOUND' : 'CULPRIT_FOUND');
    } else if ($uiState.screen === 'result' && event?.type === 'CASE_FAILED') {
      resultAnimationComplete = false;
      play('CULPRIT_ESCAPED');
    } else if ($uiState.screen === 'promotion') play('RANK_PROMOTED');
    else if ($uiState.screen === 'hall-of-fame') play('HALL_OF_FAME_ENTERED');

    if (!requestedEvent && active?.runtime.status === 'ACTIVE' && active.runtime.elapsedHours >= 102 && !active.runtime.audioFlags.timeWarningPlayed) {
      play('TIME_WARNING_TRIGGERED');
      actions.markAudioFlag('timeWarningPlayed');
    }
  };

  $: {
    $uiState;
    $gameState;
    syncScreenAudio();
  }

  const gameplayScreens: UiScreen[] = ['city', 'places', 'witness', 'routes', 'travel', 'traveling', 'dossiers', 'warrant'];
  const statusText = (status?: string) => ({
    FAILED_TIME: 'O PRAZO ACABOU. A T.C.C. DESAPARECEU COM O OBJETO.',
    FAILED_NO_WARRANT: 'VOCÊ ENCONTROU O CULPADO SEM UM MANDADO VÁLIDO.',
    FAILED_WRONG_WARRANT: 'O MANDADO APONTAVA PARA A PESSOA ERRADA.',
    ABANDONED: 'O CASO FOI ARQUIVADO A SEU PEDIDO.'
  }[status ?? ''] ?? 'CASO ENCERRADO.');

  const eventText = (event = $uiState.event) => {
    if (!event) return '';
    if (event.type === 'INVESTIGATION_COMPLETED') return event.clue.text;
    if (event.type === 'ARRIVED') return ({
      CORRECT_FORWARD: event.henchmanAppeared ? 'UM CAPANGA DA T.C.C. SUMIU ENTRE OS PRÉDIOS. VOCÊ ESTÁ PERTO!' : 'A pista está quente. A T.C.C. passou por aqui.',
      FINAL_CITY: 'Movimento suspeito confirmado. O esconderijo está nesta cidade.',
      WRONG_CITY: 'Pista fria. Ninguém viu a T.C.C. por aqui.',
      OLD_ROUTE_CITY: 'Você voltou a uma pista antiga.',
      TRAIL_ANCHOR: 'De volta ao último paradeiro confirmado.'
    }[event.classification]);
    if (event.type === 'WARRANT_ISSUED') return `MANDADO EMITIDO PARA ${suspectById(event.suspectId)?.name.toUpperCase()}.`;
    if (event.type === 'WARRANT_NO_MATCH') return 'NENHUM SUSPEITO CORRESPONDE A ESSES DADOS.';
    if (event.type === 'WARRANT_MULTIPLE_MATCHES') return `${event.suspectIds.length} SUSPEITOS AINDA CORRESPONDEM. REÚNA MAIS PISTAS.`;
    return '';
  };

  const currentGeneratedCity = () => {
    try { return actions.currentCityDefinition(); } catch { return undefined; }
  };

  const visit = (placeId: string) => {
    selectedPlaceId = placeId;
    witnessTextComplete = false;
    const active = $gameState?.activeCase;
    if (active && active.runtime.currentCityId === active.definition.finalCityId && placeId === active.definition.finalHideoutPlaceId) {
      resultAnimationComplete = false;
    }
    actions.investigate(placeId);
  };

  const placeCost = (placeId: string): number => {
    const runtime = $gameState?.activeCase?.runtime;
    if (!runtime) return 0;
    if (runtime.visitedLocationKeys.includes(`${runtime.currentCityId}:${placeId}`)) return 0;
    return investigationCost(runtime.investigationsThisVisit);
  };

  const placeVisited = (placeId: string): boolean => {
    const runtime = $gameState?.activeCase?.runtime;
    return Boolean(runtime?.visitedLocationKeys.includes(`${runtime.currentCityId}:${placeId}`));
  };

  const setWarrant = (category: TraitCategory, value: string) => {
    warrant = { ...warrant, [category]: value || undefined };
  };

  const copyPixCode = async () => {
    try {
      await navigator.clipboard?.writeText(supportPixCode);
    } catch {
      const scratch = document.createElement('textarea');
      scratch.value = supportPixCode;
      scratch.setAttribute('readonly', 'true');
      scratch.style.position = 'fixed';
      scratch.style.left = '-9999px';
      document.body.appendChild(scratch);
      scratch.select();
      document.execCommand('copy');
      scratch.remove();
    }
    pixCopied = true;
    window.setTimeout(() => { pixCopied = false; }, 1800);
  };

  const keyboard = (event: KeyboardEvent) => {
    if (!gameplayScreens.includes($uiState.screen)) return;
    if (event.key === 'F11') { event.preventDefault(); void fullscreen(); }
    if ($uiState.screen === 'traveling' || ($uiState.screen === 'witness' && !witnessTextComplete)) return;
    const key = event.key.toLowerCase();
    if (key === '1' || key === 'v') actions.go('routes');
    if (key === '2' || key === 'p') actions.go('travel');
    if (key === '3' || key === 'b') actions.go('places');
    if (key === '4' || key === 'c') openWarrantComputer();
  };

  $: actionsAreDisabled = $uiState.screen === 'traveling' || ($uiState.screen === 'witness' && !witnessTextComplete);
  $: sceneAssetId = $uiState.screen === 'witness' && selectedPlaceId
    ? placeById(selectedPlaceId)?.backgroundAssetId ?? 'agency-emblem'
    : $uiState.screen === 'dossiers'
      ? 'dossier-cabinet-illustration'
      : cityById($gameState?.activeCase?.runtime.currentCityId)?.artworkAssetId ?? 'agency-emblem';
  $: sceneAlt = $uiState.screen === 'witness'
    ? placeById(selectedPlaceId)?.name ?? 'Local da investigação'
    : $uiState.screen === 'dossiers'
      ? 'Arquivo de dossiês'
      : cityById($gameState?.activeCase?.runtime.currentCityId)?.name ?? 'Cidade';
  $: scenePresentationKey = [
    $uiState.screen,
    $gameState?.activeCase?.runtime.currentCityId ?? 'none',
    selectedPlaceId,
    $uiState.event?.type === 'ARRIVED' ? `${$uiState.event.cityId}:${$uiState.event.classification}:${$uiState.event.henchmanAppeared}` : $uiState.event?.type ?? 'none',
    travelAnimationRun
  ].join(':');

  onMount(() => {
    audioManager = new AudioManager();
    audioManager.preload(preloadGroups.opening);
    const unsubscribeAudio = audioManager.subscribe((snapshot) => { audioSnapshot = snapshot; });
    const unlockAudio = () => { void audioManager?.unlock(); };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    syncScreenAudio();
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('keydown', keyboard);
    document.addEventListener('fullscreenchange', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      window.removeEventListener('keydown', keyboard);
      document.removeEventListener('fullscreenchange', updateScale);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      unsubscribeAudio();
      audioManager?.dispose();
    };
  });
</script>

<svelte:head>
  <title>Deolane San Paolo — Agência Federal</title>
  <meta name="theme-color" content="#050505" />
  <meta name="description" content="Jogo de investigação geográfica com alma de DOS." />
</svelte:head>

<svelte:window on:contextmenu|preventDefault />

<div class="app-shell" bind:this={root}>
  <div class="scale-box">
    <main class="game-stage" aria-label="Deolane San Paolo" data-audio-cue={audioSnapshot.currentCue ?? (audioSnapshot.ambientPlaying ? 'AMBIENT' : 'NONE')}>
      {#if $uiState.screen === 'title'}
        <section class="full-screen title-screen">
          <img class="full-art" src={asset('title-background')} alt="" />
          <div class="dither-shade"></div>
          <div class="title-copy">
            <img class="agency-title-emblem" src={asset('agency-emblem')} alt="Brasão da Agência Federal" />
            <div class="tiny-kicker">AGÊNCIA FEDERAL APRESENTA</div>
            <h1 class="visual-title">
              <img class="title-wordmark" src={asset('title-wordmark-retro')} alt="Where is Deolane San Paolo?" />
            </h1>
            <div class="tcc-line">NO RASTRO DA T.C.C.</div>
            <div class="title-actions">
              <PixelButton label="NOVO JOGO" onactivate={actions.newGame} />
              <PixelButton label="CONTINUAR" disabled={!$hasSave} onactivate={actions.continueGame} />
              <PixelButton label="TELA CHEIA" onactivate={() => void fullscreen()} />
            </div>
            <p>© 1991/2026 FEDERAL SOFTWARE · CLIQUE OU USE O TECLADO</p>
          </div>
        </section>
      {:else if $uiState.screen === 'signin'}
        <section class="terminal full-screen">
          <img class="full-art" src={asset('hq-background')} alt="Sede da Agência Federal" />
          <div class="terminal-frame">
            <div class="terminal-title">TERMINAL CENTRAL · AGÊNCIA FEDERAL</div>
            <TypewriterText text={'IDENTIFICAÇÃO OBRIGATÓRIA.\nDIGITE SEU NOME, INVESTIGADOR:'} speed={20} />
            <form on:submit|preventDefault={submitName}>
              <label for="player-name">NOME</label>
              <input id="player-name" bind:value={playerName} maxlength="14" autocomplete="off" />
              <PixelButton label={detectingPlayer ? 'CONSULTANDO...' : 'TRANSMITIR'} disabled={!playerName.trim() || detectingPlayer} onactivate={submitName} />
            </form>
          </div>
        </section>
      {:else if $uiState.screen === 'new-player'}
        <section class="terminal full-screen">
          <img class="full-art" src={asset('hq-background')} alt="Sede da Agência Federal" />
          <div class="terminal-frame paper">
            <img class="clerk" src={asset('agency-clerk-portrait')} alt="Atendente da Agência Federal" />
            <div class="terminal-title">CONSULTA AO ARQUIVO DE PESSOAL</div>
            <TypewriterText text={`PROCURANDO: ${$gameState?.profile.name.toUpperCase()}...\n\nNUNCA VI VOCÊ POR AQUI.\nNENHUMA FICHA. NENHUMA PROMOÇÃO.\n\nISSO MUDA AGORA.`} speed={18} />
            <PixelButton label="AGUARDAR BOLETIM" onactivate={actions.prepareCase} />
          </div>
        </section>
      {:else if $uiState.screen === 'news' && $gameState?.activeCase}
        <section class="full-screen narrative-screen">
          <img class="full-art" src={asset('news-flash-background')} alt="Plantão da Agência Federal" />
          <div class="news-card">
            <div class="flash">PLANTÃO FEDERAL</div>
            <h2>ROUBO INTERNACIONAL!</h2>
            <div class="item-shot"><img src={asset(itemById($gameState.activeCase.definition.stolenItemId)?.assetId ?? '')} alt="" /></div>
            <p><strong>{itemById($gameState.activeCase.definition.stolenItemId)?.name}</strong> desapareceu em <strong>{cityById($gameState.activeCase.definition.route[0])?.name}</strong>.</p>
            <p>Testemunhas ligam o crime à T.C.C. — Tríade Chapa-Coco.</p>
            <PixelButton label="RECEBER MISSÃO" onactivate={() => actions.go('assignment')} />
          </div>
        </section>
      {:else if $uiState.screen === 'assignment' && $gameState?.activeCase}
        <section class="full-screen narrative-screen">
          <img class="full-art" src={asset('assignment-background')} alt="Sala de briefing" />
          <div class="briefing">
            <h2>ORDEM DE SERVIÇO {$gameState.activeCase.definition.id.slice(-6).toUpperCase()}</h2>
            <TypewriterText text={`AGENTE: ${$gameState.profile.name}\nPATENTE: ${rankById($gameState.activeCase.definition.rankId)?.name}\nPRAZO: 120 HORAS\n\nSIGA AS PISTAS GEOGRÁFICAS. IDENTIFIQUE O LADRÃO. EMITA O MANDADO ANTES DO ENCONTRO FINAL.`} speed={8} />
            <PixelButton label="INICIAR INVESTIGAÇÃO" onactivate={() => actions.go('city')} />
          </div>
        </section>
      {:else if gameplayScreens.includes($uiState.screen) && $gameState?.activeCase}
        <section class:traveling={$uiState.screen === 'traveling'} class="dos-shell">
          <nav class="menu-bar" aria-label="Menu principal">
            <button on:click={() => { showOptions = false; actions.go('city'); }}>JOGO</button>
            <button on:click={() => showOptions = !showOptions}>OPÇÕES</button>
            <button on:click={() => { showOptions = false; actions.dossier(0); }}>DOSSIÊS</button>
            <span>AGÊNCIA FEDERAL</span>
            <button class="fullscreen-button" on:click={() => void fullscreen()} title="Tela cheia (F11)">□</button>
          </nav>
          {#if showOptions}
            <div class="options-menu">
              <b>OPÇÕES</b>
              <button class="sound-toggle" on:click={() => audioManager?.setEnabled(!audioSnapshot.enabled)}><img src={asset(audioSnapshot.enabled ? 'icon-sound-on' : 'icon-sound-off')} alt="" />SOM: {audioSnapshot.enabled ? 'LIGADO' : 'DESLIGADO'}</button>
              <label class="volume-control">VOLUME <input aria-label="Volume da música" type="range" min="0" max="1" step="0.05" value={audioSnapshot.volume} on:input={(event) => audioManager?.setVolume(Number(event.currentTarget.value))} /></label>
              <button on:click={() => { showOptions = false; void fullscreen(); }}>TELA CHEIA</button>
              <button on:click={() => { showOptions = false; actions.abandon(); }}>ABANDONAR CASO</button>
              <button on:click={() => showOptions = false}>FECHAR</button>
            </div>
          {/if}
          <div class="left-panel">
            <header class="city-header">
              <div><b>{cityById($gameState.activeCase.runtime.currentCityId)?.name}</b><small>{cityById($gameState.activeCase.runtime.currentCityId)?.country}</small></div>
              <time>{displayCaseTime($gameState.activeCase.runtime.elapsedHours)}</time>
            </header>
            <div class="scene">
              {#key scenePresentationKey}
                <img data-scene-asset={sceneAssetId} data-city-id={$gameState.activeCase.runtime.currentCityId} src={asset(sceneAssetId)} alt={sceneAlt} />
                {#if $uiState.screen === 'city' && $uiState.event?.type === 'ARRIVED' && $uiState.event.henchmanAppeared}
                  <div class="henchman-crossing" data-animation-run={travelAnimationRun} aria-label="Um capanga listrado da T.C.C. cruza a cidade correndo"><i style={`background-image:url(${asset('henchman-run-spritesheet')})`}></i></div>
                {/if}
              {/key}
              <div class="scene-label">{$gameState.activeCase.runtime.elapsedHours}/120 HORAS</div>
            </div>
          </div>
          <div class="right-panel">
            <section class:warrant-panel={$uiState.screen === 'warrant'} class="info-panel">
              {#if $uiState.screen === 'traveling'}
                <h2>EM TRÂNSITO</h2>
                {#key travelAnimationRun}
                  <div class="travel-animation" data-animation-run={travelAnimationRun}><i style={`background-image:url(${asset('travel-airplane-spritesheet')})`}></i></div>
                {/key}
                <p>O avião da Agência Federal cruza o mapa. O relógio do caso já está correndo.</p>
              {:else if $uiState.screen === 'city'}
                {@const currentCity = cityById($gameState.activeCase.runtime.currentCityId)}
                <h2>{currentCity?.name} · {currentCity?.country}</h2>
                {#if $uiState.event?.type === 'ARRIVED' && ['CORRECT_FORWARD', 'FINAL_CITY'].includes($uiState.event.classification)}
                  <div class="trail-animation-cue" data-animation-run={travelAnimationRun} aria-label="Pista quente"><i style={`background-image:url(${asset('trail-alert-spritesheet')})`}></i></div>
                {/if}
                <p class="city-intro">A Agência Federal registra sua chegada a {currentCity?.name}, em {currentCity?.country}. A fotografia oficial da cidade está exibida ao lado.</p>
                {#if $uiState.event?.type === 'ARRIVED'}<p class="trail-note">{eventText($uiState.event)}</p>{/if}
                <div class="city-brief"><b>PERFIL DA CIDADE</b><p>{currentCity?.brief}</p></div>
                <dl class="case-status"><dt>MANDADO</dt><dd>{suspectById($gameState.activeCase.runtime.activeWarrantSuspectId)?.name ?? 'NENHUM'}</dd><dt>PISTAS</dt><dd>{$gameState.activeCase.runtime.discoveredClueIds.length}</dd></dl>
              {:else if $uiState.screen === 'routes'}
                <h2>CIDADES DISPONÍVEIS</h2>
                <p>Conexões registradas a partir de {cityById($gameState.activeCase.runtime.currentCityId)?.name}:</p>
                <ol class="route-list">
                  {#each currentGeneratedCity()?.travelCandidates ?? [] as cityId}
                    <li><b>{cityById(cityId)?.name}</b><small>{cityById(cityId)?.country}</small></li>
                  {/each}
                </ol>
                <p class="route-hint">CONSULTA APENAS. USE PARTIR PARA SELECIONAR O DESTINO.</p>
              {:else if $uiState.screen === 'places'}
                <h2>ONDE INVESTIGAR?</h2>
                <div class="place-list">
                  {#each currentGeneratedCity()?.places ?? [] as generated, index}
                    <button class:visited={placeVisited(generated.placeId)} on:click={() => visit(generated.placeId)}><span>{index + 1}</span>{placeById(generated.placeId)?.name}<small>{placeVisited(generated.placeId) ? 'VISITADO' : `${placeCost(generated.placeId)}H`}</small></button>
                  {/each}
                </div>
                <p>Revisitar um local já consultado não gasta tempo.</p>
              {:else if $uiState.screen === 'witness'}
                {@const generated = currentGeneratedCity()?.places.find((entry) => entry.placeId === selectedPlaceId)}
                {@const witness = placeById(selectedPlaceId)?.witnesses.find((entry) => entry.id === generated?.witnessId)}
                <h2>{placeById(selectedPlaceId)?.name ?? 'DEPOIMENTO'}</h2>
                <div class="witness-row">
                  <img class="witness" src={asset(witness?.assetId ?? 'agency-clerk-portrait')} alt={witness?.name ?? 'Testemunha'} />
                  <div class="speech"><b class="witness-name">{witness?.name ?? 'TESTEMUNHA'}</b><TypewriterText text={eventText($uiState.event)} speed={30} oninteract={() => { witnessTextComplete = true; }} onadvance={() => actions.go('places')} /></div>
                </div>
                <PixelButton label="OUTRO LOCAL" onactivate={() => actions.go('places')} />
              {:else if $uiState.screen === 'travel'}
                <h2>CONEXÕES DISPONÍVEIS</h2>
                <div class="map-box"><img src={asset('world-map')} alt="Mapa-múndi" />
                  {#each currentGeneratedCity()?.travelCandidates ?? [] as cityId}
                    {@const marker = cityById(cityId)}
                    {#if marker}<i data-city-id={cityId} style={`left:${marker.coordinates.x * 100}%;top:${marker.coordinates.y * 100}%`}></i>{/if}
                  {/each}
                </div>
                <div class="destination-list">
                  {#each currentGeneratedCity()?.travelCandidates ?? [] as cityId}
                    <button on:click={() => beginTravel(cityId)}>{cityById(cityId)?.name}</button>
                  {/each}
                </div>
              {:else if $uiState.screen === 'dossiers'}
                {@const suspect = actions.content.suspects[$uiState.selectedDossierIndex]}
                {#if suspect}
                  <h2><img class="header-emblem" src={asset('tcc-emblem')} alt="" /> ARQUIVO T.C.C. · {$uiState.selectedDossierIndex + 1}/10</h2>
                  <div class="dossier">
                    <img src={asset(suspect.dossierAssetId)} alt={suspect.name} />
                    <div><h3>{suspect.name}</h3><p>{suspect.occupation}</p><p>{suspect.biography}</p>
                      <dl class="traits">
                        {#each categories as category}<dt>{traitLabels[category]}</dt><dd>{traitValueLabels[suspect.traits[category]] ?? suspect.traits[category]}</dd>{/each}
                      </dl>
                    </div>
                  </div>
                  <div class="pager"><PixelButton label="◀" disabled={$uiState.selectedDossierIndex === 0} onactivate={() => actions.dossier($uiState.selectedDossierIndex - 1)} /><PixelButton label="▶" disabled={$uiState.selectedDossierIndex === 9} onactivate={() => actions.dossier($uiState.selectedDossierIndex + 1)} /></div>
                {/if}
              {:else if $uiState.screen === 'warrant'}
                <div class="warrant-console">
                  <img class="warrant-machine" src={asset('warrant-computer-panel')} alt="Computador de mandados visto de frente" />
                  <div class="warrant-screen-ui">
                    <h2>COMPUTADOR DE MANDADOS</h2>
                    <div class="warrant-grid">
                      {#each categories as category}
                        <label>{traitLabels[category]}
                          <select value={warrant[category] ?? ''} on:change={(event) => setWarrant(category, event.currentTarget.value)}>
                            <option value="">DESCONHECIDO</option>
                            {#each Array.from(new Set(actions.content.suspects.map((s) => s.traits[category]))) as value}
                              <option {value}>{traitValueLabels[value] ?? value}</option>
                            {/each}
                          </select>
                        </label>
                      {/each}
                    </div>
                    <div class="warrant-result">{eventText($uiState.event) || 'PREENCHA SÓ OS TRAÇOS CONFIRMADOS. CONSULTA: 2 HORAS.'}</div>
                    <div class="warrant-submit"><PixelButton label={warrantBusy ? 'CALCULANDO...' : 'COMPUTAR MANDADO'} disabled={warrantBusy} onactivate={computeWarrant} /></div>
                  </div>
                </div>
              {/if}
            </section>
            <nav class="action-bar" aria-label="Ações de investigação">
              <button disabled={actionsAreDisabled} class:active={$uiState.screen === 'routes'} on:click={() => actions.go('routes')}><img class="pixel-icon" src={asset('icon-see')} alt="" />VER<small>[V/1]</small></button>
              <button disabled={actionsAreDisabled} class:active={$uiState.screen === 'travel'} on:click={() => actions.go('travel')}><img class="pixel-icon" src={asset('icon-depart')} alt="" />PARTIR<small>[P/2]</small></button>
              <button disabled={actionsAreDisabled} class:active={$uiState.screen === 'places'} on:click={() => actions.go('places')}><img class="pixel-icon" src={asset('icon-search')} alt="" />BUSCAR<small>[B/3]</small></button>
              <button disabled={actionsAreDisabled} class:active={$uiState.screen === 'warrant'} on:click={openWarrantComputer}><img class="pixel-icon" src={asset('icon-pc')} alt="" />P.C<small>[C/4]</small></button>
            </nav>
          </div>
        </section>
      {:else if $uiState.screen === 'result' && $gameState?.activeCase}
        <section class="full-screen narrative-screen result-screen">
          <img class="full-art" src={asset($uiState.event?.type === 'CASE_SOLVED' ? 'case-solved-background' : `case-failed-${$gameState.activeCase.runtime.status === 'FAILED_TIME' ? 'time' : $gameState.activeCase.runtime.status === 'FAILED_NO_WARRANT' ? 'no-warrant' : $gameState.activeCase.runtime.status === 'FAILED_WRONG_WARRANT' ? 'wrong-warrant' : 'abandoned'}-background`)} alt="" />
          <div class:success={$uiState.event?.type === 'CASE_SOLVED'} class="result-card">
            <h2>{$uiState.event?.type === 'CASE_SOLVED' ? 'CASO ENCERRADO!' : 'A T.C.C. ESCAPOU'}</h2>
            <img class="result-suspect" src={asset(suspectById($gameState.activeCase.definition.culpritId)?.encounterAssetId ?? '')} alt={suspectById($gameState.activeCase.definition.culpritId)?.name ?? 'Suspeito'} />
            <div class="result-animation" aria-label={$uiState.event?.type === 'CASE_SOLVED' ? 'Animação de captura' : 'Animação de fuga'}><i class:escape={$uiState.event?.type !== 'CASE_SOLVED'} style={`background-image:url(${asset($uiState.event?.type === 'CASE_SOLVED' ? 'capture-spritesheet' : 'escape-spritesheet')})`} on:animationend={finishResultAnimation}></i></div>
            <p>{$uiState.event?.type === 'CASE_SOLVED' ? `${suspectById($gameState.activeCase.definition.culpritId)?.name} foi detido. O objeto roubado voltou ao acervo.` : statusText($gameState.activeCase.runtime.status)}</p>
            <p>TEMPO: {$gameState.activeCase.runtime.elapsedHours}H · CASOS RESOLVIDOS: {$gameState.profile.solvedCases}</p>
            <PixelButton label={resultAnimationComplete ? 'RELATÓRIO À SEDE' : 'AGUARDE A SEQUÊNCIA...'} disabled={!resultAnimationComplete} onactivate={actions.afterResult} />
          </div>
        </section>
      {:else if $uiState.screen === 'promotion' && $gameState}
        <section class="full-screen terminal promotion-screen">
          <img class="full-art" src={asset('promotion-background')} alt="Cerimônia de promoção" />
          <div class="terminal-frame paper"><h2>PROMOÇÃO AUTORIZADA</h2><img class="rank-badge" src={asset(rankAssetId($gameState.profile.solvedCases >= 10 ? 'ace-detective' : $gameState.profile.solvedCases >= 7 ? 'investigator' : $gameState.profile.solvedCases >= 4 ? 'private-eye' : 'sleuth'))} alt="Insígnia" /><p>AGENTE {$gameState.profile.name.toUpperCase()}, SUA NOVA PATENTE É:</p><h1>{rankById($gameState.profile.solvedCases >= 10 ? 'ace-detective' : $gameState.profile.solvedCases >= 7 ? 'investigator' : $gameState.profile.solvedCases >= 4 ? 'private-eye' : 'sleuth')?.name}</h1><PixelButton label="PRÓXIMO CASO" onactivate={actions.prepareCase} /></div>
        </section>
      {:else if $uiState.screen === 'hall-of-fame' && $gameState}
        <section class="full-screen narrative-screen hall-screen">
          <img class="full-art" src={asset('hall-of-fame-background')} alt="Galeria de honra" />
          <div class="result-card success"><h2>GALERIA DE HONRA</h2><p>DEOLANE SAN PAOLO FOI CAPTURADA.<br />A TRÍADE CHAPA-COCO PERDEU SUA CHEFE.</p><h1>{$gameState.profile.name}</h1><p>{$gameState.profile.solvedCases} CASOS RESOLVIDOS · DETETIVE ÁS</p><PixelButton label="VOLTAR AO TÍTULO" onactivate={() => actions.go('title')} /></div>
        </section>
      {/if}
    </main>
  </div>
  <footer class="site-footer">
    <div class="site-credit">Developed &amp; Powered-By <a href="https://instagram.com/mreaggle" target="_blank" rel="noopener noreferrer">@Mreaggle</a></div>
    <button class="support-toggle" type="button" aria-expanded={showSupport} aria-controls="support-panel" on:click={() => showSupport = !showSupport}>APOIAR</button>
  </footer>
  {#if showSupport}
    <aside id="support-panel" class="support-panel" aria-label="Apoiar Deolane San Paolo">
      <button class="support-close" type="button" aria-label="Fechar apoio" on:click={() => showSupport = false}>×</button>
      <strong>APOIE O JOGO</strong>
      <p>Deolane San Paolo é um jogo gratuito e independente. Apoie com quanto quiser!</p>
      <img src={supportQrCodeUrl} alt="QR Code Pix para apoiar Deolane San Paolo" />
      <textarea readonly aria-label="Código Pix copia e cola" value={supportPixCode}></textarea>
      <div class="support-actions">
        <button type="button" on:click={copyPixCode}>{pixCopied ? 'COPIADO' : 'COPIAR PIX'}</button>
        <a href={supportPaymentUrl} target="_blank" rel="noopener noreferrer">PAGAR</a>
      </div>
    </aside>
  {/if}
  <div class="rotate-notice">GIRE O CELULAR PARA JOGAR EM PAISAGEM<br />DEPOIS TOQUE EM “TELA CHEIA”.</div>
</div>

<style>
  .full-screen { position: absolute; inset: 0; overflow: hidden; background: #111; }
  .full-art { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated; }
  .dither-shade { position: absolute; inset: 0; background-color: rgba(0,0,0,.28); }
  .title-copy { position: absolute; inset: 22px 28px 18px 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; text-shadow: 2px 2px #000; }
  .tiny-kicker { padding: 3px 7px; color: #050505; background: #f6d21d; text-shadow: none; letter-spacing: 1px; }
  .agency-title-emblem { width: 46px; height: 46px; margin-bottom: 2px; object-fit: contain; image-rendering: pixelated; }
  h1, h2, h3, p { margin-top: 0; }
  .visual-title { width: 184px; height: 126px; margin: 3px 0 1px; }
  .title-wordmark { width: 100%; height: 100%; object-fit: contain; image-rendering: pixelated; }
  .tcc-line { margin-bottom: 8px; padding: 3px 12px; color: #ffd92a; border: 2px solid #ffd92a; font-weight: 700; }
  .title-actions { display: grid; gap: 4px; width: 150px; }
  .title-copy p { position: absolute; bottom: -7px; margin: 0; font-size: 7px; }
  .terminal { display: grid; place-items: center; color: #21df50; background-color: #041006; }
  .terminal-frame { position: relative; z-index: 1; width: 500px; min-height: 240px; padding: 20px; border: 4px double #25a94b; background: #041006; box-shadow: inset 0 0 0 2px #020; font-size: 13px; }
  .terminal-frame.paper { color: #111; background: #ddd6b2; border-color: #fff #555 #555 #fff; box-shadow: inset 0 0 0 2px #888; }
  .terminal-title { margin: -12px -12px 20px; padding: 5px 8px; color: #020; background: #25d857; font-weight: 700; }
  .clerk { float: right; width: 74px; height: 108px; margin: 20px 0 4px 12px; object-fit: contain; }
  form { display: flex; align-items: center; gap: 8px; margin-top: 28px; }
  input { width: 245px; padding: 5px; color: #26f055; background: #000; border: 2px solid #2a6; text-transform: uppercase; }
  .narrative-screen { color: #fff; }
  .news-card, .briefing, .result-card { position: absolute; padding: 14px; color: #080808; background: #ddd; border: 3px solid; border-color: #fff #333 #333 #fff; box-shadow: 5px 5px 0 #000; }
  .news-card { top: 40px; right: 35px; width: 285px; min-height: 310px; }
  .flash { margin: -14px -14px 10px; padding: 6px; color: #fff; background: #b20e16; font-size: 17px; font-weight: 700; text-align: center; }
  .news-card h2 { font-size: 17px; text-align: center; }
  .item-shot { float: left; display: grid; place-items: center; width: 86px; height: 74px; margin: 0 10px 6px 0; background: #050505; border: 2px inset #777; }
  .item-shot img { max-width: 78px; max-height: 66px; }
  .briefing { left: 65px; bottom: 35px; width: 510px; min-height: 225px; }
  .briefing h2 { padding-bottom: 5px; border-bottom: 2px solid #111; }
  .dos-shell { position: absolute; inset: 0; display: grid; grid-template: 22px 378px / 300px 340px; background: #bebebe; }
  .menu-bar { grid-column: 1 / 3; display: flex; align-items: center; gap: 1px; padding: 1px 3px; color: #050505; background: #ddd; border-bottom: 2px solid #333; }
  .menu-bar button { height: 18px; padding: 1px 8px; background: transparent; border: 0; font-size: 9px; }
  .menu-bar button:hover { color: #9b0c13; text-decoration: underline; }
  .menu-bar span { margin-left: auto; margin-right: 5px; font-size: 8px; }
  .menu-bar .fullscreen-button { width: 21px; padding: 0; color: #fff; background: #333; }
  .options-menu { position: absolute; z-index: 5; top: 19px; left: 44px; display: grid; width: 175px; padding: 3px; background: #ddd; border: 2px solid; border-color: #fff #333 #333 #fff; box-shadow: 3px 3px 0 #111; }
  .options-menu b { padding: 4px 5px; color: #fff; background: #111; }
  .options-menu button { padding: 5px; border: 0; background: transparent; text-align: left; }
  .options-menu button:hover { color: #970f12; background: #fff; }
  .options-menu .sound-toggle { display: flex; align-items: center; gap: 5px; }
  .sound-toggle img { width: 16px; height: 16px; image-rendering: pixelated; }
  .volume-control { display: grid; grid-template-columns: 48px 1fr; align-items: center; padding: 4px 5px; font-size: 8px; }
  .volume-control input { width: 105px; height: 12px; padding: 0; accent-color: #111; }
  .dos-shell.traveling .menu-bar button { pointer-events: none; color: #777; }
  .left-panel { display: grid; grid-template-rows: 46px 332px; border-right: 2px solid #111; }
  .city-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 7px; color: #080808; background: #efefef; border-bottom: 2px solid #111; }
  .city-header b { display: block; max-width: 205px; overflow: hidden; font-size: 16px; line-height: 1; white-space: nowrap; text-overflow: ellipsis; }
  .city-header small { display: block; margin-top: 3px; font-size: 8px; text-transform: uppercase; }
  .city-header time { max-width: 105px; padding: 5px; color: #fff; background: #111; font-size: 8px; text-align: center; }
  .scene { position: relative; overflow: hidden; background: #111; }
  .scene > img { width: 300px; height: 332px; object-fit: cover; }
  .henchman-crossing { position: absolute; z-index: 3; inset: 0; overflow: hidden; pointer-events: none; }
  .henchman-crossing::after { content: ''; position: absolute; right: 8px; bottom: 67px; width: 15px; height: 3px; background: #d7c39b; box-shadow: -14px 4px #76664e, -29px 1px #d7c39b; animation: getaway-dust 4.4s steps(4) forwards; }
  .henchman-crossing i { position: absolute; left: -68px; bottom: 39px; width: 64px; height: 64px; background-size: 512px 64px; background-repeat: no-repeat; image-rendering: pixelated; animation: henchman-frames .64s steps(8) infinite, henchman-path 4.4s linear forwards; }
  @keyframes henchman-frames { to { background-position: -512px 0; } }
  @keyframes henchman-path { 0% { left: -68px; bottom: 35px; } 18% { bottom: 43px; } 52% { bottom: 37px; } 82% { bottom: 45px; } 100% { left: 304px; bottom: 39px; } }
  @keyframes getaway-dust { 0%, 76% { opacity: 0; } 78%, 94% { opacity: 1; } 100% { opacity: 0; } }
  .scene-label { position: absolute; left: 5px; bottom: 5px; padding: 3px 5px; color: #fff; background: #111; border: 1px solid #fff; }
  .right-panel { display: grid; grid-template-rows: 306px 72px; }
  .info-panel { position: relative; overflow: hidden; padding: 10px 12px; color: #fff; background-color: #050505; border-bottom: 2px solid #111; }
  .info-panel h2 { margin: -10px -12px 9px; padding: 6px 9px; color: #050505; background: #dedede; border-bottom: 2px solid #777; font-size: 12px; letter-spacing: .5px; }
  .header-emblem { width: 14px; height: 14px; margin: -3px 2px -3px 0; vertical-align: middle; }
  .trail-animation-cue { float: right; display: grid; place-items: center; width: 44px; height: 54px; margin: 0 1px 4px 7px; overflow: hidden; background: #162940; border: 2px ridge #999; }
  .trail-animation-cue i { display: block; width: 32px; height: 48px; background-size: 128px 48px; background-repeat: no-repeat; image-rendering: pixelated; animation: trail-frames .72s steps(4) 5; }
  @keyframes trail-frames { to { background-position: -128px 0; } }
  .info-panel p { font-size: 10px; line-height: 1.45; }
  .city-intro { margin-bottom: 5px; }
  .trail-note { margin-bottom: 5px; color: #ffd92a; }
  .city-brief { clear: both; margin-bottom: 6px; padding: 5px 6px; color: #050505; background: #dedede; border: 1px solid #777; font-size: 8px; line-height: 1.35; }
  .city-brief p { margin: 3px 0 0; font-size: 8px; line-height: 1.35; }
  .case-status { display: grid; grid-template-columns: 65px 1fr; gap: 3px; clear: both; padding: 7px; color: #000; background: #fff; border: 1px solid #555; }
  .case-status dt { font-weight: 700; }
  .case-status dd { margin: 0; }
  .action-bar { display: grid; grid-template-columns: repeat(4, 1fr); background: #bbb; }
  .action-bar button { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; color: #050505; background: #ddd; border: 2px solid; border-color: #fff #444 #444 #fff; font-size: 8px; font-weight: 700; }
  .action-bar button.active, .action-bar button:active { border-color: #444 #fff #fff #444; background: #bbb; }
  .action-bar button:disabled { color: #777; background: #aaa; }
  .action-bar small { position: absolute; right: 3px; bottom: 2px; font-size: 6px; }
  .pixel-icon { width: 24px; height: 24px; object-fit: contain; }
  .travel-animation { position: relative; height: 155px; margin: 18px 0 10px; overflow: hidden; background: #122947; border: 3px ridge #999; }
  .travel-animation::before { content: ''; position: absolute; left: 35px; top: 27px; width: 26px; height: 6px; background: #dce8f1; box-shadow: 8px -5px #dce8f1, 18px 1px #dce8f1, 176px 24px #8aa1b7, 188px 19px #8aa1b7; animation: cloud-scroll 3.2s linear forwards; }
  .travel-animation::after { content: ''; position: absolute; left: 0; right: 0; top: 78px; height: 2px; background: #fff; box-shadow: 0 16px #888, 0 32px #333; }
  .travel-animation i { position: absolute; z-index: 1; left: -38px; top: 86px; width: 32px; height: 32px; background-size: 128px 32px; background-repeat: no-repeat; image-rendering: pixelated; animation: plane-frames .72s steps(4) infinite, plane-takeoff 3.2s cubic-bezier(.25,.05,.55,1) forwards; }
  @keyframes plane-frames { to { background-position: -128px 0; } }
  @keyframes plane-takeoff { 0% { left: -38px; top: 91px; } 22% { top: 84px; } 58% { top: 49px; } 82% { top: 33px; } 100% { left: 336px; top: 19px; } }
  @keyframes cloud-scroll { to { transform: translateX(-85px); } }
  .place-list { display: grid; gap: 7px; margin: 16px 6px; }
  .place-list button { display: grid; grid-template-columns: 26px 1fr 55px; align-items: center; padding: 6px; border: 2px solid #111; background: #fff; text-align: left; }
  .place-list button.visited { background: #d4d4d4; }
  .place-list button span { display: grid; place-items: center; width: 19px; height: 19px; color: #fff; background: #111; }
  .place-list button small { font-size: 7px; text-align: right; }
  .place-list button.visited small { font-weight: 700; }
  .witness-row { display: grid; grid-template-columns: 112px 1fr; gap: 9px; min-height: 205px; }
  .witness { width: 112px; height: 176px; object-fit: contain; object-position: center bottom; background: #142743; border: 2px solid #111; }
  .speech { position: relative; height: 170px; padding: 12px; color: #000; background: #fff; border: 2px solid #111; font-size: 11px; line-height: 1.5; }
  .speech::before { content: ''; position: absolute; left: -10px; top: 24px; width: 14px; height: 14px; background: #fff; border-left: 2px solid #111; border-bottom: 2px solid #111; transform: rotate(45deg); }
  .witness-name { display: block; margin: -12px -12px 9px; padding: 4px 7px; color: #fff; background: #111; text-transform: uppercase; }
  .map-box { position: relative; height: 130px; overflow: hidden; background: #09233f; border: 2px solid #111; }
  .map-box img { width: 100%; height: 100%; object-fit: fill; }
  .map-box i { position: absolute; width: 6px; height: 6px; margin: -3px 0 0 -3px; background: #f6242d; border: 1px solid #fff; animation: flash-dot .7s steps(1) infinite; }
  @keyframes flash-dot { 50% { background: #fff; } }
  .destination-list { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 7px; }
  .destination-list button { padding: 4px; color: #fff; background: #111; border: 2px solid #777; text-align: left; }
  .route-list { display: grid; gap: 5px; margin: 11px 4px; padding: 0; list-style: none; counter-reset: route; }
  .route-list li { counter-increment: route; display: grid; grid-template-columns: 24px 1fr auto; align-items: center; min-height: 28px; padding: 4px 6px; color: #050505; background: #dedede; border: 2px solid; border-color: #fff #444 #444 #fff; }
  .route-list li::before { content: counter(route); display: grid; place-items: center; width: 17px; height: 17px; color: #fff; background: #111; }
  .route-list small { font-size: 7px; text-transform: uppercase; }
  .route-hint { color: #ffd92a; font-size: 8px !important; }
  .dossier { display: grid; grid-template-columns: 118px 1fr; gap: 10px; }
  .dossier img { width: 118px; height: 176px; object-fit: cover; border: 3px double #111; }
  .dossier h3 { margin: 0 0 3px; color: #f12a32; font-size: 14px; }
  .traits { display: grid; grid-template-columns: 63px 1fr; gap: 1px 4px; margin: 5px 0 0; font-size: 7px; }
  .traits dt { font-weight: 700; }
  .traits dd { margin: 0; }
  .pager { position: absolute; right: 10px; bottom: 8px; display: flex; gap: 4px; }
  .info-panel.warrant-panel { padding: 0; }
  .warrant-console { position: absolute; inset: 0; overflow: hidden; }
  .warrant-machine { position: absolute; inset: 0; width: 340px; height: 306px; object-fit: fill; image-rendering: pixelated; }
  .warrant-screen-ui { position: absolute; z-index: 1; left: 40px; top: 35px; width: 260px; height: 211px; padding: 4px 6px; color: #8ef4e5; }
  .warrant-screen-ui h2 { margin: 0 0 4px; padding: 0 0 3px; color: #8ef4e5; background: transparent; border-bottom: 1px solid #3a7d80; font-size: 9px; text-align: center; letter-spacing: 0; }
  .warrant-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 6px; }
  .warrant-grid label { color: #8ef4e5; font-size: 6px; font-weight: 700; }
  .warrant-grid select { display: block; width: 100%; height: 18px; margin-top: 1px; padding: 0 2px; color: #d8fff5; background: #071a29; border: 1px solid #4e9695; border-radius: 0; font-family: inherit; font-size: 7px; }
  .warrant-result { min-height: 29px; margin: 4px 0; padding: 3px 4px; color: #63f399; background: #02080f; border: 1px solid #3a7d80; font-size: 7px; line-height: 1.25; }
  .warrant-submit { display: flex; justify-content: center; font-size: 7px; }
  .warrant-submit :global(button) { min-height: 20px; padding: 2px 6px; }
  .result-screen, .hall-screen { display: grid; place-items: center; }
  .result-card { inset: auto; width: 410px; min-height: 190px; text-align: center; }
  .result-suspect { float: left; width: 76px; height: 104px; margin: 0 10px 5px 0; object-fit: contain; background: #111; border: 2px solid #777; }
  .result-animation { display: grid; place-items: center; width: 104px; height: 72px; margin: 3px auto; overflow: hidden; background: #315765; border: 2px inset #777; }
  .result-animation i { display: block; width: 48px; height: 64px; background-size: 192px 64px; background-repeat: no-repeat; image-rendering: pixelated; animation: result-frames .9s steps(4) 4; }
  .result-animation i.escape { background-position: 0 0; }
  @keyframes result-frames { to { background-position: -192px 0; } }
  .result-card h2 { margin: -14px -14px 15px; padding: 7px; color: #fff; background: #a30b12; }
  .result-card.success h2, .result-card.success > h2 { background: #196c31; }
  .promotion-screen h1 { color: #9f0d13; font-size: 28px; text-transform: uppercase; }
  .rank-badge { float: right; width: 72px; height: 72px; margin: 0 10px; image-rendering: pixelated; }
  .hall-screen .result-card { color: #fff; background: #111; border-color: #ffd42a; }
  .site-footer { position: absolute; left: 50%; bottom: max(3px, env(safe-area-inset-bottom)); z-index: 8; display: flex; align-items: center; gap: 8px; color: #8e8e8e; font-size: clamp(8px, calc(8px * var(--stage-scale)), 14px); line-height: 16px; text-align: center; white-space: nowrap; transform: translateX(-50%); }
  .site-credit a { color: #dedede; text-decoration: none; }
  .site-credit a:hover, .site-credit a:focus-visible { color: #ffd92a; text-decoration: underline; }
  .support-toggle { padding: 1px 6px; color: #050505; background: #dedede; border: 2px solid; border-color: #fff #444 #444 #fff; font-size: inherit; line-height: 14px; }
  .support-toggle:active, .support-toggle[aria-expanded="true"] { border-color: #444 #fff #fff #444; background: #bbb; }
  .support-panel { position: absolute; right: max(8px, env(safe-area-inset-right)); bottom: calc(max(26px, env(safe-area-inset-bottom)) + 8px); z-index: 9; width: min(318px, calc(100vw - 16px)); padding: 10px; color: #050505; background: #dedede; border: 3px solid; border-color: #fff #333 #333 #fff; box-shadow: 4px 4px 0 #000; font-size: 10px; line-height: 1.35; }
  .support-panel strong { display: block; margin: -10px -10px 8px; padding: 5px 24px 5px 7px; color: #fff; background: #111; font-size: 11px; }
  .support-panel p { margin: 0 0 8px; }
  .support-panel img { float: left; width: 104px; height: 104px; margin: 0 8px 8px 0; background: #fff; border: 2px solid #111; object-fit: contain; image-rendering: pixelated; }
  .support-panel textarea { width: calc(100% - 112px); height: 104px; min-width: 150px; margin: 0 0 8px; padding: 5px; color: #21df50; background: #000; border: 2px inset #777; resize: none; font-size: 7px; line-height: 1.35; word-break: break-all; }
  .support-actions { clear: both; display: flex; gap: 6px; justify-content: flex-end; }
  .support-actions button, .support-actions a, .support-close { color: #050505; background: #efefef; border: 2px solid; border-color: #fff #444 #444 #fff; text-decoration: none; }
  .support-actions button, .support-actions a { min-width: 80px; padding: 5px 8px; text-align: center; }
  .support-actions button:active, .support-actions a:active, .support-close:active { border-color: #444 #fff #fff #444; background: #bbb; }
  .support-close { position: absolute; top: 3px; right: 4px; width: 18px; height: 18px; padding: 0; line-height: 12px; }
  @media (prefers-reduced-motion: reduce) {
    .map-box i { animation: none; }
    .travel-animation::before { animation: cloud-scroll 1.6s steps(8) forwards !important; }
    .travel-animation i { animation: plane-frames .8s steps(4) 2, plane-takeoff 1.6s steps(8) forwards !important; }
    .trail-animation-cue i { animation: trail-frames .72s steps(4) 3 !important; }
    .henchman-crossing::after { animation: getaway-dust 2.6s steps(4) forwards !important; }
    .henchman-crossing i { animation: henchman-frames .64s steps(8) 4, henchman-path 2.6s steps(12) forwards !important; }
    .result-animation i { animation: result-frames .9s steps(4) 2 !important; }
  }
</style>
