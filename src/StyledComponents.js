import styled, { keyframes, css } from "styled-components";

export const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #0f0f1a;
`;

export const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
`;

export const HUD = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  user-select: none;
`;

export const Title = styled.h1`
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin: 0 0 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Hint = styled.p`
  font-size: 0.75rem;
  color: rgba(160, 160, 184, 0.6);
  margin: 0 0 4px;
`;

export const Count = styled.p`
  font-size: 0.7rem;
  color: rgba(102, 126, 234, 0.5);
  margin: 0;
  font-variant-numeric: tabular-nums;
`;

export const PaletteLink = styled.span`
  cursor: pointer;
  border-bottom: 1px dotted rgba(102, 126, 234, 0.35);
  transition: color 0.2s, border-color 0.2s;
  &:hover {
    color: rgba(240, 147, 251, 0.8);
    border-color: rgba(240, 147, 251, 0.5);
  }
  &:active {
    color: rgba(240, 147, 251, 1);
  }
`;

export const PaletteStrip = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  pointer-events: auto;
`;

export const PaletteOption = styled.button`
  display: flex;
  gap: 2px;
  align-items: center;
  padding: 3px 5px;
  border: 1.5px solid ${(p) => (p.$active ? "rgba(240, 147, 251, 0.6)" : "rgba(255, 255, 255, 0.1)")};
  border-radius: 10px;
  background: ${(p) => (p.$active ? "rgba(240, 147, 251, 0.1)" : "transparent")};
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  &:hover {
    border-color: rgba(240, 147, 251, 0.5);
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
`;

export const PaletteDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.$color};
`;

export const ModeIndicators = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 8px;
`;

export const ModePill = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: ${(p) => p.$color};
  border: 1px solid ${(p) => p.$color}44;
  background: ${(p) => p.$color}18;
  animation: pillIn 0.2s ease;

  @keyframes pillIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const streakPop = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  30% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

export const StreakCounter = styled.div`
  font-size: ${(p) => Math.min(1.4 + p.$streak * 0.15, 3.2)}rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  margin-top: 8px;
  background: linear-gradient(
    135deg,
    ${(p) => p.$streak >= 8 ? "#fa709a" : p.$streak >= 5 ? "#f093fb" : "#4facfe"},
    ${(p) => p.$streak >= 8 ? "#feb47b" : p.$streak >= 5 ? "#667eea" : "#43e97b"}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${streakPop} 0.25s ease-out;
  text-shadow: none;
  filter: drop-shadow(0 0 ${(p) => Math.min(4 + p.$streak * 2, 20)}px ${(p) => p.$streak >= 8 ? "rgba(250, 112, 154, 0.6)" : p.$streak >= 5 ? "rgba(240, 147, 251, 0.5)" : "rgba(79, 172, 254, 0.4)"});
`;

const nextComboFade = keyframes`
  0% { opacity: 0; transform: translateY(-4px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export const NextCombo = styled.div`
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: rgba(160, 160, 184, 0.45);
  margin-top: 2px;
  animation: ${nextComboFade} 0.2s ease-out;

  &::before {
    content: "next → ";
    opacity: 0.6;
  }
`;

const newBestPulse = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  20% { transform: scale(1.15); opacity: 1; }
  70% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

export const BestStreak = styled.div`
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: ${(p) => p.$isNew ? "rgba(255, 215, 100, 0.9)" : "rgba(140, 140, 160, 0.35)"};
  margin-top: 2px;
  transition: color 0.3s ease;
  ${(p) => p.$isNew && css`animation: ${newBestPulse} 2.5s ease-out forwards;`}
`;

const bpmPulse = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
`;

export const BPMDisplay = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(167, 139, 250, 0.8);
  margin-top: 4px;
  animation: ${bpmPulse} ${(p) => p.$interval || 500}ms ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(167, 139, 250, 0.4));
`;

export const ButtonGroup = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;

  @media (max-width: 600px) {
    bottom: 16px;
    right: 50%;
    transform: translateX(50%);
    align-items: center;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 600px) {
    gap: 8px;
    justify-content: center;
    max-width: calc(100vw - 32px);
  }
`;

export const ActionButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.$active ? "rgba(67, 233, 123, 0.6)" : p.$highlight ? "rgba(251, 191, 36, 0.4)" : p.$danger ? "rgba(250, 112, 154, 0.3)" : "rgba(102, 126, 234, 0.3)"};
  background: ${(p) => p.$active ? "rgba(67, 233, 123, 0.15)" : p.$highlight ? "rgba(251, 191, 36, 0.1)" : "rgba(15, 15, 26, 0.7)"};
  color: ${(p) => p.$active ? "#43e97b" : p.$highlight ? "rgba(251, 191, 36, 0.85)" : p.$danger ? "rgba(250, 112, 154, 0.7)" : "rgba(102, 126, 234, 0.7)"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => p.$danger ? "rgba(250, 112, 154, 0.15)" : "rgba(102, 126, 234, 0.15)"};
    color: ${(p) => p.$danger ? "#fa709a" : "#667eea"};
    border-color: ${(p) => p.$danger ? "rgba(250, 112, 154, 0.6)" : "rgba(102, 126, 234, 0.6)"};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    width: 44px;
    height: 44px;
  }
`;

export const HelpButton = styled.button`
  position: fixed;
  top: 24px;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(15, 15, 26, 0.7);
  color: rgba(102, 126, 234, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.15);
    color: #667eea;
    border-color: rgba(102, 126, 234, 0.6);
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
  }
`;

export const MuteButton = styled.button`
  position: fixed;
  top: 24px;
  right: 68px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${(p) => p.$muted ? "rgba(250, 112, 154, 0.4)" : "rgba(102, 126, 234, 0.3)"};
  background: ${(p) => p.$muted ? "rgba(250, 112, 154, 0.1)" : "rgba(15, 15, 26, 0.7)"};
  color: ${(p) => p.$muted ? "rgba(250, 112, 154, 0.8)" : "rgba(102, 126, 234, 0.7)"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => p.$muted ? "rgba(250, 112, 154, 0.2)" : "rgba(102, 126, 234, 0.15)"};
    color: ${(p) => p.$muted ? "#fa709a" : "#667eea"};
    transform: scale(1.1);
  }

  @media (max-width: 600px) {
    top: 16px;
    right: 56px;
    width: 32px;
    height: 32px;
  }
`;

export const SaveFlash = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  pointer-events: none;
  z-index: 200;
  animation: flashFade 0.4s ease-out forwards;

  @keyframes flashFade {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

export const HelpOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.15s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const HelpPanel = styled.div`
  background: rgba(20, 20, 36, 0.95);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  padding: 28px 32px;
  max-width: 340px;
  width: calc(100vw - 48px);
  backdrop-filter: blur(12px);
`;

export const HelpTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

export const ShortcutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  hr {
    border: none;
    border-top: 1px solid rgba(102, 126, 234, 0.15);
    margin: 4px 0;
  }
`;

export const Shortcut = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(160, 160, 184, 0.8);
`;

export const Key = styled.span`
  display: inline-block;
  min-width: 56px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(102, 126, 234, 0.25);
  background: rgba(102, 126, 234, 0.08);
  color: rgba(102, 126, 234, 0.9);
  font-size: 0.75rem;
  font-family: inherit;
  text-align: center;
`;

export const ModeStrip = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  z-index: 10;

  @media (max-width: 600px) {
    bottom: 76px;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
  }
`;

export const ModeToggle = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${(p) => p.$active ? `${p.$color}99` : "rgba(102, 126, 234, 0.2)"};
  background: ${(p) => p.$active ? `${p.$color}22` : "rgba(15, 15, 26, 0.7)"};
  color: ${(p) => p.$active ? p.$color : "rgba(160, 160, 184, 0.5)"};
  backdrop-filter: blur(8px);

  &:hover {
    border-color: ${(p) => p.$color}88;
    color: ${(p) => p.$color};
    background: ${(p) => `${p.$color}15`};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 600px) {
    padding: 5px 12px;
    font-size: 0.65rem;
  }
`;


export const StripDivider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(102, 126, 234, 0.2);
  align-self: center;
`;

export const HelpClose = styled.button`
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.1);
  color: rgba(102, 126, 234, 0.8);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    color: #667eea;
  }
`;
