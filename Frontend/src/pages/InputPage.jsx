import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserId, setResultData } from '../slices/workflowSlice';

const InputPage = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('form');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    pincode: '',
  });
  const [jsonInput, setJsonInput] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null);
  const dispatch = useDispatch();

  const workflowId = useSelector((state) => state.workflow.data);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData, jsonInput, inputType]);

  const validateForm = () => {
    if (inputType === 'form') {
      const isPincodeValid = /^\d{6}$/.test(formData.pincode);
      setIsFormValid(
        formData.name.trim() !== '' &&
        formData.gender !== '' &&
        formData.dob !== '' &&
        isPincodeValid
      );
    } else {
      try {
        const parsedData = JSON.parse(jsonInput);
        const isPincodeValid = /^\d{6}$/.test(parsedData.pincode);
        setIsFormValid(
          parsedData.name && parsedData.name.trim() !== '' &&
          (parsedData.gender === 'M' || parsedData.gender === 'F') &&
          parsedData.dob && parsedData.dob.trim() !== '' &&
          isPincodeValid
        );
      } catch (error) {
        setIsFormValid(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };

  const fetchWorkflows = async () => {
    try {
      const response = await axios.get('http://localhost:8080/workflow');
      setWorkflows(response.data);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      let response;
      const currentWorkflowId = selectedWorkflowId || workflowId;

      if (!currentWorkflowId) {
        alert('Please select a workflow.');
        return;
      }

      if (inputType === 'json') {
        const parsedData = JSON.parse(jsonInput);
        response = await axios.post(`http://localhost:8080/${currentWorkflowId}/user`, parsedData);
      } else {
        response = await axios.post(`http://localhost:8080/${currentWorkflowId}/user`, formData);
      }

      dispatch(setUserId(response.data));
      const response2 = await axios.get(`http://localhost:8080/${currentWorkflowId}/user/${response.data}`);
      dispatch(setResultData(response2.data));

      navigate('/flow');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);

      if (error.response) {
        if (error.response.status === 302) {
          console.log('Redirecting to:', error.response.headers.location);
        }
        if (error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert(`Request failed with status code ${error.response.status}`);
        }
      } else {
        alert('Invalid JSON input');
      }
    }
  };

  const handleSelect = (workflowId) => {
    setSelectedWorkflowId(workflowId);
  };

  const handleEdit = (workflowId) => {
    console.log('Editing workflow ID:', workflowId);
    //logic 
  };

  const handleDelete = async (workflowId) => {
    try {
      await axios.delete(`http://localhost:8080/workflow/${workflowId}`);
      fetchWorkflows();
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  return (
    <Container>
      <br />
      <h1>Input Data</h1>
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formInputType">
          <Form.Label column sm="2">Input Type</Form.Label>
          <Col sm="10">
            <Form.Control as="select" value={inputType} onChange={(e) => setInputType(e.target.value)}>
              <option value="form">Form</option>
              <option value="json">JSON</option>
            </Form.Control>
          </Col>
        </Form.Group>

        {inputType === 'form' ? (
          <>
            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm="2">Name</Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formGender">
              <Form.Label column sm="2">Gender</Form.Label>
              <Col sm="10">
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formDOB">
              <Form.Label column sm="2">DOB</Form.Label>
              <Col sm="10">
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPincode">
              <Form.Label column sm="2">Pin Code</Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  name="pincode"
                  placeholder="6 digit Pin Code"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  pattern="\d{6}"
                  maxLength="6"
                />
              </Col>
            </Form.Group>
          </>
        ) : (
          <Form.Group as={Row} className="mb-3" controlId="formJsonInput">
            <Form.Label column sm="2">JSON Input</Form.Label>
            <Col sm="10">
              <Form.Control
                style={{ height: "70vh" }}
                as="textarea"
                placeholder={`{
  "name": "abc",
  "gender": "M or F",
  "dob": "YYYY-MM-DD",
  "pincode": "303401"
}`}
                value={jsonInput}
                onChange={handleJsonChange}
                required
              />
            </Col>
          </Form.Group>
        )}

        <Button variant="primary" onClick={handleSubmit} disabled={!isFormValid}>
          Submit
        </Button>
      </Form>

      <h2 className="mt-4">Workflows</h2>
      <Row>
        {workflows.map((workflow) => (
          <Col key={workflow.id} sm="4" className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{workflow.name}</Card.Title>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" className="me-2" onClick={() => handleSelect(workflow.id)}>Select</Button>
                  <Button variant="secondary" className="me-2" onClick={() => handleEdit(workflow.id)}>Edit</Button>
                  <Button variant="danger" onClick={() => handleDelete(workflow.id)}>Delete</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default InputPage;
