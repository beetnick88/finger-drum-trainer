"use strict";

const pads = [
  ["P01", "Kick", "#ff375f", "1", 36, "bd_haus.flac"],
  ["P02", "Snare", "#ff8f1f", "2", 38, "drum_snare_hard.flac"],
  ["P03", "Closed Hat", "#ffd60a", "3", 42, "drum_cymbal_closed.flac"],
  ["P04", "Open Hat", "#7bd88f", "4", 46, "drum_cymbal_open.flac"],
  ["P05", "Clap", "#00c2a8", "q", 39, "perc_snap.flac"],
  ["P06", "Rim", "#00e5ff", "w", 37, "custom_rimshot.wav"],
  ["P07", "Low Tom", "#2580ff", "e", 45, "drum_tom_lo_hard.flac"],
  ["P08", "High Tom", "#8b5cf6", "r", 50, "drum_tom_hi_hard.flac"],
  ["P09", "Perc A", "#f15bb5", "a", 48, "custom_perc_low.wav"],
  ["P10", "Perc B", "#fb5607", "s", 47, "custom_perc_high.wav"],
  ["P11", "Cowbell", "#c0ff00", "d", 56, "drum_cowbell.flac"],
  ["P12", "Shaker", "#2dd4bf", "f", 70, "custom_shaker.wav"],
  ["P13", "Crash", "#4cc9f0", "z", 49, "drum_cymbal_hard.flac"],
  ["P14", "Ride", "#4361ee", "x", 51, "elec_cymbal.flac"],
  ["P15", "FX", "#b5179e", "c", 55, "perc_impact1.flac"],
  ["P16", "Ghost", "#ffffff", "v", 40, "drum_bass_soft.flac"],
].map(([id, name, color, key, note, sample], index) => ({
  id,
  name,
  color,
  key,
  note,
  sample,
  index,
  row: Math.floor(index / 4),
  col: index % 4,
}));

const padDisplayOrder = [...pads].sort((a, b) => b.row - a.row || a.col - b.col);

const songs = [
  {
    title: "怪獣の花唄 Easy",
    bpm: 150,
    introBeats: 0,
    description: "読み込み中: 原曲MIDI伴奏 + 叩きやすい4Padドラム",
    sourceJson: "./assets/songs/kaiju-no-hanauta.json",
    practiceKey: "easy4",
  },
  {
    title: "怪獣の花唄 Full Drum",
    bpm: 150,
    introBeats: 0,
    description: "読み込み中: 原曲MIDI伴奏 + ドラム専用MIDIをそのまま練習",
    sourceJson: "./assets/songs/kaiju-no-hanauta.json",
    practiceKey: "full",
  },
  {
    title: "Lesson 01: Kick + Hat",
    bpm: 70,
    introBeats: 4,
    stepBeats: 0.5,
    cycles: 4,
    description: "右手ハットを一定にして、キックを入れる練習",
    steps: [
      [0, 2], [2], [2], [2],
      [0, 2], [2], [2], [2],
      [0, 2], [2], [2], [2],
      [0, 2], [2], [2], [2, 3],
    ],
  },
  {
    title: "Lesson 02: Backbeat",
    bpm: 76,
    introBeats: 4,
    stepBeats: 0.5,
    cycles: 4,
    description: "2拍目/4拍目のスネアを覚える基本8ビート",
    steps: [
      [0, 2], [2], [2], [2],
      [1, 2], [2], [2], [2],
      [0, 2], [2], [2], [2],
      [1, 2], [2], [2], [2, 3],
    ],
  },
  {
    title: "Lesson 03: Kick Variation",
    bpm: 82,
    introBeats: 4,
    stepBeats: 0.5,
    cycles: 4,
    description: "キックを少し増やして、怪獣の花唄に近い足の動きへ",
    steps: [
      [0, 2], [2], [2], [0, 2],
      [1, 2], [2], [0, 2], [2],
      [0, 2], [2], [2], [2],
      [1, 2], [2], [0, 2], [2, 3],
    ],
  },
  {
    title: "Lesson 04: Crash Entry",
    bpm: 86,
    introBeats: 4,
    stepBeats: 0.5,
    cycles: 4,
    description: "小節頭にCrashを入れて、そのまま8ビートへ戻る練習",
    steps: [
      [0, 2, 12], [2], [2], [2],
      [1, 2], [2], [0, 2], [2],
      [0, 2], [2], [2], [2],
      [1, 2], [2], [0, 2], [2],
    ],
  },
  {
    title: "Lesson 05: Simple Fill",
    bpm: 78,
    introBeats: 4,
    stepBeats: 0.5,
    cycles: 4,
    description: "最後にTomを入れて、次の小節へ戻るフィル練習",
    steps: [
      [0, 2], [2], [2], [2],
      [1, 2], [2], [0, 2], [2],
      [0, 2], [2], [2], [2],
      [1, 2], [2], [6], [7, 12],
    ],
  },
];

const musicLoopBeats = 16;
const chordRoots = [48, 44, 41, 46];
const chordTypes = [
  [0, 3, 7, 10],
  [0, 3, 7, 10],
  [0, 3, 7, 10],
  [0, 4, 7, 10],
];
const introMelody = [
  [0, 67], [1.5, 70], [3, 72],
  [4, 65], [5.5, 67], [7, 70],
  [8, 63], [9.5, 67], [11, 70],
  [12, 65], [13.5, 68], [15, 70],
];

const els = {
  canvas: document.getElementById("noteCanvas"),
  padGrid: document.getElementById("padGrid"),
  padTab: document.getElementById("padTab"),
  settingsTab: document.getElementById("settingsTab"),
  padContent: document.getElementById("padContent"),
  settingsContent: document.getElementById("settingsContent"),
  midiStatus: document.getElementById("midiStatus"),
  settingsMidiStatus: document.getElementById("settingsMidiStatus"),
  connectMidi: document.getElementById("connectMidi"),
  learnToggle: document.getElementById("learnToggle"),
  songSelect: document.getElementById("songSelect"),
  songDescription: document.getElementById("songDescription"),
  bpmSelect: document.getElementById("bpmSelect"),
  metronomeToggle: document.getElementById("metronomeToggle"),
  playToggle: document.getElementById("playToggle"),
  resetSong: document.getElementById("resetSong"),
  demoPattern: document.getElementById("demoPattern"),
  bpmSlider: document.getElementById("bpmSlider"),
  bpmReadout: document.getElementById("bpmReadout"),
  settingsBpmReadout: document.getElementById("settingsBpmReadout"),
  melodyVolume: document.getElementById("melodyVolume"),
  melodyVolumeReadout: document.getElementById("melodyVolumeReadout"),
  drumVolume: document.getElementById("drumVolume"),
  drumVolumeReadout: document.getElementById("drumVolumeReadout"),
  metroVolume: document.getElementById("metroVolume"),
  metroVolumeReadout: document.getElementById("metroVolumeReadout"),
  scoreReadout: document.getElementById("scoreReadout"),
  comboReadout: document.getElementById("comboReadout"),
  judgeReadout: document.getElementById("judgeReadout"),
  assignStorageStatus: document.getElementById("assignStorageStatus"),
  resetAssign: document.getElementById("resetAssign"),
  mapList: document.getElementById("mapList"),
};

const ctx = els.canvas.getContext("2d");
const state = {
  audio: null,
  bpm: 92,
  running: false,
  hasStarted: false,
  countingIn: false,
  countInStartedAt: 0,
  lastCountInBeat: -1,
  startedAt: 0,
  pausedAt: 0,
  notes: [],
  score: 0,
  combo: 0,
  songIndex: 0,
  songEnded: false,
  learnMode: false,
  selectedLearnPadIndex: null,
  midiAccess: null,
  assignments: new Map(pads.map((pad) => [pad.note, pad.index])),
  sampleBuffers: new Map(),
  sampleLoadPromise: null,
  scheduledMusicEvents: new Set(),
  backingBeat: 0,
  backingTimer: null,
  backingEventIndex: 0,
  metronomeEnabled: false,
  lastMetronomeBeat: -1,
  melodyVolume: 0.8,
  drumVolume: 0.9,
  metroVolume: 0.7,
  demoMode: false,
  demoTimer: null,
  demoStep: 0,
  hitEffects: [],
  judgePopups: [],
  lastTs: performance.now(),
};

