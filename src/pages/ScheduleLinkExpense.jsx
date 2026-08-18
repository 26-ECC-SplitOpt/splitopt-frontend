import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { getCategoryIcon } from '../utils/categoryIcon';
import { toDisplayCategory } from '../utils/category';
import { colors } from '../styles/colors';
import { apiFetch } from '../utils/api';

const ModalTitle = styled.h2`
  margin: 0 0 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: ${colors.body};
`;

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
`;

const ExpenseRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${colors.border};
  border-radius: 14px;
  background-color: ${colors.white};
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExpenseIconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ExpenseInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
`;

const ExpenseTitle = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
`;

const ExpensePayer = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
`;

const ExpenseAmount = styled.span`
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
`;

const ErrorText = styled.p`
  margin: 16px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: ${colors.error};
  text-align: center;
`;

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function ScheduleLinkExpense({ groupId, scheduleId, onClose, onLinked }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkingId, setLinkingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchUnlinkedExpenses() {
      const response = await apiFetch(`/api/groups/${groupId}/expenses`);
      const result = await response.json();

      if (!ignore && result.success) {
        setExpenses((result.data ?? []).filter((item) => !item.schedule));
      }
      if (!ignore) setIsLoading(false);
    }

    fetchUnlinkedExpenses();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const handleLink = async (expenseId) => {
    if (linkingId) return;

    setLinkingId(expenseId);
    setError('');

    try {
      const response = await apiFetch(
        `/api/groups/${groupId}/expenses/${expenseId}/schedule`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduleId }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '지출 연결에 실패했습니다.');
        return;
      }

      onLinked();
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLinkingId(null);
    }
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>지출 연결하기</ModalTitle>

      {isLoading && <Loading />}

      {!isLoading && expenses.length === 0 && (
        <EmptyMessage>연결할 수 있는 지출이 없습니다.</EmptyMessage>
      )}

      {expenses.length > 0 && (
        <ExpenseList>
          {expenses.map((expense) => {
            const CategoryIcon = getCategoryIcon(
              toDisplayCategory(expense.category),
            );

            return (
              <ExpenseRow
                key={expense.id}
                type="button"
                onClick={() => handleLink(expense.id)}
                disabled={linkingId !== null}
              >
                <ExpenseIconWrap>
                  <CategoryIcon />
                </ExpenseIconWrap>
                <ExpenseInfo>
                  <ExpenseTitle>{expense.title}</ExpenseTitle>
                  <ExpensePayer>{expense.payer?.name}</ExpensePayer>
                </ExpenseInfo>
                <ExpenseAmount>{formatAmount(expense.amount)}</ExpenseAmount>
              </ExpenseRow>
            );
          })}
        </ExpenseList>
      )}

      {error && <ErrorText>{error}</ErrorText>}
    </Modal>
  );
}

export default ScheduleLinkExpense;
