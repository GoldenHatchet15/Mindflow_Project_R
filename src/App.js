// src/App.js
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import { dark } from "./styles/Themes";
import { LocomotiveScrollProvider } from "react-locomotive-scroll";
import { useRef, useState, useContext } from "react";
import 'locomotive-scroll/dist/locomotive-scroll.css'

import Home from "./sections/Home";
import { AnimatePresence } from "framer-motion";
import About from "./sections/About";
import ScrollTriggerProxy from './components/ScrollTriggerProxy';
import Footer from './sections/Footer';
import Loader from "./components/Loader";
import StressInputForm from "./components/StressInputForm";
import BreathingExercises from "./sections/BreathingExercises";
import Authentication from "./sections/Authentication";
import UserProfile from "./sections/UserProfile";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ScrollBehavior from './components/ScrollBehavior';

// Create a content component that uses the auth context
function AppContent() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  // Set up a timeout to show the loader for 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, []);

  return (
    <>
      <GlobalStyles />
      <ThemeProvider theme={dark}>
        <LocomotiveScrollProvider
          options={{
            smooth: true,
            lerp: 0.1, // Smoother scrolling
            multiplier: 0.5, // Slower scroll speed
            smartphone:{
              smooth: true,
              lerp: 0.1,
            },
            tablet:{
              smooth: true,
              lerp: 0.1,
            }
          }}
          watch={[isLoggedIn]} // Watch auth state for content changes
          containerRef={containerRef}
        >
          <AnimatePresence>
            {loaded ? null : <Loader />}
          </AnimatePresence>
          <ScrollTriggerProxy />
          <ScrollBehavior />
          <AnimatePresence>
            <main className='App' data-scroll-container ref={containerRef}>
              <Home />
              <About />
              {isLoggedIn ? <UserProfile /> : <Authentication />}
              <StressInputForm />
              <BreathingExercises />
              <Footer />
            </main>
          </AnimatePresence>
        </LocomotiveScrollProvider>
      </ThemeProvider>
    </>
  );
}

// Wrap the content with the auth provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
