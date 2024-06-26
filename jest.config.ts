import type { Config } from "jest";

const config: Config = {
  rootDir: "src/",
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  moduleNameMapper: { "(.+)\\.js": "$1" },
};

export default config;
