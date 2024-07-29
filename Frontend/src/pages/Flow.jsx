import React, { useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, MiniMap, Controls, Background } from 'react-flow-renderer';

const FlowPage = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Fetch the workflow data from the backend
    fetch('/api/workflow') // Adjust the endpoint as needed
      .then(response => response.json())
      .then(data => {
        // Transform the data into elements for React Flow
        const transformedElements = data.map((item, index) => ({
          id: `node-${index}`,
          data: { label: item.label },
          position: { x: Math.random() * 400, y: Math.random() * 400 },
        }));
        setElements(transformedElements);
      });
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow elements={elements}>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowPage;
