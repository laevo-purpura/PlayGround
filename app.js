const LANGUAGES = [
  {
    code: "fr",
    label: "Français",
    short: "FR",
    greet: "Salut",
    locale: "fr-FR",
    placeholder: "Ton prénom…",
    times: {
      morning: "Bonne matinée — comment tu t'appelles ?",
      afternoon: "Bel après-midi — comment tu t'appelles ?",
      evening: "Bonne soirée — comment tu t'appelles ?",
      night: "Douce nuit — comment tu t'appelles ?",
    },
    withName: (name, period) =>
      `${period === "morning" ? "Bonne matinée" : period === "afternoon" ? "Bel après-midi" : period === "evening" ? "Bonne soirée" : "Douce nuit"}, ${name}.`,
  },
  {
    code: "en",
    label: "English",
    short: "EN",
    greet: "Hey",
    locale: "en-GB",
    placeholder: "Your first name…",
    times: {
      morning: "Good morning — what's your name?",
      afternoon: "Good afternoon — what's your name?",
      evening: "Good evening — what's your name?",
      night: "Good night — what's your name?",
    },
    withName: (name, period) =>
      `${period === "morning" ? "Good morning" : period === "afternoon" ? "Good afternoon" : period === "evening" ? "Good evening" : "Good night"}, ${name}.`,
  },
  {
    code: "es",
    label: "Español",
    short: "ES",
    greet: "Hola",
    locale: "es-ES",
    placeholder: "Tu nombre…",
    times: {
      morning: "Buenos días — ¿cómo te llamas?",
      afternoon: "Buenas tardes — ¿cómo te llamas?",
      evening: "Buenas noches — ¿cómo te llamas?",
      night: "Que descanses — ¿cómo te llamas?",
    },
    withName: (name, period) =>
      `${period === "morning" ? "Buenos días" : period === "afternoon" ? "Buenas tardes" : "Buenas noches"}, ${name}.`,
  },
  {
    code: "it",
    label: "Italiano",
    short: "IT",
    greet: "Ciao",
    locale: "it-IT",
    placeholder: "Il tuo nome…",
    times: {
      morning: "Buongiorno — come ti chiami?",
      afternoon: "Buon pomeriggio — come ti chiami?",
      evening: "Buonasera — come ti chiami?",
      night: "Buonanotte — come ti chiami?",
    },
    withName: (name, period) =>
      `${period === "morning" ? "Buongiorno" : period === "afternoon" ? "Buon pomeriggio" : period === "evening" ? "Buonasera" : "Buonanotte"}, ${name}.`,
  },
  {
    code: "de",
    label: "Deutsch",
    short: "DE",
    greet: "Hallo",
    locale: "de-DE",
    placeholder: "Dein Vorname…",
    times: {
      morning: "Guten Morgen — wie heißt du?",
      afternoon: "Guten Tag — wie heißt du?",
      evening: "Guten Abend — wie heißt du?",
      night: "Gute Nacht — wie heißt du?",
    },
    withName: (name, period) =>
      `${period === "morning" ? "Guten Morgen" : period === "afternoon" ? "Guten Tag" : period === "evening" ? "Guten Abend" : "Gute Nacht"}, ${name}.`,
  },
  {
    code: "pt",
    label: "Português",
    short: "PT",
    greet: "Olá",
    locale: "pt-PT",
    placeholder: "O teu nome…",
    times: {
      morning: "Bom dia — como te chamas?",
      afternoon: "Boa tarde — como te chamas?",
      evening: "Boa noite — como te chamas?",
      night: "Boa noite — como te chamas?",
    },
    withName: (name, period) =>
      `${period === "morning" ? "Bom dia" : period === "afternoon" ? "Boa tarde" : "Boa noite"}, ${name}.`,
  },
  {
    code: "ja",
    label: "日本語",
    short: "JA",
    greet: "こんにちは",
    locale: "ja-JP",
    placeholder: "お名前…",
    times: {
      morning: "おはようございます。お名前は？",
      afternoon: "こんにちは。お名前は？",
      evening: "こんばんは。お名前は？",
      night: "おやすみなさい。お名前は？",
    },
    withName: (name) => `こんにちは、${name}さん。`,
  },
  {
    code: "ar",
    label: "العربية",
    short: "AR",
    greet: "مرحبا",
    locale: "ar",
    placeholder: "اسمك…",
    times: {
      morning: "صباح الخير — ما اسمك؟",
      afternoon: "مساء الخير — ما اسمك؟",
      evening: "مساء الخير — ما اسمك؟",
      night: "تصبح على خير — ما اسمك؟",
    },
    withName: (name) => `مرحبا، ${name}.`,
  },
];