function init() {
  loadAssignments();
  loadMixSettings();
  renderSongOptions();
  applySongSettings();
  updateMixControls();
  loadMidiSongs().then(() => {
    renderSongOptions();
    applySongSettings();
    rebuildPattern();
  }).catch(() => {
    setJudge("MIDI曲ロード失敗", "warn");
  });
  renderPads();
  rebuildPattern();
  resizeCanvas();
  requestAnimationFrame(tick);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("pagehide", stopPlaybackForBackground);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPlaybackForBackground();
  });
  els.connectMidi.addEventListener("click", connectMidi);
  els.learnToggle.addEventListener("click", toggleLearn);
  els.padTab.addEventListener("click", () => setPanelTab("pad"));
  els.settingsTab.addEventListener("click", () => setPanelTab("settings"));
  els.songSelect.addEventListener("change", () => selectSong(Number(els.songSelect.value)));
  els.bpmSelect.addEventListener("change", () => setTempo(Number(els.bpmSelect.value)));
  els.metronomeToggle.addEventListener("click", toggleMetronome);
  els.playToggle.addEventListener("click", togglePlay);
  els.resetSong.addEventListener("click", resetSong);
  els.resetAssign.addEventListener("click", resetAssignments);
  els.demoPattern.addEventListener("click", () => {
    toggleDemoMode();
  });
  els.bpmSlider.addEventListener("input", () => {
    setTempo(Number(els.bpmSlider.value));
  });
  els.melodyVolume.addEventListener("input", () => setMixVolume("melody", Number(els.melodyVolume.value)));
  els.drumVolume.addEventListener("input", () => setMixVolume("drum", Number(els.drumVolume.value)));
  els.metroVolume.addEventListener("input", () => setMixVolume("metro", Number(els.metroVolume.value)));
}

function currentSong() {
  return songs[state.songIndex] || songs[0];
}

function renderSongOptions() {
  els.songSelect.innerHTML = "";
  songs.forEach((song, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = song.title;
    els.songSelect.appendChild(option);
  });
}

