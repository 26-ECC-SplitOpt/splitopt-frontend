import styled from '@emotion/styled';
import { colors } from './colors';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.label};
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  border: 1px solid
    ${(props) => (props.hasError ? colors.error : colors.accent)};
  border-radius: 10px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  color: ${colors.dark};
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.accent};
  }

  &:focus {
    border-color: ${(props) => (props.hasError ? colors.error : colors.body)};
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 45px;
  background-color: ${colors.body};
  color: ${colors.white};
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: ${colors.error};
`;

export const FieldError = styled.p`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: ${colors.error};
`;
