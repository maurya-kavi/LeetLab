function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
      74: "TypeScript",
      63: "JavaScript",
      71: "Python",
      62: "Java",
      50: "C",
      54: "C++",
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
  }

  export { getLanguageName };


  export function getLanguageId(language) {
    const languageMap = {
      "PYTHON": 71,
      "JAVASCRIPT": 63,
      "JAVA": 62,
      "TypeScript": 74,
      "C": 50,
      "CPP": 54,
    };
    return languageMap[language.toUpperCase()];
  }

  export function getLanguageLabel(language) {
    const labels = {
      JAVASCRIPT: "JavaScript",
      PYTHON: "Python",
      JAVA: "Java",
      C: "C",
      CPP: "C++",
      TYPESCRIPT: "TypeScript",
    };
    return labels[language.toUpperCase()] || language;
  }
