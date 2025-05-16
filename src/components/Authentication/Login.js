// src/components/Authentication/Login.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

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

const Login = ({ toggleForm, onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use the onLogin prop function if provided
    if (onLogin) {
      onLogin(formData);
    } else {
      console.log("Login data:", formData);
    }
  };

  return (
    <AuthContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Login</h2>
      <Form onSubmit={handleSubmit}>
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
        <Button type="submit">Login</Button>
      </Form>
      <ToggleText>
        Don't have an account? <span onClick={toggleForm}>Sign Up</span>
      </ToggleText>
    </AuthContainer>
  );
};

export default Login;
