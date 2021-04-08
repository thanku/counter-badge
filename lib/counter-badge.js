// CONFIG

const ORIGIN = "https://www.thanku.social";
const STEP_COUNT = 4;

// HELPER

function toProfileUrl({ slug, lang }) {
  return `https://thx.to/:${slug}/${lang}`;
}

function toError({ message, id }) {
  const error = new Error(message);
  error.id = id;
  return error;
}

function range(from, to) {
  return Array.from({ length: Math.abs(from - to) + 1 }).map(
    (_, i) => from + i
  );
}

function htmlEscape(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function html(strings, ...args) {
  return strings
    .map((str, i) =>
      i < args.length
        ? str + (args[i].__html ? args[i].__html : htmlEscape(String(args[i])))
        : str
    )
    .join("");
}

function createStore({ getState, setState, update, onUpdate }) {
  const dispatch = (action) =>
    requestAnimationFrame(() => {
      const prevState = { ...getState() };
      const [nextState, cmd] = update(prevState, action);
      if (prevState !== nextState) {
        setState(nextState);
        onUpdate({ ...nextState }, prevState);
      }
      cmd({ ...nextState }, dispatch);
    });
  return dispatch;
}

// API CLIENT

const Api = {
  fetchProfileData(slug) {
    return fetch(`${ORIGIN}/api/profile/${slug}`, {
      headers: { "Content-Type": "application/json" },
    }).then(
      async (res) => {
        if (res.status >= 400) {
          throw toError({
            message: "Data not available",
            id: "dataNotAvailable",
          });
        }
        return res.json().catch(() => {
          throw toError({ message: "Data malformed", id: "dataMalformed" });
        });
      },
      () => {
        throw toError({
          message: "Connection problems",
          id: "connectionProblems",
        });
      }
    );
  },
};

// STYLES

const styles = html`
  <style>
    :host {
      --size: 100px;
      --color-darkblue: #202c55;
      --color-red: #e33429;
      --color-teal: #5fc2c5;
    }
    .container {
      align-items: center;
      background-color: var(--color-darkblue);
      border-radius: 50%;
      color: white;
      display: flex;
      font-family: "Exo", sans-serif;
      font-size: calc(var(--size) / 6.25); /* 16px at 100px size */
      height: var(--size);
      justify-content: center;
      line-height: 1.25;
      overflow: hidden;
      text-decoration: none;
      width: var(--size);
    }
    .container--error {
      background-color: var(--color-red);
      cursor: not-allowed;
    }
    .container--loading {
      cursor: wait;
    }
    .container--steps {
      position: relative;
    }

    .step {
      height: 100%;
      opacity: 0;
      position: absolute;
      transition: opacity 300ms;
      width: 100%;
      z-index: 1;
    }
    .step--current {
      opacity: 1;
      z-index: 2;
    }

    .content {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      width: 100%;
    }
    .content--counter {
      background-color: var(--color-teal);
    }
    .content--logo {
      background-color: white;
    }
    .content--signet {
      background-color: var(--color-darkblue);
    }

    .counter-value {
      color: white;
      font-size: 200%;
      line-height: 1;
      padding-top: 3%;
    }
    .counter-label {
      color: var(--color-darkblue);
      font-size: 80%;
      font-weight: 600;
      line-height: 1;
      padding-top: 3%;
    }

    .error {
      background-color: white;
      height: 0;
      overflow: hidden;
      padding-top: 16%;
      width: 72%;
    }
  </style>
`;

// TRANSLATIONS

const translations = {
  de: {
    profileLinkTitle: ({ nickname }) => `ThankU-Seite von ${nickname} besuchen`,
    collected: "gesammelt",
    sent: "gesendet",
    error: {
      headline: "Datenabruf fehlgeschlagen",
      dataNotAvailable: "Daten sind nicht verfügbar",
      dataMalformed: "Daten sind fehlerhaft",
      connectionProblems: "Verbindungsprobleme",
    },
  },
  en: {
    profileLinkTitle: ({ nickname }) => `Visit ${nickname}'s ThankU page`,
    collected: "collected",
    sent: "sent",
    error: {
      headline: "Fetching data failed",
      dataNotAvailable: "Data is not available",
      dataMalformed: "Data is malformed",
      connectionProblems: "Connection problems",
    },
  },
};

// RENDER HELPER

const signet = html`
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    fill-rule="evenodd"
    clip-rule="evenodd"
    stroke-linejoin="round"
    stroke-miterlimit="2"
  >
    <path
      d="M68.238 144.482H55.055c-8.824 0-15.988-7.164-15.988-15.988V73.45c0-8.824 7.164-15.988 15.988-15.988h89.89c8.824 0 15.988 7.164 15.988 15.988v55.044c0 8.824-7.164 15.988-15.988 15.988H87.44l-19.443 14.056.241-14.056z"
      fill="#54c1c8"
    />
    <path
      d="M100.056 89.509c6.458-9.263 19.373-9.263 25.831-4.631 6.458 4.631 6.458 13.894 0 23.157-4.52 6.947-16.144 13.894-25.831 18.525-9.686-4.631-21.31-11.578-25.831-18.525-6.457-9.263-6.457-18.526 0-23.157 6.458-4.632 19.373-4.632 25.831 4.631z"
      fill="#fff"
    />
  </svg>
`;

const logo = html`
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    fill-rule="evenodd"
    clip-rule="evenodd"
    stroke-linejoin="round"
    stroke-miterlimit="2"
  >
    <path
      d="M33.707 90.199H25v-5.705h23.806v5.705h-8.75v26.036h-6.349V90.199zm18.23-6.649h6.349v12.011c.858-.744 1.966-1.387 3.324-1.931 1.358-.543 2.695-.815 4.01-.815 4.719 0 7.078 2.731 7.078 8.193v15.227H66.35v-14.412c0-1.058-.301-1.873-.901-2.445-.601-.572-1.401-.858-2.402-.858-1.573 0-3.16.572-4.761 1.716v15.999h-6.349V83.55zm30.412 32.943c-1.773 0-3.195-.522-4.268-1.566-1.072-1.044-1.608-2.466-1.608-4.268V108.6c0-1.83.636-3.288 1.909-4.375 1.272-1.087 3.167-1.63 5.683-1.63h5.876v-1.587c0-.772-.128-1.38-.386-1.823-.257-.443-.743-.772-1.458-.987-.715-.214-1.773-.321-3.174-.321h-6.906v-3.689c2.831-.858 5.905-1.287 9.222-1.287 3.031 0 5.298.572 6.799 1.716 1.501 1.144 2.252 3.131 2.252 5.962v15.656h-5.019l-1.029-2.445c-.315.315-.872.687-1.673 1.116-.801.429-1.752.8-2.853 1.115a12.217 12.217 0 01-3.367.472zm3.303-4.418c.658 0 1.473-.15 2.445-.451.972-.3 1.587-.522 1.844-.665v-5.361l-3.86.257c-2.173.172-3.26 1.115-3.26 2.831v.944c0 1.63.944 2.445 2.831 2.445zm15.399-18.874h5.233l1.115 2.36c.944-.773 2.073-1.423 3.389-1.952 1.315-.529 2.602-.794 3.86-.794 2.603 0 4.447.744 5.534 2.231 1.086 1.487 1.63 3.488 1.63 6.005v15.184h-6.349v-14.369c0-1.087-.293-1.916-.879-2.488-.586-.572-1.394-.858-2.424-.858-1.572 0-3.159.572-4.761 1.716v15.999h-6.348V93.201zm25.522-9.694h6.348v17.673h2.703l5.061-7.979h6.434l-6.777 10.852 7.463 12.182h-6.434l-5.833-9.351h-2.617v9.351h-6.348V83.507z"
      fill="#202c55"
      fill-rule="nonzero"
    />
    <path
      d="M162.604 116.45c-3.975 0-7.035-.751-9.18-2.252-2.144-1.501-3.217-4.225-3.217-8.171V84.494h6.349v21.49c0 1.687.507 2.902 1.522 3.646 1.016.743 2.524 1.115 4.526 1.115 2.001 0 3.503-.372 4.504-1.115 1-.744 1.501-1.959 1.501-3.646v-21.49H175v21.533c0 3.946-1.08 6.67-3.238 8.171-2.16 1.501-5.212 2.252-9.158 2.252z"
      fill="#5fc2c5"
      fill-rule="nonzero"
    />
  </svg>
`;

function renderData({
  t,
  lang,
  step,
  data: {
    user: { nickname, slug },
    thankus: { collected, sent },
  },
}) {
  return html`
    <a
      href="${toProfileUrl({ slug, lang })}"
      title="${t.profileLinkTitle({ nickname })}"
      class="container container--steps"
    >
      ${{
        __html: range(0, STEP_COUNT - 1)
          .map(
            (i) =>
              html`<div class="${step === i ? "step step--current" : "step"}">
                ${{ __html: renderStep({ t, step: i, collected, sent }) }}
              </div>`
          )
          .join(""),
      }}
    </a>
  `;
}

function renderStep({ t, step, collected, sent }) {
  switch (step) {
    case 3:
      return html`<div class="content content--counter">
        <span class="counter-value">${collected}</span>
        <span class="counter-label">${t.collected}</span>
      </div>`;
    case 2:
      return html`<div class="content content--logo">${{ __html: logo }}</div>`;
    case 1:
      return html`<div class="content content--counter">
        <span class="counter-value">${sent}</span>
        <span class="counter-label">${t.sent}</span>
      </div>`;
    case 0:
    default:
      return html`<div class="content content--signet">
        ${{ __html: signet }}
      </div>`;
  }
}

function renderLoading() {
  return html`
    <div class="container container--loading">${{ __html: signet }}</div>
  `;
}

function renderError({ error, t }) {
  const errorMessage = [
    t.error.headline,
    t.error[error.id] || error.message,
  ].join(" - ");
  return html`
    <div class="container container--error" title="${errorMessage}">
      <div class="error">${errorMessage}</div>
    </div>
  `;
}

// COMMANDS

const noCmd = Function.prototype;

function loadDataCmd(state, dispatch) {
  Api.fetchProfileData(state.slug).then(
    (data) => dispatch({ name: "LOAD_DATA_SUCCEEDED", payload: data }),
    (error) => dispatch({ name: "LOAD_DATA_FAILED", payload: { error } })
  );
}

function startStepperCmd(state, dispatch) {
  if (!state.intervalId) {
    const intervalId = setInterval(
      () => dispatch({ name: "NEXT_STEP_WANTED" }),
      state.duration
    );
    dispatch({ name: "INTERVAL_ID_UPDATED", payload: intervalId });
  }
}

function stopStepperCmd(state, dispatch) {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    dispatch({ name: "INTERVAL_ID_UPDATED", payload: null });
  }
}

