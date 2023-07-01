module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/styleMock.js',
  }
};
