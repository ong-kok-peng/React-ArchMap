import { useState } from 'react'
//import './App.css'
import CommandInput from './CommandInput';
import CodeDisplay from './CodeDisplay';

function App() {
  const [nodesObj, setNodesObj] = useState({});

  return (
    <div>
      <CommandInput nodesObjOut={setNodesObj} />
      <CodeDisplay nodesObjIn={nodesObj} />
    </div>
  )
}

export default App