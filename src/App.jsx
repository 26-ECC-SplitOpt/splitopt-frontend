import styled from '@emotion/styled';
import { useState } from 'react';
import './App.css';

const StyledButton = styled.button`
  background-color: royalblue;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

function App() {
  return (
    <main>
      <h1>test</h1>
      <StyledButton type="button">정산 시작</StyledButton>
    </main>
  );
}

export default App;
