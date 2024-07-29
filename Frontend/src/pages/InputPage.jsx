import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();

  const workflowId = useSelector((state) => state.workflow.data);

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

  const handleSubmit = async () => {
    try {
      let response;
      if (inputType === 'json') {
        const parsedData = JSON.parse(jsonInput);
        console.log('Parsed JSON data:', parsedData);
        response = await axios.post(`http://localhost:8080/${workflowId}/user`, parsedData);
      } else {
        console.log('Form data:', formData);
        response = await axios.post(`http://localhost:8080/${workflowId}/user`, formData);
      }
  
      console.log('API Response:', response.data);
      dispatch(setUserId(response.data));
  
      const response2 = await axios.get(`http://localhost:8080/${workflowId}/user/${response.data}`);
      console.log('Fetched user data:', response2.data);
      dispatch(setResultData(response2.data));

      navigate('/flow');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  
      if (error.response) {
        if (error.response.status === 302) {
          console.log('Redirecting to:', error.response.headers.location);
          // Handle the redirection logic if needed
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
    </Container>
  );
};

export default InputPage;
