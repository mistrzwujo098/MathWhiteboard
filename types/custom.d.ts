// Custom type extensions for the project

interface FabricObjectWithId extends fabric.Object {
  id?: string;
}

// Extend window for any global properties
declare global {
  interface Window {
    // Add any custom window properties here if needed
  }
}

export {};