import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';
import { apiFetch } from '../utils/api';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background-color: ${colors.white};
  font-family: 'Inter', sans-serif;
`;

const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 342px;
  margin: 0 auto;
  padding: 47px 24px 40px;
  box-sizing: border-box;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  min-height: 265px;
  padding: 30px 20px;
  background-color: #fbfbfb;
  border: 1px solid rgba(69, 75, 96, 0.7);
  border-radius: 31px;
  box-sizing: border-box;
`;

const CardTitle = styled.p`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${colors.body};
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputRow = styled.form`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const CodeInput = styled.input`
  width: 162px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid
    ${(props) => (props.hasError ? colors.error : colors.accent)};
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.7);
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.accent};
  }

  &:focus {
    border-color: ${(props) => (props.hasError ? colors.error : colors.body)};
  }
`;

const JoinButton = styled.button`
  flex-shrink: 0;
  width: 66px;
  height: 34px;
  background-color: ${colors.body};
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: ${colors.error};
`;

function InviteJoin() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      setError('초대 코드를 입력해주세요.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: code.trim() }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '잘못된 초대 코드입니다.');
        return;
      }

      navigate(`/groups/${result.data.groupId}`);
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Header />

      <Content>
        <TitleBar
          title="초대 코드 입력"
          onBack={() => navigate(-1)}
          style={{ marginBottom: '52px' }}
        />

        <Card>
          <CardTitle>초대 코드를 입력하세요</CardTitle>

          <FieldWrap>
            <InputRow onSubmit={handleSubmit}>
              <CodeInput
                value={code}
                onChange={(event) => setCode(event.target.value)}
                hasError={Boolean(error)}
              />
              <JoinButton type="submit" disabled={isSubmitting}>
                입장
              </JoinButton>
            </InputRow>
            {error && <ErrorText>{error}</ErrorText>}
          </FieldWrap>
        </Card>
      </Content>
    </Page>
  );
}

export default InviteJoin;
