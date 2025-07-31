'use client'

export default function MinimalPage() {
  // Test 1: Podstawowe renderowanie
  const basicTest = "Hello World"
  
  // Test 2: Potencjalny problem - obiekt
  const objectTest = { key: 'value' }
  
  // Test 3: Tablica
  const arrayTest = ['a', 'b', 'c']
  
  // Test 4: Boolean
  const booleanTest = true
  
  // Test 5: Null/undefined
  const nullTest = null
  const undefinedTest = undefined

  return (
    <div className="p-8">
      <h1>Minimal Test Page</h1>
      
      <div>Test 1 (string): {basicTest}</div>
      
      <div>Test 2 (object): 
        <span style={{ color: 'red' }}>
          {/* Ten powinien wywołać błąd #185 */}
          {/* {objectTest} */}
          {JSON.stringify(objectTest)}
        </span>
      </div>
      
      <div>Test 3 (array): {arrayTest}</div>
      
      <div>Test 4 (boolean): {booleanTest}</div>
      
      <div>Test 5 (null): {nullTest}</div>
      
      <div>Test 6 (undefined): {undefinedTest}</div>
    </div>
  )
}