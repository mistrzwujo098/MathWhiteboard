# Math Whiteboard Core Library

A TypeScript library providing mathematical whiteboard functionality using Fabric.js with full type safety.

## Features

- 🎯 **Full TypeScript Support** - Extended Fabric.js types with custom properties
- 📐 **Mathematical Operations** - Support for equations (LaTeX/MathML)
- 🎨 **Drawing Tools** - Pen, pencil, marker with pressure sensitivity
- 💾 **Serialization** - Save/load whiteboard state
- ⚛️ **React Integration** - Ready-to-use React components

## Installation

```bash
npm install @mathwhiteboard/core
```

## Usage

### Basic Usage

```typescript
import { MathWhiteboard } from '@mathwhiteboard/core';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const whiteboard = new MathWhiteboard(canvas);

// Add text
const text = whiteboard.addText('Hello Math!', {
  left: 100,
  top: 100
});

// Add equation
const equation = whiteboard.createEquation('E = mc^2', {
  left: 200,
  top: 200
});
```

### React Component

```tsx
import { MathWhiteboardComponent } from '@mathwhiteboard/core';

function App() {
  return (
    <MathWhiteboardComponent
      width={800}
      height={600}
      onObjectAdded={(obj) => console.log('Added:', obj)}
    />
  );
}
```

## Type Extensions

All Fabric.js objects are extended with:

```typescript
interface ExtendedObject {
  id?: string;
  nodeType?: 'text' | 'shape' | 'drawing' | 'equation';
  createdAt?: Date;
  lastModified?: Date;
  metadata?: Record<string, any>;
}
```

## License

MIT