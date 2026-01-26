import { useState } from 'react'
//import './CodeDisplay.css'

function CodeDisplay({archObjIn}) {

  if (Object.keys(archObjIn).length == 0) { return (
    <div>
        <p>Architecture in code:</p>
        <pre>
        {`{`}
        {`\n}`}
        </pre>
    </div>
  )}

   return (
    <div>
        <p>Architecture in code:</p>
        <pre>
        {`{`}
        {`\n  nodes: [`}
        {archObjIn.nodes.map((node, i) => (
            <span key={node.id ?? i}>
            {`\n    { id: "${node.id}", position_x: ${node.position_x}, position_y: ${node.position_y}, label: "${node.label}" }`}
            </span>
        ))}
        {`\n  ],`}
        {`\n  edges: [`}
        {archObjIn.edges.map((edge, i) => (
            <span key={edge.id ?? i}>
            {`\n    { id: "${edge.id}" }`}
            </span>
        ))}
        {`\n  ]`}
        {`\n}`}
        </pre>
    </div>
  );
}

export default CodeDisplay