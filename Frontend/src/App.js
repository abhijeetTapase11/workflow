import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkflowPage from './pages/WorkflowPage';
import InputPage from './pages/InputPage';
import FlowChart from './pages/FlowChart';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkflowPage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/flow" element={<FlowChart />} />
      </Routes>
    </Router>
  );
};

export default App;
