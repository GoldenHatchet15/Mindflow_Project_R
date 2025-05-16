// src/sections/Authentication.js
import React, { useState, useContext } from "react";
import styled from "styled-components";
import Login from "../components/Authentication/Login";
import Register from "../components/Authentication/Register";
import { AuthContext } from "../context/AuthContext";
import { useLocomotiveScroll } from "react-locomotive-scroll";

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  position: relative;
`;

const Container = styled.div`
  width: 80vw;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;

  @media (max-width: 48em) {
    width: 90vw;
  }
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.fontxxxl};
  font-family: "Kaushan Script";
  font-weight: 300;
  margin-bottom: 4rem;
  text-align: center;

  @media (max-width: 64em) {
    font-size: ${(props) => props.theme.fontxxl};
  }
  @media (max-width: 48em) {
    font-size: ${(props) => props.theme.fontxl};
  }
`;

// In src/sections/Authentication.js
const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useContext(AuthContext);
  const { scroll } = useLocomotiveScroll();
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  const handleLogin = (userData) => {
    // Use the context login function
    const success = login(userData);
    if (success && scroll) {
      // If login successful, scroll to profile section
      const profileSection = document.querySelector("#profile");
      if (profileSection) {
        scroll.scrollTo(profileSection, {
          offset: "-100",
          duration: "2000",
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      }
    }
  };
  
  const handleRegister = (userData) => {
    // Use the context register function
    const success = register(userData);
    if (success && scroll) {
      // If registration successful, scroll to profile section
      const profileSection = document.querySelector("#profile");
      if (profileSection) {
        scroll.scrollTo(profileSection, {
          offset: "-100",
          duration: "2000",
          easing: [0.25, 0.0, 0.35, 1.0],
        });
      }
    }
  };
  
  return (
    <Section id="auth">
      <Container>
        <Title data-scroll data-scroll-speed="-2">
          {isLogin ? "Welcome Back" : "Join MindFlow"}
        </Title>
        
        {isLogin ? (
          <Login 
            toggleForm={toggleForm}
            onLogin={handleLogin}
          />
        ) : (
          <Register 
            toggleForm={toggleForm}
            onRegister={handleRegister}
          />
        )}
      </Container>
    </Section>
  );
};