const $ = (selector) => document.querySelector(selector);
const ui = {
  date: $("#date"),
  clock: $("#clock"),
  greeting: $("#greeting"),
  subline: $("#subline"),
  name: $("#name"),
  form: $("#name-form"),
  chips: $("#chips"),
  copy: $("#copy"),
  surprise: $("#surprise"),
  toast: $("#toast"),
};

const storage = {
  get(key, fallback) {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

const state = {
  lang: findLanguage(storage.get("salut.lang", "fr")) ?? LANGUAGES[0],
  name: sanitize(storage.get("salut.name", "")),
};

function findLanguage(code) {
  return LANGUAGES.find((language) => language.code === code);
}

function sanitize(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

function periodOf(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 23) return "evening";
  return "night";
}

function greetingText() {
  const base = state.lang.greet;
  return state.name ? `${base}, ${state.name}` : base;
}

function sublineText() {
  const period = periodOf();
  return state.name ? state.lang.withName(state.name, period) : state.lang.times[period];
}

let swapTimer;
function renderGreeting(animate = true) {
  const next = greetingText();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.clearTimeout(swapTimer);
  if (!animate || reduced) {
    ui.greeting.classList.remove("swap");
    ui.greeting.textContent = next;
    return;
  }
  if (next === ui.greeting.textContent) return;
  ui.greeting.classList.add("swap");
  swapTimer = window.setTimeout(() => {
    ui.greeting.textContent = next;
    ui.greeting.classList.remove("swap");
  }, 180);
}

function renderSubline() {
  ui.subline.textContent = sublineText();
}

function renderDate() {
  const now = new Date();
  const text = new Intl.DateTimeFormat(state.lang.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
  ui.date.textContent = text.charAt(0).toUpperCase() + text.slice(1);
}

function renderClock() {
  ui.clock.textContent = new Intl.DateTimeFormat(state.lang.locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

let chipsBuilt = false;
function renderChips() {
  if (!chipsBuilt) {
    ui.chips.replaceChildren(
      ...LANGUAGES.map((language) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.dataset.code = language.code;
        chip.textContent = `${language.short} · ${language.greet}`;
        chip.setAttribute("aria-label", `Dire bonjour en ${language.label}`);
        chip.addEventListener("click", () => selectLanguage(language.code));
        return chip;
      }),
    );
    chipsBuilt = true;
  }
  for (const chip of ui.chips.children) {
    chip.setAttribute("aria-pressed", String(chip.dataset.code === state.lang.code));
  }
}

function renderLanguageDependent() {
  document.documentElement.lang = state.lang.code;
  ui.greeting.lang = state.lang.code;
  ui.name.placeholder = state.lang.placeholder;
  renderChips();
  renderDate();
  renderClock();
  renderSubline();
  renderGreeting();
}

function selectLanguage(code, animate = true) {
  const next = findLanguage(code);
  if (!next || next.code === state.lang.code) return;
  state.lang = next;
  storage.set("salut.lang", next.code);
  document.documentElement.lang = next.code;
  ui.name.placeholder = next.placeholder;
  setGreetingLanguageDirection();
  renderChips();
  renderDate();
  renderClock();
  renderSubline();
  renderGreeting(animate);
}

function setGreetingLanguageDirection() {
  document.documentElement.dir = state.lang.code === "ar" ? "rtl" : "ltr";
}

let toastTimer;
function showToast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => ui.toast.classList.remove("show"), 2200);
}

function updateName(value) {
  state.name = sanitize(value);
  storage.set("salut.name", state.name);
  renderSubline();
  renderGreeting(false);
}

ui.name.addEventListener("input", (event) => updateName(event.target.value));

ui.form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateName(ui.name.value);
  renderGreeting(false);
  showToast(state.name ? `Salut, ${state.name} !` : "Dis-moi ton prénom, je te saluerai.");
});

ui.copy.addEventListener("click", async () => {
  const text = `${greetingText()} — ${sublineText()}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Salutation copiée.");
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    showToast(ok ? "Salutation copiée." : "Impossible de copier.");
  }
});

ui.surprise.addEventListener("click", () => {
  const others = LANGUAGES.filter((language) => language.code !== state.lang.code);
  const pick = others[Math.floor(Math.random() * others.length)];
  selectLanguage(pick.code);
  showToast(`${pick.label} : ${pick.greet} !`);
});

ui.name.value = state.name;
setGreetingLanguageDirection();
renderLanguageDependent();

renderClock();
window.setInterval(renderClock, 15000);