function restartStepperCmd(state, dispatch) {
  if (state.intervalId) {
    clearInterval(state.intervalId);
  }
  const intervalId = setInterval(
    () => dispatch({ name: "NEXT_STEP_WANTED" }),
    state.duration
  );
  dispatch({ name: "INTERVAL_ID_UPDATED", payload: intervalId });
}

// UPDATE

function update(state, { name, payload }) {
  switch (name) {
    case "INIT": {
      const slug = payload.slug || state.slug;
      const lang = payload.lang || state.lang;
      const duration = payload.duration || state.duration;
      const profile = { isLoading: true };
      return [{ ...state, slug, lang, duration, profile }, loadDataCmd];
    }
    case "LOAD_DATA_FAILED": {
      return [{ ...state, profile: { error: payload.error } }, stopStepperCmd];
    }
    case "LOAD_DATA_SUCCEEDED": {
      return [
        { ...state, profile: { data: payload } },
        state.isConnected ? startStepperCmd : noCmd,
      ];
    }
    case "INTERVAL_ID_UPDATED": {
      return [{ ...state, intervalId: payload }, noCmd];
    }
    case "NEXT_STEP_WANTED": {
      return [
        { ...state, step: state.step < STEP_COUNT - 1 ? state.step + 1 : 0 },
        noCmd,
      ];
    }
    case "LANG_UPDATED": {
      return [{ ...state, lang: payload }, noCmd];
    }
    case "SLUG_UPDATED": {
      return [{ ...state, slug: payload }, loadDataCmd];
    }
    case "DURATION_UPDATED": {
      return [{ ...state, duration: payload }, restartStepperCmd];
    }
    case "CONNECTED": {
      return [
        { ...state, isConnected: true },
        state.profile.data ? startStepperCmd : noCmd,
      ];
    }
    case "DISCONNECTED": {
      return [{ ...state, isConnected: false }, stopStepperCmd];
    }
    default: {
      return [state, noCmd];
    }
  }
}

