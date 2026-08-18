import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { ChevronRightIcon } from '../../components/icons';
import { getCategoryIcon } from '../../utils/categoryIcon';
import { formatScheduleDate } from '../../utils/scheduleDate';
import { colors } from '../../styles/colors';
import { formatAmount, EmptyMessage } from './shared';

const ActionRow = styled.div`
  display: flex;
  gap: 11px;
  margin-top: 24px;
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.white};
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RegisterButton = styled(ActionButton)`
  background-color: ${colors.body};
`;

const SettleButton = styled(ActionButton)`
  background-color: #12b100;
`;

const SectionHeader = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.p`
  margin: 0 0 16px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(69, 75, 96, 0.2);
`;

const ExpenseList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExpenseRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(173, 173, 173, 0.25);
  text-decoration: none;
  cursor: pointer;

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

const ExpenseCategory = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
`;

const ExpensePayer = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
`;

const ExpenseAmount = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
`;

// 지출 목록이 비어있을 때는 flex:1처럼 남는 공간을 채우지 않고
// 자연스러운 높이만 차지하게 해서, 목록이 있을 때/없을 때 상관없이
// 등록/정산 버튼이 항상 같은 위치(ActionRow의 고정 margin-top)에 오게 한다.
const ExpenseEmptyWrap = styled.div`
  text-align: center;
  padding: 60px 0;
`;

function ExpenseTab({
  groupId,
  isLoading,
  expenses,
  hasSettlements,
  isSettling,
  onSettle,
}) {
  const hasExpenses = expenses.length > 0;

  return (
    <>
      <ActionRow>
        <RegisterButton to={`/groups/${groupId}/expenses/new`}>
          지출 등록
        </RegisterButton>
        <SettleButton
          as="button"
          type="button"
          onClick={onSettle}
          disabled={isSettling}
        >
          {hasSettlements ? '정산 내역' : '정산하기'}
        </SettleButton>
      </ActionRow>

      <SectionHeader>
        <SectionTitle>지출 내역</SectionTitle>
        <Divider />
      </SectionHeader>

      {isLoading ? (
        <ExpenseEmptyWrap>
          <Loading />
        </ExpenseEmptyWrap>
      ) : hasExpenses ? (
        <ExpenseList>
          {expenses.map((expense) => {
            const CategoryIcon = getCategoryIcon(expense.category);

            return (
              <ExpenseRow
                key={expense.id}
                to={`/groups/${groupId}/expenses/${expense.id}`}
              >
                <ExpenseIconWrap>
                  <CategoryIcon />
                </ExpenseIconWrap>
                <ExpenseInfo>
                  <ExpenseCategory>
                    {expense.title ?? expense.category}
                  </ExpenseCategory>
                  <ExpensePayer>
                    {expense.payer?.name}
                    {expense.expenseDate &&
                      ` · ${formatScheduleDate(expense.expenseDate)}`}
                  </ExpensePayer>
                </ExpenseInfo>
                <ExpenseAmount>{formatAmount(expense.amount)}</ExpenseAmount>
                <ChevronRightIcon color="rgba(29, 31, 34, 0.82)" />
              </ExpenseRow>
            );
          })}
        </ExpenseList>
      ) : (
        <ExpenseEmptyWrap>
          <EmptyMessage>
            지출 내역이 없습니다.
            <br />
            지출 내역을 등록해주세요.
          </EmptyMessage>
        </ExpenseEmptyWrap>
      )}
    </>
  );
}

export default ExpenseTab;
