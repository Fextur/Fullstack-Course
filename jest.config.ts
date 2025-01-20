import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["js", "ts"],
  clearMocks: true,
  setupFiles: ["dotenv/config"],
  maxWorkers: 1,
};

export default config;