async function loadMidiSongs() {
  const cache = new Map();
  const midiSongs = songs.filter((song) => song.sourceJson);
  if (!midiSongs.length) return;

  await Promise.all(midiSongs.map(async (song) => {
    if (!cache.has(song.sourceJson)) {
      cache.set(song.sourceJson, fetch(song.sourceJson).then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${song.sourceJson}`);
        return response.json();
      }));
    }

    const data = await cache.get(song.sourceJson);
    const drumEvents = data.practice?.[song.practiceKey] || [];
    song.loaded = true;
    song.bpm = data.bpm || song.bpm;
    song.durationBeats = data.durationBeats || 0;
    song.drumEvents = drumEvents;
    song.backingEvents = data.backing || [];
    song.firstPracticeBeat = drumEvents.length ? drumEvents[0].beat : 0;
    song.description = song.practiceKey === "full"
      ? `原曲MIDI伴奏 / Full Drum ${drumEvents.length} notes / ドラム音はPADだけ`
      : `原曲MIDI伴奏 / Easy ${drumEvents.length} notes / ドラム音はPADだけ`;
  }));
}

function selectSong(index) {
  state.songIndex = Math.max(0, Math.min(songs.length - 1, index || 0));
  hardStopAudio();
  state.hasStarted = false;
  state.pausedAt = 0;
  state.score = 0;
  state.combo = 0;
  state.songEnded = false;
  state.backingEventIndex = 0;
  state.lastMetronomeBeat = -1;
  state.demoMode = false;
  els.demoPattern.classList.remove("active");
  els.demoPattern.textContent = "見本";
  els.scoreReadout.textContent = "0";
  els.comboReadout.textContent = "0";
  applySongSettings();
  rebuildPattern();
  setJudge("Ready", "neutral");
}

function applySongSettings() {
  const song = currentSong();
  state.bpm = song.bpm;
  els.songSelect.value = String(state.songIndex);
  els.songDescription.textContent = song.description;
  updateTempoControls();
}

function setTempo(nextBpm) {
  if (!Number.isFinite(nextBpm)) return;
  const previousBeatDuration = secondsPerBeat();
  const currentBeat = getSongTime() / previousBeatDuration;
  state.bpm = Math.max(40, Math.min(220, Math.round(nextBpm)));
  state.scheduledMusicEvents.clear();
  state.backingEventIndex = findBackingEventIndex(currentBeat * secondsPerBeat());
  state.lastMetronomeBeat = Math.floor(currentBeat) - 1;
  if (state.running) {
    state.startedAt = performance.now() - currentBeat * secondsPerBeat() * 1000;
  } else {
    state.pausedAt = currentBeat * secondsPerBeat();
  }
  updateTempoControls();
  rebuildPattern();
}

function updateTempoControls() {
  const bpm = String(state.bpm);
  renderBpmOptions(state.bpm);
  els.bpmSelect.value = bpm;
  els.bpmSlider.value = bpm;
  els.bpmReadout.textContent = bpm;
  els.settingsBpmReadout.textContent = bpm;
}

function renderBpmOptions(currentBpm) {
  const values = new Set([50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, currentBpm]);
  const selected = els.bpmSelect.value;
  els.bpmSelect.innerHTML = "";
  [...values].sort((a, b) => a - b).forEach((value) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = String(value);
    els.bpmSelect.appendChild(option);
  });
  if (values.has(Number(selected))) els.bpmSelect.value = selected;
}

function loadMixSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("finger-drum-mix") || "null");
    if (!saved || typeof saved !== "object") return;
    if (Number.isFinite(saved.melody)) state.melodyVolume = clampVolume(saved.melody);
    if (Number.isFinite(saved.drum)) state.drumVolume = clampVolume(saved.drum);
    if (Number.isFinite(saved.metro)) state.metroVolume = clampVolume(saved.metro);
  } catch {
    localStorage.removeItem("finger-drum-mix");
  }
}

function setMixVolume(type, value) {
  const normalized = clampVolume(value / 100);
  if (type === "melody") state.melodyVolume = normalized;
  if (type === "drum") state.drumVolume = normalized;
  if (type === "metro") state.metroVolume = normalized;
  localStorage.setItem("finger-drum-mix", JSON.stringify({
    melody: state.melodyVolume,
    drum: state.drumVolume,
    metro: state.metroVolume,
  }));
  updateMixControls();
}

function updateMixControls() {
  const melody = Math.round(state.melodyVolume * 100);
  const drum = Math.round(state.drumVolume * 100);
  const metro = Math.round(state.metroVolume * 100);
  els.melodyVolume.value = String(melody);
  els.drumVolume.value = String(drum);
  els.metroVolume.value = String(metro);
  els.melodyVolumeReadout.textContent = String(melody);
  els.drumVolumeReadout.textContent = String(drum);
  els.metroVolumeReadout.textContent = String(metro);
}

function clampVolume(value) {
  return Math.max(0, Math.min(1.2, value));
}

function toggleMetronome() {
  state.metronomeEnabled = !state.metronomeEnabled;
  state.lastMetronomeBeat = -1;
  els.metronomeToggle.classList.toggle("active", state.metronomeEnabled);
  els.metronomeToggle.textContent = state.metronomeEnabled ? "Metro On" : "Metro Off";
  els.metronomeToggle.setAttribute("aria-pressed", String(state.metronomeEnabled));
  if (state.metronomeEnabled && (state.running || state.countingIn)) {
    ensureAudio();
    resumeAudio();
  }
}

function renderPads() {
  els.padGrid.innerHTML = "";
  for (const pad of padDisplayOrder) {
    const button = document.createElement("button");
    button.className = "pad";
    button.type = "button";
    button.style.setProperty("--pad-color", pad.color);
    button.dataset.pad = String(pad.index);
    button.innerHTML = `<strong>${pad.id}</strong><em>${pad.name}</em><small>Key ${pad.key.toUpperCase()}</small>`;
    button.addEventListener("click", () => {
      if (state.learnMode) {
        selectLearnPad(pad.index);
        return;
      }
      triggerPad(pad.index, performance.now(), "screen");
    });
    els.padGrid.appendChild(button);
  }
  renderMapList();
  updateLearnTarget();
}

function renderMapList() {
  els.mapList.innerHTML = "";
  for (const pad of padDisplayOrder) {
    const item = document.createElement("div");
    item.className = "map-item";
    item.style.setProperty("--pad-color", pad.color);
    item.dataset.pad = String(pad.index);
    item.innerHTML = `<strong>${pad.id}</strong><span>MIDI ${formatMidiNote(pad.note)}</span>`;
    item.addEventListener("click", () => {
      if (!state.learnMode) return;
      selectLearnPad(pad.index);
    });
    els.mapList.appendChild(item);
  }
}

function formatMidiNote(note) {
  return Number.isFinite(note) ? String(note) : "--";
}

function setPanelTab(tabName) {
  const isSettings = tabName === "settings";
  els.padTab.classList.toggle("active", !isSettings);
  els.settingsTab.classList.toggle("active", isSettings);
  els.padTab.setAttribute("aria-selected", String(!isSettings));
  els.settingsTab.setAttribute("aria-selected", String(isSettings));
  els.padContent.classList.toggle("active", !isSettings);
  els.settingsContent.classList.toggle("active", isSettings);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = els.canvas.getBoundingClientRect();
  els.canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  els.canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function secondsPerBeat() {
  return 60 / state.bpm;
}

function getSongTime(now = performance.now()) {
  if (!state.running) return state.pausedAt;
  return (now - state.startedAt) / 1000;
}

function rebuildPattern() {
  const oldTime = getSongTime();
  const beat = secondsPerBeat();
  const lookaheadBeats = 6.2;
  const song = currentSong();
  const notes = [];

  if (Array.isArray(song.drumEvents)) {
    for (const event of song.drumEvents) {
      const pad = pads[event.padIndex];
      if (!pad) continue;
      const hitTime = event.beat * beat;
      notes.push({
        padIndex: event.padIndex,
        midi: event.midi,
        velocity: event.velocity,
        hitTime,
        spawnTime: hitTime - lookaheadBeats * beat,
        judged: false,
        missed: false,
      });
    }
  } else if (Array.isArray(song.steps)) {
    const stepBeats = song.stepBeats || 1;
    const cycleBeats = song.steps.length * stepBeats;
    for (let cycle = 0; cycle < song.cycles; cycle += 1) {
      song.steps.forEach((padIndexes, step) => {
        const hitTime = (song.introBeats + cycle * cycleBeats + step * stepBeats) * beat;
        for (const padIndex of padIndexes) {
          const pad = pads[padIndex];
          notes.push({
            padIndex,
            hitTime,
            spawnTime: hitTime - lookaheadBeats * beat,
            judged: false,
            missed: false,
          });
        }
      });
    }
  }

  state.notes = notes.sort((a, b) => a.hitTime - b.hitTime);
  if (state.running) state.startedAt = performance.now() - oldTime * 1000;
}

function getIntroBeats(song = currentSong()) {
  if (Array.isArray(song.drumEvents) && song.drumEvents.length) return song.firstPracticeBeat || 0;
  return song.introBeats || 0;
}

function getSongDurationSeconds(song = currentSong()) {
  if (song.durationBeats) return song.durationBeats * secondsPerBeat();
  if (!state.notes.length) return 0;
  return state.notes[state.notes.length - 1].hitTime;
}

function togglePlay() {
  const song = currentSong();
  if (song.sourceJson && !song.loaded) {
    setJudge("曲ロード中", "warn");
    return;
  }
  ensureAudio();
  resumeAudio();
  if (state.countingIn) {
    cancelCountIn();
    return;
  }

  if (state.running) {
    pauseSong();
    return;
  }

  if (!state.hasStarted && state.pausedAt === 0) {
    startCountIn();
    return;
  }

  startSong();
}

function startCountIn() {
  state.countingIn = true;
  state.running = false;
  state.hasStarted = false;
  state.songEnded = false;
  state.pausedAt = 0;
  state.scheduledMusicEvents.clear();
  state.backingEventIndex = 0;
  state.lastMetronomeBeat = -1;
  stopBackingLoop();
  state.countInStartedAt = performance.now();
  state.lastCountInBeat = -1;
  els.playToggle.textContent = "Cancel";
  els.playToggle.classList.add("active");
  setJudge("Count In", "neutral");
  playCountBlip(0);
  rebuildPattern();
}

function cancelCountIn() {
  state.countingIn = false;
  state.countInStartedAt = 0;
  state.lastCountInBeat = -1;
  els.playToggle.textContent = "Play";
  els.playToggle.classList.remove("active");
  setJudge("Ready", "neutral");
}

function startSong() {
  state.countingIn = false;
  state.running = true;
  state.hasStarted = true;
  state.songEnded = false;
  state.scheduledMusicEvents.clear();
  state.backingEventIndex = findBackingEventIndex(state.pausedAt);
  state.lastMetronomeBeat = Math.floor(state.pausedAt / secondsPerBeat()) - 1;
  state.demoStep = 0;
  state.startedAt = performance.now() - state.pausedAt * 1000;
  els.playToggle.textContent = "Pause";
  els.playToggle.classList.add("active");
  setJudge("Go", "good");
  playCountBlip(1);
  startBackingLoop();
  if (state.demoMode) startDemoPlayback();
}

function pauseSong() {
  const currentTime = getSongTime();
  state.running = false;
  state.countingIn = false;
  state.countInStartedAt = 0;
  state.pausedAt = currentTime;
  stopBackingLoop();
  stopDemoPlayback();
  if (state.audio && state.audio.state === "running") state.audio.suspend();
  els.playToggle.textContent = "Play";
  els.playToggle.classList.remove("active");
}

function stopPlaybackForBackground() {
  hardStopAudio();
  setJudge("Paused", "neutral");
}

function hardStopAudio() {
  state.running = false;
  state.countingIn = false;
  state.countInStartedAt = 0;
  state.lastCountInBeat = -1;
  state.backingEventIndex = 0;
  state.lastMetronomeBeat = -1;
  stopBackingLoop();
  stopDemoPlayback();
  if (state.audio) {
    state.audio.close().catch(() => {});
    state.audio = null;
    state.sampleBuffers.clear();
    state.sampleLoadPromise = null;
  }
  els.playToggle.textContent = "Play";
  els.playToggle.classList.remove("active");
}

function resetSong() {
  state.running = false;
  state.hasStarted = false;
  state.countingIn = false;
  state.countInStartedAt = 0;
  state.lastCountInBeat = -1;
  state.startedAt = 0;
  state.pausedAt = 0;
  state.score = 0;
  state.combo = 0;
  state.songEnded = false;
  state.scheduledMusicEvents.clear();
  state.backingEventIndex = 0;
  state.lastMetronomeBeat = -1;
  hardStopAudio();
  els.playToggle.textContent = "Play";
  els.playToggle.classList.remove("active");
  els.scoreReadout.textContent = "0";
  els.comboReadout.textContent = "0";
  setJudge("Ready", "neutral");
  rebuildPattern();
}

function toggleDemoMode() {
  state.demoMode = !state.demoMode;
  els.demoPattern.classList.toggle("active", state.demoMode);
  els.demoPattern.textContent = state.demoMode ? "見本中" : "見本";
  if (state.demoMode) {
    setJudge("見本モード", "neutral");
    if (!state.running && !state.countingIn) {
      resetSong();
      state.demoMode = true;
      els.demoPattern.classList.add("active");
      els.demoPattern.textContent = "見本中";
      togglePlay();
    } else if (state.running) {
      startDemoPlayback();
    }
  } else {
    stopDemoPlayback();
  }
}

function startDemoPlayback() {
  stopDemoPlayback();
  state.demoStep = state.notes.findIndex((note) => !note.judged && !note.missed && note.hitTime >= getSongTime() - 0.02);
  if (state.demoStep < 0) state.demoStep = state.notes.length;
  state.demoTimer = window.setInterval(playDemoStep, 16);
}

function stopDemoPlayback() {
  if (state.demoTimer) {
    window.clearInterval(state.demoTimer);
    state.demoTimer = null;
  }
}

function playDemoStep() {
  if (!state.running) return;
  const songTime = getSongTime();
  while (state.demoStep < state.notes.length && state.notes[state.demoStep].hitTime <= songTime + 0.018) {
    const note = state.notes[state.demoStep];
    autoPlayPad(note.padIndex, note);
    state.demoStep += 1;
  }
}

function autoPlayPad(padIndex, note) {
  ensureAudio();
  resumeAudio();
  const pad = pads[padIndex];
  if (!pad) return;

  if (note) note.judged = true;
  flashPad(padIndex);
  addHitEffect(padIndex, 1.16, "auto");
  playTone(pad, "demo");
  setJudge("AUTO", "neutral");
  addJudgePopup(padIndex, "AUTO", "neutral");
}

async function connectMidi() {
  if (!navigator.requestMIDIAccess) {
    setMidiStatus("このブラウザはWeb MIDI非対応");
    return;
  }

  try {
    state.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
    bindMidiInputs();
    state.midiAccess.onstatechange = bindMidiInputs;
  } catch (error) {
    setMidiStatus("接続許可が必要です");
  }
}

function bindMidiInputs() {
  if (!state.midiAccess) return;
  const inputs = Array.from(state.midiAccess.inputs.values());
  for (const input of inputs) input.onmidimessage = onMidiMessage;
  setMidiStatus(inputs.length ? inputs.map((input) => input.name || "Input").join(", ") : "入力なし");
}

function setMidiStatus(message) {
  els.midiStatus.textContent = "";
  els.settingsMidiStatus.textContent = message;
}

function onMidiMessage(event) {
  const [status, note, velocity] = event.data;
  const command = status & 0xf0;
  if (command !== 0x90 || velocity === 0) return;

  if (state.learnMode) {
    if (state.selectedLearnPadIndex === null) {
      setJudge("画面のPADを選択", "warn");
      return;
    }
    assignMidiNote(state.selectedLearnPadIndex, note);
    return;
  }

  const padIndex = state.assignments.get(note);
  if (padIndex !== undefined) triggerPad(padIndex, performance.now(), "midi");
}

function toggleLearn() {
  state.learnMode = !state.learnMode;
  state.selectedLearnPadIndex = null;
  els.learnToggle.classList.toggle("active", state.learnMode);
  els.learnToggle.textContent = state.learnMode ? "Assigning" : "Learn";
  if (state.learnMode) setPanelTab("pad");
  setJudge(state.learnMode ? "画面のPADを選択" : "Ready", "neutral");
  updateLearnTarget();
}

function selectLearnPad(padIndex) {
  state.selectedLearnPadIndex = padIndex;
  const pad = pads[padIndex];
  flashPad(padIndex);
  setJudge(`${pad.id} を選択: 実機PADを押してください`, "neutral");
  updateLearnTarget();
}

function assignMidiNote(padIndex, note) {
  const pad = pads[padIndex];
  for (const [assignedNote, assignedPadIndex] of state.assignments.entries()) {
    if (assignedPadIndex === pad.index || assignedNote === note) {
      state.assignments.delete(assignedNote);
    }
  }
  const previousOwner = pads.find((item) => item.index !== pad.index && item.note === note);
  if (previousOwner) previousOwner.note = null;

  pad.note = note;
  state.assignments.set(note, pad.index);
  state.selectedLearnPadIndex = null;
  saveAssignments();
  renderPads();
  setJudge(`${pad.id} = MIDI ${note}`, "good");
}

function updateLearnTarget() {
  document.querySelectorAll(".pad, .map-item").forEach((padEl) => {
    const isTarget = state.learnMode && Number(padEl.dataset.pad) === state.selectedLearnPadIndex;
    padEl.classList.toggle("learn-target", isTarget);
  });
}

function onKeyDown(event) {
  if (event.repeat) return;
  if (event.code === "Space") {
    event.preventDefault();
    togglePlay();
    return;
  }
  const key = event.key.toLowerCase();
  const pad = pads.find((item) => item.key === key);
  if (pad) triggerPad(pad.index, performance.now(), "keyboard");
}

function triggerPad(padIndex, now, source) {
  ensureAudio();
  resumeAudio();
  const pad = pads[padIndex];
  flashPad(padIndex);
  addHitEffect(padIndex, source === "demo" ? 0.7 : 1);
  playTone(pad, source);
  if (!state.running) {
    setJudge(state.countingIn ? "Count In" : "Ready", "neutral");
    addJudgePopup(padIndex, "Hit", "neutral");
    return;
  }
  judgeHit(padIndex, getSongTime(now));
}

function judgeHit(padIndex, songTime) {
  const windows = [
    ["Perfect", 0.055, 1000, "good"],
    ["Great", 0.095, 650, "good"],
    ["Good", 0.145, 300, "warn"],
  ];
  let best = null;

  for (const note of state.notes) {
    if (note.padIndex !== padIndex || note.judged || note.missed) continue;
    const diff = Math.abs(note.hitTime - songTime);
    if (!best || diff < best.diff) best = { note, diff };
  }

  if (!best) {
    state.combo = 0;
    setJudge("Early/Late", "bad");
    addJudgePopup(padIndex, "Late", "bad");
    updateScore();
    return;
  }

  const matched = windows.find(([, limit]) => best.diff <= limit);
  if (!matched) {
    state.combo = 0;
    const label = best.note.hitTime > songTime ? "Early" : "Late";
    setJudge(best.note.hitTime > songTime ? "Too Early" : "Too Late", "bad");
    addJudgePopup(padIndex, label, "bad");
    updateScore();
    return;
  }

  const [label, , points, tone] = matched;
  best.note.judged = true;
  state.combo += 1;
  state.score += points + Math.min(500, state.combo * 12);
  setJudge(label, tone);
  addJudgePopup(padIndex, label, tone);
  updateScore();
}

function addHitEffect(padIndex, intensity, source = "manual") {
  state.hitEffects.push({
    padIndex,
    startedAt: performance.now(),
    duration: source === "auto" ? 360 : 260,
    intensity,
    source,
  });
}

function addJudgePopup(padIndex, label, tone) {
  state.judgePopups.push({
    padIndex,
    label,
    tone,
    startedAt: performance.now(),
    duration: 560,
  });
}

function updateScore() {
  els.scoreReadout.textContent = String(state.score);
  els.comboReadout.textContent = String(state.combo);
}

function setJudge(text, tone) {
  els.judgeReadout.textContent = text;
  els.judgeReadout.style.color = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : tone === "bad" ? "var(--bad)" : "var(--text)";
}

function flashPad(padIndex) {
  const el = document.querySelector(`[data-pad="${padIndex}"]`);
  if (!el) return;
  el.classList.add("hit");
  window.setTimeout(() => el.classList.remove("hit"), 110);
}

function ensureAudio() {
  if (state.audio) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  state.audio = new AudioContextClass();
  loadSamples();
}

function playTone(pad, source) {
  if (!state.audio) return;

  const buffer = state.sampleBuffers.get(pad.sample);
  if (buffer) {
    const player = state.audio.createBufferSource();
    const gain = state.audio.createGain();
    player.buffer = buffer;
    player.playbackRate.value = source === "midi" ? 1 : 0.995;
    gain.gain.value = (pad.index >= 12 ? 0.52 : 0.72) * state.drumVolume;
    player.connect(gain).connect(state.audio.destination);
    player.start();
    return;
  }

  const now = state.audio.currentTime;
  const osc = state.audio.createOscillator();
  const gain = state.audio.createGain();
  osc.type = pad.index % 3 === 0 ? "triangle" : "sine";
  osc.frequency.value = 82 + pad.index * 31 + (source === "midi" ? 15 : 0);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22 * state.drumVolume, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  osc.connect(gain).connect(state.audio.destination);
  osc.start(now);
  osc.stop(now + 0.13);
}

function resumeAudio() {
  if (state.audio && state.audio.state === "suspended") {
    state.audio.resume();
  }
}

function playCountBlip(step) {
  if (!state.audio) return;
  const now = state.audio.currentTime + 0.02;
  playSynthNote(step ? 76 : 72, now, 0.08, "square", step ? 0.08 : 0.05);
}

function scheduleMetronome(songTime) {
  if (!state.metronomeEnabled || !state.running || !state.audio) return;
  const beatDuration = secondsPerBeat();
  const beatIndex = Math.floor(songTime / beatDuration);
  if (beatIndex < 0 || beatIndex === state.lastMetronomeBeat) return;
  state.lastMetronomeBeat = beatIndex;
  playMetronomeClick(beatIndex % 4 === 0);
}

function playMetronomeClick(strong) {
  if (!state.audio) return;
  const now = state.audio.currentTime + 0.01;
  const osc = state.audio.createOscillator();
  const gain = state.audio.createGain();
  osc.type = "square";
  osc.frequency.value = strong ? 1280 : 920;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime((strong ? 0.13 : 0.085) * state.metroVolume, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  osc.connect(gain).connect(state.audio.destination);
  osc.start(now);
  osc.stop(now + 0.055);
}

function loadSamples() {
  if (state.sampleLoadPromise || !state.audio) return state.sampleLoadPromise;
  state.sampleLoadPromise = Promise.all(
    pads.map(async (pad) => {
      const response = await fetch(`./assets/samples/${pad.sample}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await state.audio.decodeAudioData(arrayBuffer);
      state.sampleBuffers.set(pad.sample, audioBuffer);
    }),
  ).catch(() => {
    setJudge("音源ロード失敗", "warn");
  });
  return state.sampleLoadPromise;
}

function tick(now) {
  requestAnimationFrame(tick);
  try {
    updateCountIn(now);
    const songTime = getSongTime(now);
    scheduleMidiBacking(songTime);
    scheduleMetronome(songTime);
    markMisses(songTime);
    checkSongEnd(songTime);
    draw(songTime);
    state.lastTs = now;
  } catch (error) {
    state.lastTs = now;
  }
}

function checkSongEnd(songTime) {
  if (!state.running || state.songEnded || !state.notes.length) return;
  const songEnd = Math.max(state.notes[state.notes.length - 1].hitTime, getSongDurationSeconds());
  if (songTime < songEnd + 0.8) return;
  state.songEnded = true;
  stopBackingLoop();
  stopDemoPlayback();
  state.running = false;
  state.pausedAt = 0;
  els.playToggle.textContent = "Play";
  els.playToggle.classList.remove("active");
  setJudge("Complete", "good");
}

function startBackingLoop() {
  stopBackingLoop();
  if (Array.isArray(currentSong().backingEvents)) return;
  state.backingBeat = Math.max(0, Math.floor(getSongTime() / secondsPerBeat()));
  playBackingBeat(state.backingBeat);
  state.backingTimer = window.setInterval(() => {
    try {
      state.backingBeat += 1;
      playBackingBeat(state.backingBeat);
    } catch {
      stopBackingLoop();
    }
  }, secondsPerBeat() * 1000);
}

function stopBackingLoop() {
  if (state.backingTimer) {
    window.clearInterval(state.backingTimer);
    state.backingTimer = null;
  }
}

function findBackingEventIndex(songTime) {
  const events = currentSong().backingEvents || [];
  const beatTime = songTime / secondsPerBeat();
  let low = 0;
  let high = events.length;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (events[mid].beat < beatTime - 0.15) low = mid + 1;
    else high = mid;
  }
  return low;
}

function scheduleMidiBacking(songTime) {
  const song = currentSong();
  const events = song.backingEvents || [];
  if (!state.running || !state.audio || !events.length) return;

  const beatDuration = secondsPerBeat();
  const audioNow = state.audio.currentTime;
  const lookahead = 0.36;

  while (state.backingEventIndex < events.length && events[state.backingEventIndex].beat * beatDuration < songTime - 0.08) {
    state.backingEventIndex += 1;
  }

  while (state.backingEventIndex < events.length) {
    const event = events[state.backingEventIndex];
    const eventTime = event.beat * beatDuration;
    if (eventTime > songTime + lookahead) break;
    const scheduledAt = Math.max(audioNow + 0.012, audioNow + (eventTime - songTime));
    playMidiBackingNote(event, scheduledAt, beatDuration);
    state.backingEventIndex += 1;
  }
}

function playMidiBackingNote(event, startTime, beatDuration) {
  const duration = Math.min(2.2, Math.max(0.055, event.duration * beatDuration));
  const velocityGain = Math.max(0.12, event.velocity / 127);
  const waveform = event.midi < 48 ? "triangle" : event.midi > 76 ? "sine" : "sawtooth";
  const gainValue = (event.midi < 48 ? 0.032 : 0.018) * velocityGain * state.melodyVolume;
  playSynthNote(event.midi, startTime, duration, waveform, gainValue);
}

function playBackingBeat(beat) {
  if (!state.audio || !state.running) return;
  resumeAudio();
  const beatDuration = secondsPerBeat();
  const loopBeat = positiveModulo(beat, musicLoopBeats);
  const chordIndex = Math.floor(loopBeat / 4);
  const root = chordRoots[chordIndex];
  const chord = chordTypes[chordIndex].map((interval) => root + interval);
  const isIntro = beat < currentSong().introBeats;
  const now = state.audio.currentTime + 0.025;

  if (loopBeat % 4 === 0) playChord(chord, now, beatDuration * 3.5, (isIntro ? 0.14 : 0.09) * state.melodyVolume);
  if (loopBeat % 2 === 0) playSynthNote(root - 12, now, beatDuration * 0.72, "triangle", (isIntro ? 0.13 : 0.1) * state.melodyVolume);

  const melody = introMelody.find(([offset]) => positiveModulo(offset, musicLoopBeats) === loopBeat);
  if (melody && isIntro) playSynthNote(melody[1], now + 0.03, beatDuration * 0.42, "sine", 0.14 * state.melodyVolume);
}

function scheduleBackingTrack(songTime) {
  if (!state.running || !state.audio) return;
  const beatDuration = secondsPerBeat();
  const lookahead = 0.24;
  const currentBeat = songTime / beatDuration;
  const startBeat = Math.max(0, Math.floor(currentBeat - 1));
  const endBeat = Math.ceil(currentBeat + lookahead / beatDuration + 1);

  for (let beat = startBeat; beat <= endBeat; beat += 1) {
    const eventTime = state.audio.currentTime + (beat * beatDuration - songTime);
    if (eventTime < state.audio.currentTime - 0.02) continue;

    const loopBeat = positiveModulo(beat, musicLoopBeats);
    const chordIndex = Math.floor(loopBeat / 4);
    const root = chordRoots[chordIndex];
    const chord = chordTypes[chordIndex].map((interval) => root + interval);
    const isIntro = beat < currentSong().introBeats;

    scheduleMusicEvent(`pad-${beat}`, eventTime, (scheduledAt) => {
      if (loopBeat % 4 === 0) playChord(chord, scheduledAt, beatDuration * 3.7, (isIntro ? 0.16 : 0.11) * state.melodyVolume);
    });

    scheduleMusicEvent(`bass-${beat}`, eventTime, (scheduledAt) => {
      if (loopBeat % 2 === 0) playSynthNote(root - 12, scheduledAt, beatDuration * 0.72, "triangle", (isIntro ? 0.2 : 0.18) * state.melodyVolume);
    });

    scheduleMusicEvent(`pulse-${beat}`, eventTime, (scheduledAt) => {
      if (!isIntro && beat % 2 === 1) playSynthNote(root + 19, scheduledAt, beatDuration * 0.18, "square", 0.05 * state.melodyVolume);
    });
  }

  for (const [offset, midi] of introMelody) {
    const loopStart = Math.floor(currentBeat / musicLoopBeats) * musicLoopBeats;
    const candidates = [loopStart + offset, loopStart + musicLoopBeats + offset];
    for (const beat of candidates) {
      if (beat < currentBeat - 1 || beat > endBeat) continue;
      const eventTime = state.audio.currentTime + (beat * beatDuration - songTime);
      scheduleMusicEvent(`melody-${beat}`, eventTime, (scheduledAt) => {
        playSynthNote(midi, scheduledAt, beatDuration * 0.42, "sine", (beat < currentSong().introBeats ? 0.18 : 0.08) * state.melodyVolume);
      });
    }
  }
}

function scheduleMusicEvent(key, eventTime, schedule) {
  if (state.scheduledMusicEvents.has(key)) return;
  state.scheduledMusicEvents.add(key);
  schedule(Math.max(eventTime, state.audio.currentTime + 0.015));
}

function positiveModulo(value, modulo) {
  return ((value % modulo) + modulo) % modulo;
}

function playChord(notes, startTime, duration, gainValue) {
  notes.forEach((note, index) => {
    playSynthNote(note + 12, startTime + index * 0.012, duration, "sine", gainValue);
  });
}

function playSynthNote(midiNote, startTime, duration, type, gainValue) {
  const frequency = 440 * 2 ** ((midiNote - 69) / 12);
  const osc = state.audio.createOscillator();
  const gain = state.audio.createGain();
  const filter = state.audio.createBiquadFilter();

  osc.type = type;
  osc.frequency.value = frequency;
  filter.type = "lowpass";
  filter.frequency.value = type === "square" ? 1200 : 2400;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue), startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(filter).connect(gain).connect(state.audio.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.03);
}

