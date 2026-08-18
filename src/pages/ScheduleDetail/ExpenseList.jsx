import styled from '@emotion/styled';
import { getCategoryIcon } from '../../utils/categoryIcon';
import { toDisplayCategory } from '../../utils/category';
import { colors } from '../../styles/colors';

const ExpenseCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  box-sizing: border-box;
  overflow: hidden;
`;

const ExpenseRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid ${colors.border};

  &:last-of-type {
    border-bottom: none;
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

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
`;

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function UnlinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 2.5L11.5 11.5M11.5 2.5L2.5 11.5"
        stroke="rgba(0, 0, 0, 0.4)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExpenseList({ expenses, unlinkingId, onUnlink }) {
  if (!expenses || expenses.length === 0) {
    return <EmptyMessage>연결된 지출이 없습니다.</EmptyMessage>;
  }

  return (
    <ExpenseCard>
      {expenses.map((expense) => {
        const CategoryIcon = getCategoryIcon(toDisplayCategory(expense.category));

        return (
          <ExpenseRow key={expense.id}>
            <ExpenseIconWrap>
              <CategoryIcon />
            </ExpenseIconWrap>
            <ExpenseInfo>
              <ExpenseTitle>{expense.title}</ExpenseTitle>
              <ExpensePayer>{expense.payer?.name}</ExpensePayer>
            </ExpenseInfo>
            <ExpenseAmount>{formatAmount(expense.amount)}</ExpenseAmount>
            <IconButton
              type="button"
              aria-label="지출 연결 해제"
              onClick={() => onUnlink(expense.id)}
              disabled={unlinkingId !== null}
            >
              <UnlinkIcon />
            </IconButton>
          </ExpenseRow>
        );
      })}
    </ExpenseCard>
  );
}

export default ExpenseList;
