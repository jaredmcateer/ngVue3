import globalJsdom from "global-jsdom";
globalJsdom();
Object.defineProperty(window, "mocha", { value: true });
Object.defineProperty(window, "beforeEach", { value: beforeEach });
Object.defineProperty(window, "afterEach", { value: afterEach });

import "angular/angular";
import "angular-mocks";
global.angular = window.angular;
import "./lib/main";