function updateCountIn(now) {
  if (!state.countingIn) return;
  const beatMs = secondsPerBeat() * 1000;
  const countInDuration = beatMs * 4;
  const beatIndex = Math.floor((now - state.countInStartedAt) / beatMs);
  if (beatIndex !== state.lastCountInBeat && beatIndex >= 0 && beatIndex < 4) {
    state.lastCountInBeat = beatIndex;
    playCountBlip(beatIndex === 3 ? 1 : 0);
  }
  if (now - state.countInStartedAt >= countInDuration) {
    state.pausedAt = 0;
    startSong();
  }
}

function markMisses(songTime) {
  if (!state.running) return;
  for (const note of state.notes) {
    if (!note.judged && !note.missed && songTime - note.hitTime > 0.16) {
      note.missed = true;
      state.combo = 0;
      setJudge("Miss", "bad");
      addJudgePopup(note.padIndex, "Miss", "bad");
      updateScore();
    }
  }
}

function draw(songTime) {
  const rect = els.canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const layout = getStageLayout(width, height);
  drawBackdrop(width, height, layout);
  drawStageInfo(layout);
  drawPadDeck(layout);
  drawHitEffects(layout);
  drawIntroCue(songTime, layout);
  drawNotes(songTime, layout);
  drawJudgePopups(layout);
  drawCountIn(layout);
}

