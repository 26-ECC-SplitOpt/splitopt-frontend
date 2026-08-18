import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Modal from '../components/Modal';
import { colors } from '../styles/colors';
import { apiFetch } from '../utils/api';
import { Field, Label, Input, SubmitButton, ErrorText } from '../styles/authForm';

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

const RadioRow = styled.div`
  display: flex;
  gap: 10px;
`;

const RadioOption = styled.button`
  flex: 1;
  height: 42px;
  border: 1px solid ${(props) => (props.selected ? colors.body : colors.accent)};
  border-radius: 10px;
  background-color: ${(props) =>
    props.selected ? colors.body : colors.white};
  color: ${(props) => (props.selected ? colors.white : colors.body)};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const AmountWrap = styled.div`
  position: relative;
`;

const AmountUnit = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(28, 30, 34, 0.5);
`;

function BudgetForm({ onClose, onSaved, budget }) {
  const { groupId } = useParams();
  const isEditing = Boolean(budget?.budgetType);

  const [budgetType, setBudgetType] = useState(budget?.budgetType ?? 'TOTAL');
  const [amount, setAmount] = useState(
    isEditing
      ? String(
          budget.budgetType === 'PER_PERSON'
            ? budget.budgetPerPerson
            : budget.totalBudget,
        )
      : '',
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setError('금액을 올바르게 입력해주세요.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch(`/api/groups/${groupId}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetType, amount: Number(amount) }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '예산 설정에 실패했습니다.');
        return;
      }

      onSaved();
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>{isEditing ? '예산 수정하기' : '예산 설정하기'}</ModalTitle>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label>예산 유형</Label>
          <RadioRow>
            <RadioOption
              type="button"
              selected={budgetType === 'TOTAL'}
              onClick={() => setBudgetType('TOTAL')}
            >
              모임 전체
            </RadioOption>
            <RadioOption
              type="button"
              selected={budgetType === 'PER_PERSON'}
              onClick={() => setBudgetType('PER_PERSON')}
            >
              1인당
            </RadioOption>
          </RadioRow>
        </Field>

        <Field>
          <Label htmlFor="budget-amount">
            {budgetType === 'PER_PERSON' ? '1인당 예산' : '전체 예산'}
          </Label>
          <AmountWrap>
            <Input
              id="budget-amount"
              type="number"
              min="0"
              placeholder="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              style={{ paddingRight: '40px' }}
              required
            />
            <AmountUnit>원</AmountUnit>
          </AmountWrap>
        </Field>

        {error && <ErrorText style={{ margin: 0 }}>{error}</ErrorText>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : isEditing ? '수정' : '설정'}
        </SubmitButton>
      </Form>
    </Modal>
  );
}

export default BudgetForm;
