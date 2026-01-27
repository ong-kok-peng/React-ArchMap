import { useState } from 'react'
import CommandInput from './CommandInput';
import {CodeDisplay, MapDisplay} from './ArchDisplay';
import './assets/css/App.css'

function App() {
  const [archObj, setArchObj] = useState({});

  return (
    <div className="app">
      <div className='display'>
        <MapDisplay archObjIn={archObj} />
        <CodeDisplay archObjIn={archObj} />
      </div>
      <CommandInput archObjOut={setArchObj} />
    </div>
  )
}

export default App