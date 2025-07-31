'use client'

export default function SimpleTest() {
  // Test różnych typów renderowania
  const testCases = {
    string: "Hello",
    number: 123,
    boolean: true,
    null: null,
    undefined: undefined,
    object: { key: 'value' },
    array: [1, 2, 3],
    date: new Date(),
    function: () => 'test'
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Render Test</h1>
      
      <div className="space-y-2">
        <div>String: {testCases.string}</div>
        <div>Number: {testCases.number}</div>
        <div>Boolean: {testCases.boolean}</div>
        <div>Null: {testCases.null}</div>
        <div>Undefined: {testCases.undefined}</div>
        
        {/* Te poniżej powinny wywołać błąd */}
        <div className="mt-4 p-4 border-2 border-red-500">
          <p className="text-red-600 mb-2">Następne będą testować błędne renderowania:</p>
          
          <div>
            <span>Object test: </span>
            <ErrorWrapper>
              {testCases.object}
            </ErrorWrapper>
          </div>
          
          <div>
            <span>Array test: </span>
            <ErrorWrapper>
              {testCases.array}
            </ErrorWrapper>
          </div>
          
          <div>
            <span>Date test: </span>
            <ErrorWrapper>
              {testCases.date}
            </ErrorWrapper>
          </div>
          
          <div>
            <span>Function test: </span>
            <ErrorWrapper>
              {testCases.function}
            </ErrorWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorWrapper({ children }: { children: any }) {
  try {
    return <span className="text-green-600">{children}</span>
  } catch (error) {
    return <span className="text-red-600">ERROR: {String(error)}</span>
  }
}