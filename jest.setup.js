// Global test setup
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock canvas for frontend tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'HTMLCanvasElement', {
    value: class HTMLCanvasElement {
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
}
