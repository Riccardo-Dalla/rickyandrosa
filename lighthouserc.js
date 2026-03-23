module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready in",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/save-the-date",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.8 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
