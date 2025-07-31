// Debug utility to catch React rendering errors
export const debugRender = (value: any, context: string) => {
  if (typeof window !== 'undefined') {
    console.log(`[DEBUG ${context}]`, {
      type: typeof value,
      value,
      isObject: typeof value === 'object' && value !== null,
      isArray: Array.isArray(value),
      stringValue: String(value)
    });
  }
  
  // Check if value is renderable
  if (value && typeof value === 'object' && !Array.isArray(value) && !value.$$typeof) {
    console.error(`[ERROR ${context}] Attempting to render non-React object:`, value);
    return JSON.stringify(value);
  }
  
  return value;
};

export const safeRender = (value: any, defaultValue: string = ''): any => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(v => safeRender(v, defaultValue));
  if (value && value.$$typeof) return value; // React element
  
  console.warn('[safeRender] Non-renderable value:', value);
  return defaultValue;
};