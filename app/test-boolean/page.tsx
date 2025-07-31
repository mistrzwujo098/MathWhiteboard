'use client'

export default function TestBooleanPage() {
  const testCases = {
    directTrue: true,
    directFalse: false,
    objectWithBoolean: { enabled: true },
    arrayWithBoolean: [true, false],
    conditionalRender: true && 'This shows',
    ternaryRender: true ? 'True' : 'False'
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Boolean Rendering Test</h1>
      
      <div className="space-y-2">
        <div>Direct true: {testCases.directTrue}</div>
        <div>Direct false: {testCases.directFalse}</div>
        <div>String of true: {String(testCases.directTrue)}</div>
        <div>Conditional: {testCases.conditionalRender}</div>
        <div>Ternary: {testCases.ternaryRender}</div>
        
        <div className="mt-4 p-4 border-2 border-red-500">
          <p className="text-red-600 mb-2">These will cause errors:</p>
          
          {/* This will cause error #185 */}
          {/* <div>Object with boolean: {testCases.objectWithBoolean}</div> */}
          
          {/* This is OK because arrays are valid */}
          <div>Array with boolean: {testCases.arrayWithBoolean}</div>
        </div>
        
        <div className="mt-4">
          <h2 className="font-bold">Session settings test:</h2>
          <div>Grid enabled: {true}</div>
          <div>Student can draw: {true}</div>
          
          {/* This would cause an error */}
          {/* <div>Settings object: {{ grid_enabled: true, student_can_draw: true }}</div> */}
          
          {/* This is safe */}
          <div>Settings JSON: {JSON.stringify({ grid_enabled: true, student_can_draw: true })}</div>
        </div>
      </div>
    </div>
  )
}