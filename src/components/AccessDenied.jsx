import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { colors } from '../styles/colors';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  text-align: center;
  font-family: 'Inter', sans-serif;
`;

const Message = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
`;

const BackButton = styled.button`
  height: 42px;
  padding: 0 20px;
  border: none;
  border-radius: 10px;
  background-color: ${colors.body};
  color: ${colors.white};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

function AccessDenied({
  message = '이 페이지에 접근할 권한이 없어요.',
  to = '/groups',
  label = '모임 목록으로 이동',
}) {
  const navigate = useNavigate();

  return (
    <Wrap>
      <Message>{message}</Message>
      <BackButton type="button" onClick={() => navigate(to)}>
        {label}
      </BackButton>
    </Wrap>
  );
}

export default AccessDenied;
