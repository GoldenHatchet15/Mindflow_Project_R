// src/components/Authentication/Register.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// You can reuse the same styled components from Login.js
// Just import them if you move them to a separate file, or copy them here

const AuthContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: ${props => props.theme.fontmd};
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.text};
  font-size: ${props => props.theme.fontmd};
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.text};
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.body};
  border: none;
  border-radius: 5px;
  font-size: ${props => props.theme.fontmd};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ToggleText = styled.p`
  text-align: center;
  font-size: ${props => props.theme.fontmd};
  margin-top: 1rem;
  
  span {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const Register = ({ toggleForm, onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Use the onRegister prop function if provided
    if (onRegister) {
      onRegister(formData);
    } else {
      console.log("Registration data:", formData);
    }
  };

  return (
    <AuthContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="name">Name</Label>
          <Input 
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input 
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>
        <Button type="submit">Sign Up</Button>
      </Form>
      <ToggleText>
        Already have an account? <span onClick={toggleForm}>Login</span>
      </ToggleText>
    </AuthContainer>
  );
};

export default Register;
