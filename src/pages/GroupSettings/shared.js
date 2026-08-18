import styled from '@emotion/styled';
import { Input } from '../../styles/authForm';
import { colors } from '../../styles/colors';

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  margin-top: 37px;
`;

export const SettingsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 24px;
  border: 1px solid rgba(173, 173, 173, 0.4);
  border-radius: 16px;
  box-sizing: border-box;
`;

export const CardLabel = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${colors.label};
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

export const EditableInput = styled(Input)`
  height: 34px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
`;
