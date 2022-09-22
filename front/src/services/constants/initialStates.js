const InitialStates = {
  LANG: (navigator.language || navigator.userLanguage) === "th" ? "th" : "en",
  THEME:
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  LOADING: false,
  TRAINLIST: [],
  SEATLIST: [],
  TICKETLIST: [],
};

export default InitialStates;