function getStageLayout(width, height) {
  const margin = Math.max(18, Math.min(46, width * 0.04));
  const activePadIndexes = getActivePadIndexes();
  const laneGap = Math.max(5, Math.min(11, width * 0.007));
  const laneCount = Math.max(1, activePadIndexes.length);
  const laneAreaRatio = laneCount <= 5 ? 0.58 : 0.68;
  const laneAreaMax = laneCount <= 5 ? 640 : 780;
  const laneAreaMin = Math.min(width - margin * 2, laneCount * 52 + laneGap * (laneCount - 1));
  const laneAreaWidth = Math.min(width - margin * 2, Math.max(laneAreaMin, width * laneAreaRatio), laneAreaMax);
  const laneLeft = (width - laneAreaWidth) / 2;
  const laneWidth = (laneAreaWidth - laneGap * (laneCount - 1)) / laneCount;
  const labelHeight = Math.max(34, Math.min(48, height * 0.07));
  const mapGap = Math.max(4, Math.min(7, width * 0.005));
  const mapWidth = Math.min(laneAreaWidth, Math.max(300, width * 0.42));
  const mapHeight = Math.max(58, Math.min(92, height * 0.12));
  const mapLeft = (width - mapWidth) / 2;
  const mapTop = height - mapHeight - Math.max(14, height * 0.028);
  const mapCellWidth = (mapWidth - mapGap * 3) / 4;
  const mapCellHeight = (mapHeight - mapGap * 3) / 4;
  const labelTop = mapTop - labelHeight - Math.max(8, height * 0.014);
  const hitLineY = labelTop - Math.max(10, height * 0.018);
  const laneTop = Math.max(18, height * 0.026);
  const laneBottom = hitLineY - Math.max(7, height * 0.01);
  const lanes = activePadIndexes.map((padIndex, laneIndex) => ({
    padIndex,
    x: laneLeft + laneIndex * (laneWidth + laneGap),
    y: laneTop,
    width: laneWidth,
    height: laneBottom - laneTop,
    laneIndex,
  }));
  const labelRects = activePadIndexes.map((padIndex, laneIndex) => ({
    padIndex,
    x: laneLeft + laneIndex * (laneWidth + laneGap),
    y: labelTop,
    width: laneWidth,
    height: labelHeight,
  }));

  return {
    width,
    height,
    margin,
    activePadIndexes,
    laneAreaWidth,
    laneLeft,
    laneGap,
    laneWidth,
    laneTop,
    laneBottom,
    hitLineY,
    lanes,
    labelRects,
    labelTop,
    labelHeight,
    mapLeft,
    mapTop,
    mapWidth,
    mapHeight,
    mapGap,
    mapCellWidth,
    mapCellHeight,
    deckLeft: laneLeft,
    deckTop: labelTop,
    deckWidth: laneAreaWidth,
    deckHeight: labelHeight,
    cellWidth: laneWidth,
    cellHeight: labelHeight,
  };
}

