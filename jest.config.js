/*module.exports = {
  // ...
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};*/

// jest.config.js
const { defaults } = require("jest-config");
module.exports = {
  // ...
  preset: "ts-jest/presets/js-with-ts",
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "ts",
    "tsx",
    "js",
    "ts",
    "d.ts",
    "jsx"
  ],
  moduleNameMapper: {
    "^@App/(.*)$": "<rootDir>/$1"
  },
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }

  // ...
};
