import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { ChevronRightIcon } from '../components/icons';
import { getCategoryIcon } from '../utils/categoryIcon';
import { colors } from '../styles/colors';

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
  padding: 46px 24px 40px;
  box-sizing: border-box;
`;

const MemoText = styled.p`
  margin: 14px 0 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
`;

const SummaryCard = styled.div`
  display: flex;
  margin-top: 47px;
  padding: 20px 0;
  background-color: #f4f5f8;
  border-radius: 16px;
`;

const StatBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const StatLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const StatValue = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const ActionRow = styled.div`
  display: flex;
  gap: 11px;
  margin-top: 19px;
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.white};
  text-decoration: none;
  box-sizing: border-box;

  &:hover {
    opacity: 0.9;
  }
`;

const RegisterButton = styled(ActionButton)`
  background-color: ${colors.body};
`;

const SettleButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  border: none;
  border-radius: 10px;
  background-color: #12b100;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.white};
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

const SectionHeader = styled.div`
  margin-top: 48px;
`;

const SectionTitle = styled.p`
  margin: 0 0 15px;
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

const EmptyWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

function SettingsIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.5 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke={colors.body}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9 12.9a1.4 1.4 0 0 0 .28 1.54l.05.05a1.7 1.7 0 1 1-2.4 2.4l-.05-.05a1.4 1.4 0 0 0-1.54-.28 1.4 1.4 0 0 0-.85 1.28v.14a1.7 1.7 0 0 1-3.4 0v-.08a1.4 1.4 0 0 0-.91-1.28 1.4 1.4 0 0 0-1.54.28l-.05.05a1.7 1.7 0 1 1-2.4-2.4l.05-.05a1.4 1.4 0 0 0 .28-1.54 1.4 1.4 0 0 0-1.28-.85h-.14a1.7 1.7 0 0 1 0-3.4h.08a1.4 1.4 0 0 0 1.28-.91 1.4 1.4 0 0 0-.28-1.54l-.05-.05a1.7 1.7 0 1 1 2.4-2.4l.05.05a1.4 1.4 0 0 0 1.54.28h.06a1.4 1.4 0 0 0 .85-1.28v-.14a1.7 1.7 0 0 1 3.4 0v.08a1.4 1.4 0 0 0 .85 1.28h.06a1.4 1.4 0 0 0 1.54-.28l.05-.05a1.7 1.7 0 1 1 2.4 2.4l-.05.05a1.4 1.4 0 0 0-.28 1.54v.06a1.4 1.4 0 0 0 1.28.85h.14a1.7 1.7 0 0 1 0 3.4h-.08a1.4 1.4 0 0 0-1.28.85Z"
        stroke={colors.body}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function GroupDetail() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchGroup() {
      const response = await fetch(`/api/groups/${groupId}`);
      const result = await response.json();

      if (!ignore && result.success) {
        setGroup(result.data);
      }
    }

    fetchGroup();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const expenses = group?.expenses ?? [];
  const hasExpenses = expenses.length > 0;
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);
  const memberCount = group?.members?.length ?? 0;

  async function handleSettle() {
    if (isSettling) return;

    setIsSettling(true);

    try {
      const response = await fetch(`/api/groups/${groupId}/settle`, {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        navigate(`/groups/${groupId}/settle`);
      }
    } finally {
      setIsSettling(false);
    }
  }

  return (
    <Page>
      <Header />

      <Content>
        <TitleBar
          title={group?.name ?? ''}
          onBack={() => navigate(-1)}
          rightAction={
            <Link
              to={`/groups/${groupId}/settings`}
              aria-label="모임 설정"
              style={{ display: 'flex' }}
            >
              <SettingsIcon />
            </Link>
          }
        />

        {group?.memo && <MemoText>{group.memo}</MemoText>}

        <SummaryCard>
          <StatBlock>
            <StatLabel>참여 인원</StatLabel>
            <StatValue>{group ? `${memberCount}명` : '-'}</StatValue>
          </StatBlock>
          <StatBlock>
            <StatLabel>총 지출 금액</StatLabel>
            <StatValue>{group ? formatAmount(totalAmount) : '-'}</StatValue>
          </StatBlock>
        </SummaryCard>

        <ActionRow>
          <RegisterButton to={`/groups/${groupId}/expenses/new`}>
            지출 등록
          </RegisterButton>
          <SettleButton onClick={handleSettle} disabled={isSettling}>
            {isSettling ? '정산 중...' : '정산하기'}
          </SettleButton>
        </ActionRow>

        <SectionHeader>
          <SectionTitle>지출 내역</SectionTitle>
          <Divider />
        </SectionHeader>

        {hasExpenses ? (
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
                    <ExpenseCategory>{expense.category}</ExpenseCategory>
                    <ExpensePayer>{expense.payer}</ExpensePayer>
                  </ExpenseInfo>
                  <ExpenseAmount>{formatAmount(expense.amount)}</ExpenseAmount>
                  <ChevronRightIcon color="rgba(29, 31, 34, 0.82)" />
                </ExpenseRow>
              );
            })}
          </ExpenseList>
        ) : (
          <EmptyWrap>
            <EmptyMessage>
              지출 내역이 없습니다.
              <br />
              지출 내역을 등록해주세요.
            </EmptyMessage>
          </EmptyWrap>
        )}
      </Content>
    </Page>
  );
}

export default GroupDetail;
