import globalJsdom from "global-jsdom";
globalJsdom();
Object.defineProperty(window, "mocha", { value: true });
Object.defineProperty(window, "beforeEach", { value: beforeEach });
Object.defineProperty(window, "afterEach", { value: afterEach });

import "angular/angular";
import "angular-mocks";
global.angular = window.angular;
import "./lib/main";

global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
