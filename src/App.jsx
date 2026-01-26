import { useState } from 'react'
//import './App.css'
import CommandInput from './CommandInput';
import CodeDisplay from './CodeDisplay';

function App() {
  const [archObj, setArchObj] = useState({});

  return (
    <div>
      <CommandInput archObjOut={setArchObj} />
      <CodeDisplay archObjIn={archObj} />
    </div>
  )
}

export default App