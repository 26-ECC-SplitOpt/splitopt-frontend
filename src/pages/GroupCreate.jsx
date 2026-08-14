import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';
import { apiFetch } from '../utils/api';
import {
  Field,
  Label,
  Input,
  SubmitButton,
  ErrorText,
} from '../styles/authForm';

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
  flex: 1;
  width: 100%;
  max-width: 342px;
  margin: 0 auto;
  padding: 47px 24px 26px;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

function GroupCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '모임 생성에 실패했습니다.');
        return;
      }

      navigate('/groups');
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
          title="새 모임 생성하기"
          onBack={() => navigate(-1)}
          style={{ marginBottom: '52px' }}
        />

        <Form onSubmit={handleSubmit}>
          <Field style={{ marginBottom: '46px' }}>
            <Label htmlFor="name">모임 이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="모임 이름을 입력하세요"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="description">메모(선택)</Label>
            <Input
              id="description"
              type="text"
              placeholder="메모를 입력하세요"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>

          {error && (
            <ErrorText style={{ margin: '16px 0 0' }}>{error}</ErrorText>
          )}

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: 'auto' }}
          >
            {isSubmitting ? '생성 중...' : '모임 생성'}
          </SubmitButton>
        </Form>
      </Content>
    </Page>
  );
}

export default GroupCreate;
