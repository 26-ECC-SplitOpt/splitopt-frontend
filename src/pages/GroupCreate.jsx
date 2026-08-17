import { useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../components/Modal';
import { colors } from '../styles/colors';
import { apiFetch } from '../utils/api';
import {
  Field,
  Label,
  Input,
  SubmitButton,
  ErrorText,
} from '../styles/authForm';

const ModalTitle = styled.h2`
  margin: 0 0 32px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${colors.body};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

function GroupCreate({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch(`/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '모임 생성에 실패했습니다.');
        return;
      }

      onCreated();
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>새 모임 생성하기</ModalTitle>

      <Form onSubmit={handleSubmit}>
        <Field>
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

        {error && <ErrorText style={{ margin: 0 }}>{error}</ErrorText>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '생성 중...' : '모임 생성'}
        </SubmitButton>
      </Form>
    </Modal>
  );
}

export default GroupCreate;