function getActivePadIndexes() {
  const song = currentSong();
  const indexes = new Set();
  if (Array.isArray(song.drumEvents)) {
    song.drumEvents.forEach((event) => indexes.add(event.padIndex));
  } else if (Array.isArray(song.steps)) {
    song.steps.flat().forEach((padIndex) => indexes.add(padIndex));
  } else {
    state.notes.forEach((note) => indexes.add(note.padIndex));
  }
  const active = [...indexes].filter((padIndex) => pads[padIndex]).sort(comparePadsByPhysicalColumn);
  return active.length ? active : [0, 1, 2, 3];
}

function comparePadsByPhysicalColumn(aIndex, bIndex) {
  const a = pads[aIndex];
  const b = pads[bIndex];
  if (a.col !== b.col) return a.col - b.col;
  if (a.row !== b.row) return b.row - a.row;
  return a.index - b.index;
}

function isPadActive(padIndex, layout) {
  return layout.activePadIndexes.includes(padIndex);
}

function laneRect(padIndex, layout) {
  return layout.lanes.find((lane) => lane.padIndex === padIndex) || null;
}

function padRect(pad, layout) {
  const labelRect = layout.labelRects.find((rect) => rect.padIndex === pad.index);
  if (labelRect) return labelRect;
  return padMapRect(pad, layout);
}

