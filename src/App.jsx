import React from "react";
import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  color: #e0e0e0;
  padding: 2rem;
`;

const Logo = styled.h1`
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeUp} 0.8s ease-out both;
`;

const Tagline = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #a0a0b8;
  margin: 0 0 2.5rem;
  text-align: center;
  max-width: 480px;
  line-height: 1.6;
  animation: ${fadeUp} 0.8s ease-out 0.2s both;
`;

const CTAButton = styled.a`
  display: inline-block;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${fadeUp} 0.8s ease-out 0.4s both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
  }
`;

function App() {
  return (
    <Page>
      <Logo>Automatic Software</Logo>
      <Tagline>
        Building the future of software, one automation at a time.
      </Tagline>
      <CTAButton href="#contact">Get in Touch</CTAButton>
    </Page>
  );
}

export default App;