// RENDER

const render = (elem) => (state, prevState) => {
  const hasChanged = (attr) => prevState[attr] !== state[attr];
  if (hasChanged("profile") || hasChanged("lang")) {
    const t = translations[state.lang] || translations.en;
    switch (true) {
      case !!state.profile.loading:
        elem.innerHTML = renderLoading();
        break;
      case !!state.profile.error:
        elem.innerHTML = renderError({ t, error: state.profile.error });
        break;
      case !!state.profile.data:
        elem.innerHTML = renderData({
          t,
          lang: state.lang,
          step: state.step,
          data: state.profile.data,
        });
        break;
      default:
      // do nothing
    }
  } else if ("data" in state.profile && hasChanged("step")) {
    elem.querySelectorAll(".step").forEach(($step, i) => {
      $step.classList.toggle("step--current", i === state.step);
    });
  }
};

// WEB COMPONENT

const STATE = Symbol("STATE");

class ThankUCounterBadge extends HTMLElement {
  [STATE] = {
    step: 0,
    isConnected: false,
    intervalId: null,
    profile: { notAsked: true },
    // attributes
    slug: "universe",
    lang: "en",
    duration: 2000,
  };

  get slug() {
    return this[STATE].slug;
  }
  set slug(slug) {
    this.dispatch({ name: "SLUG_UPDATED", payload: slug });
  }

  get lang() {
    return this[STATE].lang;
  }
  set lang(lang) {
    this.dispatch({ name: "LANG_UPDATED", payload: lang });
  }

  get duration() {
    return this[STATE].duration;
  }
  set duration(duration) {
    this.dispatch({ name: "DURATION_UPDATED", payload: duration });
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = styles + `<div id="wrapper"></div>`;
    const $wrapper = shadow.getElementById("wrapper");
    this.dispatch = createStore({
      getState: () => this[STATE],
      setState: (state) => (this[STATE] = state),
      update,
      onUpdate: render($wrapper),
    });
    this.dispatch({
      name: "INIT",
      payload: {
        slug: this.getAttribute("slug"),
        lang: this.getAttribute("lang"),
        duration: Number.parseInt(this.getAttribute("duration")),
      },
    });
  }

  connectedCallback() {
    if (this.isConnected) {
      this.dispatch({ name: "CONNECTED" });
    }
  }

  disconnectedCallback() {
    this.dispatch({ name: "DISCONNECTED" });
  }
}

customElements.define("thanku-counter-badge", ThankUCounterBadge);

export { ThankUCounterBadge };