function padMapRect(pad, layout) {
  const displayRow = 3 - pad.row;
  const x = layout.mapLeft + pad.col * (layout.mapCellWidth + layout.mapGap);
  const y = layout.mapTop + displayRow * (layout.mapCellHeight + layout.mapGap);
  return { x, y, width: layout.mapCellWidth, height: layout.mapCellHeight };
}

function padTargetY(pad, layout) {
  return layout.hitLineY;
}

function columnCenterX(col, layout) {
  const lane = layout.lanes[col];
  return lane ? lane.x + lane.width / 2 : layout.laneLeft + layout.laneAreaWidth / 2;
}

function drawBackdrop(width, height, layout) {
  ctx.fillStyle = "#070a11";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(5, 8, 14, 0.15)");
  gradient.addColorStop(0.55, "rgba(15, 22, 34, 0.52)");
  gradient.addColorStop(1, "rgba(2, 5, 10, 0.35)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (const lane of layout.lanes) {
    const pad = pads[lane.padIndex];
    const laneGradient = ctx.createLinearGradient(0, layout.laneTop, 0, layout.laneBottom);
    laneGradient.addColorStop(0, colorWithAlpha(pad.color, 0.08));
    laneGradient.addColorStop(0.18, "rgba(255,255,255,0.035)");
    laneGradient.addColorStop(1, "rgba(255,255,255,0.005)");
    ctx.fillStyle = laneGradient;
    roundRect(lane.x, layout.laneTop, lane.width, layout.laneBottom - layout.laneTop, 7);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.11)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.055)";
    for (let i = 1; i < 4; i += 1) {
      const guideY = layout.laneTop + ((layout.laneBottom - layout.laneTop) / 4) * i;
      ctx.beginPath();
      ctx.moveTo(lane.x + 6, guideY);
      ctx.lineTo(lane.x + lane.width - 6, guideY);
      ctx.stroke();
    }

    ctx.fillStyle = pad.color;
    ctx.shadowColor = pad.color;
    ctx.shadowBlur = 14;
    roundRect(lane.x + Math.max(4, lane.width * 0.12), layout.laneTop + 8, lane.width - Math.max(8, lane.width * 0.24), 5, 3);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  drawJudgementBars(layout);
}

function drawColumnBars(layout) {
  drawJudgementBars(layout);
}

function drawJudgementBars(layout) {
  const x = layout.laneLeft + 8;
  const width = layout.laneAreaWidth - 16;
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.shadowColor = "rgba(255,255,255,0.82)";
  ctx.shadowBlur = 22;
  roundRect(x, layout.hitLineY - 3, width, 6, 3);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.72)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawStageInfo(layout) {
  const sideGap = 14;
  const leftWidth = layout.laneLeft - sideGap * 2;
  const rightX = layout.laneLeft + layout.laneAreaWidth + sideGap;
  const rightWidth = layout.width - rightX - sideGap;
  if (leftWidth >= 112) {
    drawInfoPanel(sideGap, layout.laneTop, Math.min(leftWidth, 150), [
      ["BPM", String(state.bpm)],
      ["Metro", state.metronomeEnabled ? "On" : "Off"],
    ]);
  }
  if (rightWidth >= 112) {
    drawInfoPanel(rightX, layout.laneTop, Math.min(rightWidth, 150), [
      ["Judge", els.judgeReadout.textContent || "Ready"],
      ["Combo", String(state.combo)],
    ]);
  }
}

function drawInfoPanel(x, y, width, rows) {
  const rowHeight = 42;
  const height = rows.length * rowHeight + 14;
  ctx.save();
  ctx.fillStyle = "rgba(7, 11, 18, 0.68)";
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1;
  roundRect(x, y, width, height, 7);
  ctx.fill();
  ctx.stroke();

  rows.forEach(([label, value], index) => {
    const rowY = y + 20 + index * rowHeight;
    ctx.fillStyle = "rgba(255,255,255,0.48)";
    ctx.font = "800 10px ui-sans-serif, system-ui";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 12, rowY);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "900 18px ui-sans-serif, system-ui";
    fitText(value, x + 12, rowY + 22, width - 24, 18, 900);
  });
  ctx.restore();
}

function drawPadDeck(layout) {
  drawActivePadLabels(layout);
  drawPadMapHint(layout);
}

function drawActivePadLabels(layout) {
  for (const rect of layout.labelRects) {
    const pad = pads[rect.padIndex];
    const fill = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
    fill.addColorStop(0, colorWithAlpha(pad.color, 0.26));
    fill.addColorStop(1, colorWithAlpha(pad.color, 0.08));

    ctx.fillStyle = fill;
    ctx.strokeStyle = pad.color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = pad.color;
    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 8;
    roundRect(rect.x, rect.y, rect.width, rect.height, 7);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    ctx.fillStyle = colorWithAlpha(pad.color, 0.78);
    ctx.font = `800 ${Math.max(10, Math.min(13, rect.height * 0.24))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(pad.id, rect.x + rect.width / 2, rect.y + rect.height * 0.34);

    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.font = `850 ${Math.max(10, Math.min(14, rect.height * 0.26))}px ui-sans-serif, system-ui`;
    fitText(pad.name, rect.x + rect.width / 2, rect.y + rect.height * 0.68, rect.width - 8, Math.max(9, rect.height * 0.24), 850);
  }
}

function drawPadMapHint(layout) {
  const active = new Set(layout.activePadIndexes);
  for (const pad of padDisplayOrder) {
    const rect = padMapRect(pad, layout);
    const isActive = active.has(pad.index);
    const alpha = isActive ? 0.62 : 0.16;
    const fill = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
    fill.addColorStop(0, colorWithAlpha(pad.color, isActive ? 0.28 : 0.06));
    fill.addColorStop(1, "rgba(255,255,255,0.018)");

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = fill;
    ctx.strokeStyle = isActive ? pad.color : "rgba(255,255,255,0.18)";
    ctx.lineWidth = isActive ? 1.2 : 1;
    ctx.shadowColor = pad.color;
    ctx.shadowBlur = isActive ? 8 : 0;
    roundRect(rect.x, rect.y, rect.width, rect.height, 5);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.36)";
    ctx.font = `850 ${Math.max(8, Math.min(11, rect.height * 0.42))}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    ctx.fillText(pad.id, rect.x + rect.width / 2, rect.y + rect.height * 0.62);
    ctx.restore();
  }
}

function drawHitEffects(layout) {
  const now = performance.now();
  state.hitEffects = state.hitEffects.filter((effect) => now - effect.startedAt < effect.duration);

  for (const effect of state.hitEffects) {
    const pad = pads[effect.padIndex];
    const progress = (now - effect.startedAt) / effect.duration;
    const alpha = (1 - progress) * 0.72 * effect.intensity;
    const activeRect = layout.labelRects.find((rect) => rect.padIndex === pad.index);
    const mapRect = padMapRect(pad, layout);
    if (activeRect) drawPadPulse(activeRect, pad, progress, alpha, effect.source === "auto");
    drawPadPulse(mapRect, pad, progress, alpha * 0.92, effect.source === "auto");
  }
}

function drawPadPulse(rect, pad, progress, alpha, isAuto) {
  const expand = rect.height * (isAuto ? 0.24 : 0.18) * progress;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = pad.color;
  ctx.shadowColor = pad.color;
  ctx.shadowBlur = (isAuto ? 46 : 34) * (1 - progress);
  roundRect(rect.x - expand, rect.y - expand, rect.width + expand * 2, rect.height + expand * 2, 9);
  ctx.fill();

  ctx.globalAlpha = Math.min(1, alpha + 0.22);
  ctx.strokeStyle = isAuto ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.92)";
  ctx.lineWidth = isAuto ? 3.2 : 2.5;
  ctx.stroke();
  ctx.restore();
}

