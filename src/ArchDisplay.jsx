import { useState } from 'react'
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './assets/css/ArchDisplay.css'

export function CodeDisplay({archObjIn}) {
  if (Object.keys(archObjIn).length == 0) { return (
    <div className="codeDisplay">
        <p>Architecture in code:</p>
        <pre>
        {`{`}
        {`\n}`}
        </pre>
    </div>
  )}

   return (
    <div className="codeDisplay">
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
            {`\n    { id: "${edge.id}", source: "${edge.source}", destination: "${edge.destination}" }`}
            </span>
        ))}
        {`\n  ]`}
        {`\n}`}
        </pre>
    </div>
  );
}

export function MapDisplay({archObjIn}) {
    const nodes = (archObjIn.nodes ?? []).map((node) => ({
        id: node.id,
        position: { x: node.position_x, y: node.position_y },
        data: { label: node.label },
    }));

    const edges = (archObjIn.edges ?? []).map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.destination,
        // data: { label: edge.label } // optional
    }));

    return (
    <div className="mapDisplay">
      <ReactFlow nodes={nodes} edges={edges} fitView>>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}