// Test setup for frontend
import { vi } from 'vitest';

// Mock canvas
Object.defineProperty(window, 'HTMLCanvasElement', {
  value: class HTMLCanvasElement {
    getContext: any;
    constructor() {
      this.getContext = vi.fn(() => ({
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        strokeStyle: '',
        fillStyle: '',
        lineWidth: 1,
      }));
    }
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback: any) => {
  setTimeout(callback, 0);
  return 1;
});

global.cancelAnimationFrame = vi.fn();

// Mock fetch
(global as any).fetch = vi.fn();

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
