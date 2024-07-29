import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Container, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';



// const data = {
//   "id": {
//       "timestamp": 1722181191,
//       "date": "2024-07-28T15:39:51.000+00:00"
//   },
//   "name": "Sam",
//   "tasks": [
//       {
//           "id": {
//               "timestamp": 1722181191,
//               "date": "2024-07-28T15:39:51.000+00:00"
//           },
//           "api_check": "DOB check",
//           "condition": "30",
//           "action": "Loan approved",
//           "status": "failure"
//       },
//       {
//           "id": {
//               "timestamp": 1722181191,
//               "date": "2024-07-28T15:39:51.000+00:00"
//           },
//           "api_check": "Gender check",
//           "condition": "M",
//           "action": "Pincode check",
//           "status": "success"
//       },
//       {
//           "id": {
//               "timestamp": 1722181191,
//               "date": "2024-07-28T15:39:51.000+00:00"
//           },
//           "api_check": "Pincode check",
//           "condition": "12",
//           "action": "loan_approval_required",
//           "status": "failure"
//       }
//   ]
// };

export default function FlowChart() {
  const data = useSelector((state) => state.workflow.resultData);
  console.log("resultData1", data);

  const color1 = "#6ede87";
  const color2 = "#D6D5E6";

  const initialNodes = [
    { id: "1", type: "input", data: { label: data.tasks[0].api_check }, position: { x: 250, y: 0 }, style: { backgroundColor: color1 } },
    { id: "2", data: { label: "loan approved" }, position: { x: 100, y: 100 }, style: { backgroundColor: data.tasks[0].status === "failure" ? color2 : color1 } },
    { id: "3", data: { label: data.tasks[1].api_check }, position: { x: 400, y: 100 }, style: { backgroundColor: data.tasks[0].status !== "failure" ? color1 : color2 } },
    { id: "4", data: { label: "loan approved" }, position: { x: 300, y: 200 }, style: { backgroundColor: !(data.tasks[1].status === "failure") && data.tasks[0].status === "failure" ? color1 : color2 } },
    { id: "5", data: { label: data.tasks[2].api_check }, position: { x: 500, y: 200 }, style: { backgroundColor: data.tasks[1].status === "failure" && data.tasks[0].status === "failure" ? color1 : color2 } },
    { id: "6", data: { label: "loan approved" }, position: { x: 400, y: 300 }, style: { backgroundColor: !(data.tasks[2].status === "failure") && data.tasks[1].status === "failure" && data.tasks[0].status === "failure" ? color1 : color2 } },
    { id: "7", data: { label: "loan approval required" }, position: { x: 600, y: 300 }, style: { backgroundColor: data.tasks[2].status === "failure" && data.tasks[1].status === "failure" && data.tasks[0].status === "failure" ? color1 : color2 } }
  ];

  const initialEdges = [
    { id: "e1-2", source: "1", target: "2", label: `age < ${data.tasks[0].condition}` },
    { id: "e1-3", source: "1", target: "3", label: `age > ${data.tasks[0].condition}` },
    { id: "e3-4", source: "3", target: "4", label: "Female" },
    { id: "e3-5", source: "3", target: "5", label: "Male" },
    { id: "e5-6", source: "5", target: "6", label: `pincode != ${data.tasks[2].condition}xxxx` },
    { id: "e5-7", source: "5", target: "7", label: `pincode = ${data.tasks[2].condition}xxxx` }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  
  return (
    <Container fluid className="p-3">
      <h2 className="text-center">Workflow Name : {data.name}</h2>
      <Card className="shadow-sm">
        <Card.Body>
          <div style={{ width: '100%', height: '85vh' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}