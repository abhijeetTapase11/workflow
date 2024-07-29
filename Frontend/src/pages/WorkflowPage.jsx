import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setWorkflowData } from '../slices/workflowSlice'; // Adjust the import path as needed

const WorkflowPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [workflowName, setWorkflowName] = useState("");
  const [tasks, setTasks] = useState([]);
  const availableTasks = ['DOB check', 'Gender check', 'Pincode check'];
  const [selectedTask, setSelectedTask] = useState('');
  const [condition, setCondition] = useState('');

  const taskPlaceholders = {
    'DOB check': 'Enter age (e.g. 20)',
    'Gender check': 'Select gender',
    'Pincode check': 'Enter first two digits of pin code (e.g. 12)',
  };

  const validateCondition = (task, condition) => {
    switch (task) {
      case 'DOB check':
        return /^\d+$/.test(condition);
      case 'Gender check':
        return /^(M|F)$/.test(condition);
      case 'Pincode check':
        return /^\d{1,6}$/.test(condition);
      default:
        return false;
    }
  };

  const handleAddTask = () => {
    if (selectedTask && condition && validateCondition(selectedTask, condition)) {
      setTasks([...tasks, { api_check : selectedTask, condition }]);
      setSelectedTask('');
      setCondition('');
    } else {
      alert('Invalid condition format');
    }
  };

  const handleSubmit = async () => {
    if (tasks.length === 3) {
      const data = {
        name: workflowName,
        tasks,
      };
      console.log('Workflow created:', data);
      const response = await axios.post('http://localhost:8080/workflow', data);
      // console.log(response.data);

      dispatch(setWorkflowData(response.data)); // Save the response data in Redux store

      navigate('/input');
    } else {
      alert('Please complete all tasks before submitting');
    }
  };

  return (
    <Container>
      <br />
      <h1>Create Workflow</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formWorkflowName">
          <Form.Label column sm="2">Workflow name</Form.Label>
          <Col sm="10">
            <Form.Control type="text" placeholder="Enter workflow name" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formTask">
          <Form.Label column sm="2">Task</Form.Label>
          <Col sm="10">
            <Form.Control as="select" value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
              <option value="">Select Task</option>
              {availableTasks.map(task => (
                <option key={task} value={task}>{task}</option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formCondition">
          <Form.Label column sm="2">Condition</Form.Label>
          <Col sm="10">
            {selectedTask === 'Gender check' ? (
              <Form.Control
                as="select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </Form.Control>
            ) : (
              <Form.Control
                type={selectedTask === 'Pincode check' ? 'number' : 'text'}
                placeholder={selectedTask ? taskPlaceholders[selectedTask] : 'Enter condition'}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                maxLength={selectedTask === 'Pincode check' ? 6 : undefined}
              />
            )}
          </Col>
        </Form.Group>

        <Button variant="primary" onClick={handleAddTask} disabled={!selectedTask || !condition}>
          Add Task
        </Button>
      </Form>

      <h2 className="mt-4">Selected Tasks</h2>
      {tasks.length > 0 ? (
        <ListGroup>
          {tasks.map((task, index) => (
            <ListGroup.Item key={index}>{task.api_check} : {task.condition}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info">No tasks added yet</Alert>
      )}

      <Button variant="success" onClick={handleSubmit} disabled={tasks.length !== 3} className="mt-4">
        Submit
      </Button>
    </Container>
  );
};

export default WorkflowPage;