function colorWithAlpha(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function fitText(text, x, y, maxWidth, maxSize, weight = 800) {
  let fontSize = maxSize;
  do {
    ctx.font = `${weight} ${fontSize}px ui-sans-serif, system-ui`;
    if (ctx.measureText(text).width <= maxWidth || fontSize <= 8) break;
    fontSize -= 1;
  } while (fontSize > 8);
  ctx.fillText(text, x, y);
}

function drawNotes(songTime, layout) {
  if (!state.hasStarted) return;
  for (const note of state.notes) {
    if (note.judged || note.missed) continue;
    if (songTime < note.spawnTime || songTime > note.hitTime + 0.2) continue;

    const pad = pads[note.padIndex];
    const lane = laneRect(pad.index, layout);
    if (!lane) continue;
    const noteFallDuration = note.hitTime - note.spawnTime || secondsPerBeat() * 4.4;
    const progress = (songTime - note.spawnTime) / noteFallDuration;
    const targetY = padTargetY(pad, layout);
    const y = layout.laneTop + (targetY - layout.laneTop) * progress;
    const noteWidth = Math.min(lane.width * 0.7, 120);
    const noteHeight = Math.max(16, Math.min(24, lane.width * 0.26));
    const x = lane.x + lane.width / 2 - noteWidth / 2;

    ctx.fillStyle = pad.color;
    ctx.shadowColor = pad.color;
    ctx.shadowBlur = 18;
    roundRect(x, y - noteHeight / 2, noteWidth, noteHeight, 5);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.font = `800 ${Math.max(10, noteHeight * 0.42)}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    fitText(pad.name, x + noteWidth / 2, y + noteHeight * 0.16, noteWidth - 6, Math.max(9, noteHeight * 0.42), 800);
  }
}

function drawJudgePopups(layout) {
  const now = performance.now();
  state.judgePopups = state.judgePopups.filter((popup) => now - popup.startedAt < popup.duration);

  for (const popup of state.judgePopups) {
    const pad = pads[popup.padIndex];
    const rect = padRect(pad, layout);
    const progress = (now - popup.startedAt) / popup.duration;
    const alpha = 1 - progress;
    const y = rect.y + rect.height * 0.42 - rect.height * 0.32 * progress;
    const toneColor = popup.tone === "good" ? "#68e389" : popup.tone === "warn" ? "#ffd166" : popup.tone === "bad" ? "#ff5b7a" : "#ffffff";

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.font = `900 ${Math.max(15, rect.height * 0.23)}px ui-sans-serif, system-ui`;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(0,0,0,0.72)";
    ctx.strokeText(popup.label, rect.x + rect.width / 2, y);
    ctx.fillStyle = toneColor;
    ctx.shadowColor = toneColor;
    ctx.shadowBlur = 16;
    ctx.fillText(popup.label, rect.x + rect.width / 2, y);
    ctx.restore();
  }
}

function drawIntroCue(songTime, layout) {
  const introBeats = getIntroBeats();
  const introDuration = introBeats * secondsPerBeat();
  if (!state.running || songTime >= introDuration) return;
  const introProgress = introDuration > 0 ? songTime / introDuration : 1;
  const x = layout.deckLeft;
  const y = layout.laneTop + 18;
  const width = layout.deckWidth;
  const height = Math.max(42, layout.height * 0.07);

  ctx.save();
  ctx.fillStyle = "rgba(3, 7, 13, 0.62)";
  roundRect(x, y, width, height, 8);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.font = `900 ${Math.max(16, height * 0.32)}px ui-sans-serif, system-ui`;
  ctx.textAlign = "left";
  ctx.fillText("INTRO", x + 18, y + height * 0.48);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = `700 ${Math.max(11, height * 0.18)}px ui-sans-serif, system-ui`;
  ctx.fillText("伴奏を聴いて、ドラム入りまで準備", x + 18, y + height * 0.76);

  const barX = x + width * 0.42;
  const barY = y + height * 0.42;
  const barWidth = width * 0.52;
  const barHeight = Math.max(5, height * 0.1);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  roundRect(barX, barY, barWidth, barHeight, barHeight / 2);
  ctx.fill();
  ctx.fillStyle = "#ffd60a";
  ctx.shadowColor = "#ffd60a";
  ctx.shadowBlur = 14;
  roundRect(barX, barY, barWidth * introProgress, barHeight, barHeight / 2);
  ctx.fill();
  ctx.restore();
}

function drawCountIn(layout) {
  if (!state.countingIn) return;
  const beatMs = secondsPerBeat() * 1000;
  const elapsed = performance.now() - state.countInStartedAt;
  const beatIndex = Math.min(3, Math.floor(elapsed / beatMs));
  const beatProgress = (elapsed % beatMs) / beatMs;
  const label = String(4 - beatIndex);
  const pulse = 1 + (1 - beatProgress) * 0.22;
  const centerX = layout.width / 2;
  const centerY = layout.laneTop + (layout.deckTop - layout.laneTop) * 0.46;
  const radius = Math.min(layout.width, layout.height) * 0.105 * pulse;

  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = "rgba(3, 7, 13, 0.72)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 214, 10, 0.92)";
  ctx.lineWidth = Math.max(3, radius * 0.045);
  ctx.shadowColor = "#ffd60a";
  ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - beatProgress));
  ctx.stroke();

  ctx.shadowBlur = 18;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.max(44, radius * 0.9)}px ui-sans-serif, system-ui`;
  ctx.fillText(label, centerX, centerY - radius * 0.08);
  ctx.textBaseline = "alphabetic";

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = `800 ${Math.max(12, radius * 0.16)}px ui-sans-serif, system-ui`;
  ctx.fillText("GET READY", centerX, centerY + radius * 0.62);
  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function loadAssignments() {
  try {
    const saved = JSON.parse(localStorage.getItem("finger-drum-midi-map") || "null");
    if (!Array.isArray(saved)) {
      updateAssignStorageStatus(false);
      return;
    }
    state.assignments.clear();
    saved.forEach((note, index) => {
      if (Number.isFinite(note) && pads[index]) {
        pads[index].note = note;
        state.assignments.set(note, index);
      } else if (pads[index]) {
        pads[index].note = null;
      }
    });
    updateAssignStorageStatus(true);
  } catch {
    localStorage.removeItem("finger-drum-midi-map");
    updateAssignStorageStatus(false);
  }
}

function saveAssignments() {
  localStorage.setItem("finger-drum-midi-map", JSON.stringify(pads.map((pad) => pad.note)));
  localStorage.setItem("finger-drum-midi-map-saved-at", new Date().toISOString());
  updateAssignStorageStatus(true);
}

function resetAssignments() {
  state.assignments.clear();
  pads.forEach((pad, index) => {
    const defaultNote = [36, 38, 42, 46, 39, 37, 45, 50, 48, 47, 56, 70, 49, 51, 55, 40][index];
    pad.note = defaultNote;
    state.assignments.set(defaultNote, index);
  });
  localStorage.removeItem("finger-drum-midi-map");
  localStorage.removeItem("finger-drum-midi-map-saved-at");
  renderPads();
  updateAssignStorageStatus(false);
  setJudge("アサイン初期化", "neutral");
}

function updateAssignStorageStatus(hasSavedMap) {
  if (!els.assignStorageStatus) return;
  const savedAt = localStorage.getItem("finger-drum-midi-map-saved-at");
  if (!hasSavedMap) {
    els.assignStorageStatus.textContent = "アサイン: デフォルト設定";
    return;
  }
  if (!savedAt) {
    els.assignStorageStatus.textContent = "アサイン: 保存済み";
    return;
  }
  const time = new Date(savedAt);
  els.assignStorageStatus.textContent = Number.isNaN(time.getTime())
    ? "アサイン: 保存済み"
    : `アサイン: 保存済み ${time.toLocaleString()}`;
}

init();
