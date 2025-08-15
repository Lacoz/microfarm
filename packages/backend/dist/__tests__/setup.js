"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Test setup for backend
const globals_1 = require("@jest/globals");
// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: globals_1.jest.fn(),
    debug: globals_1.jest.fn(),
    info: globals_1.jest.fn(),
    warn: globals_1.jest.fn(),
    error: globals_1.jest.fn(),
};
// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3002'; // Use different port for tests
//# sourceMappingURL=setup.js.map