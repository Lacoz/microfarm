// Test setup for frontend
import { jest } from '@jest/globals';

// Mock canvas
Object.defineProperty(window, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {
    getContext: any;
    constructor() {
      this.getContext = jest.fn(() => ({
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        arc: jest.fn(),
        fill: jest.fn(),
        stroke: jest.fn(),
        closePath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        strokeStyle: '',
        fillStyle: '',
        lineWidth: 1,
      }));
    }
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback: any) => {
  setTimeout(callback, 0);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock fetch
(global as any).fetch = jest.fn();

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
