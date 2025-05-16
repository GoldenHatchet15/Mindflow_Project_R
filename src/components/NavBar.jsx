// src/components/Navbar.jsx
import React, { useState, useContext } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion } from "framer-motion";
import { useLocomotiveScroll } from "react-locomotive-scroll";
import { AuthContext } from "./context/AuthContext";

// Define a theme
const theme = {
  body: "#FFFFFF",
  text: "#202020",
  bodyRgba: "255, 255, 255",
  textRgba: "32, 32, 32",
  fontmd: "1rem",
  navHeight: "5rem"
};

const NavContainer = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6;
  background-color: ${props => props.theme.body};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoImg = styled.img`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
  padding: 0.2rem;
  background: white;
  border: 2px solid rgba(139, 92, 246, 0.2);
`;

const LogoText = styled.span`
  font-weight: 600;
  font-size: 1.25rem;
  color: ${props => props.theme.text};
`;

const MenuItems = styled.ul`
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled(motion.li)`
  text-transform: uppercase;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.outline {
    background: transparent;
    border: 1px solid #E2E8F0;
    color: ${props => props.theme.text};
    
    &:hover {
      background: #F7FAFC;
    }
  }
  
  &.primary {
    background: #8B5CF6;
    border: none;
    color: white;
    
    &:hover {
      background: #7C3AED;
    }
  }
`;

const NavBar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  
  const { scroll } = useLocomotiveScroll();
  
  const handleScroll = (id) => {
    let elem = document.querySelector(id);
    if (elem) {
      scroll.scrollTo(elem, {
        offset: "-100",
        duration: "2000",
        easing: [0.25, 0.0, 0.35, 1.0],
      });
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <NavContainer>
        <NavContent>
          <Logo>
            <LogoImg 
              src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png" 
              alt="Mindflow Logo" 
            />
            <LogoText>Mindflow</LogoText>
          </Logo>
          
          <MenuItems>
            <MenuItem
              onClick={() => handleScroll("#features")}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Features
            </MenuItem>
            <MenuItem
              onClick={() => handleScroll("#testimonials")}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Testimonials
            </MenuItem>
            <MenuItem
              onClick={() => handleScroll("#about")}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              About
            </MenuItem>
          </MenuItems>
          
          <ButtonContainer>
            {isLoggedIn ? (
              <>
                <Button 
                  className="outline"
                  onClick={() => window.location.href = '/app'}
                >
                  Dashboard
                </Button>
                <Button 
                  className="outline"
                  onClick={() => {
                    // Call logout from context
                    logout();
                    window.location.href = '/';
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="outline"
                  onClick={() => window.location.href = '/auth'}
                >
                  Log In
                </Button>
                <Button 
                  className="primary"
                  onClick={() => window.location.href = '/auth?signup=true'}
                >
                  Get Started
                </Button>
              </>
            )}
          </ButtonContainer>
        </NavContent>
      </NavContainer>
    </ThemeProvider>
  );
};

export default NavBar;