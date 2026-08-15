import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { ChevronRightIcon } from '../components/icons';
import { getCategoryIcon } from '../utils/categoryIcon';
import { colors } from '../styles/colors';
import { getCurrentUser } from '../utils/auth';
import { apiFetch } from '../utils/api';

const CATEGORY_COLORS = {
  식비: '#BC97DF',
  교통: '#B0DF97',
  숙박: '#97CCDF',
  쇼핑: '#DF97B1',
  활동: '#F8D2A8',
  기타: '#A0A6B1',
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category];
}

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

const TabBar = styled.div`
  display: flex;
  margin-top: 32px;
  border-bottom: 1px solid rgba(69, 75, 96, 0.15);
`;

const TabButton = styled.button`
  flex: 1;
  padding: 0 0 14px;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? colors.accent : 'transparent')};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${(props) => (props.active ? colors.body : 'rgba(0, 0, 0, 0.4)')};
  cursor: pointer;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 11px;
  margin-top: 24px;
`;

const ExpenseCard = styled.div`
  margin-top: 32px;
  padding: 20px;
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  box-sizing: border-box;
`;

const SectionTitle = styled.p`
  margin: 0 0 16px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
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

// 지출 목록이 비어있을 때는 EmptyWrap(flex:1)처럼 남는 공간을 채우지 않고
// 자연스러운 높이만 차지하게 해서, 목록이 있을 때/없을 때 상관없이
// 등록/정산 버튼이 항상 같은 위치(ActionRow의 고정 margin-top)에 오게 한다.
const ExpenseEmptyWrap = styled.div`
  text-align: center;
  padding: 60px 0;
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

const StatsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  padding: 20px;
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  box-sizing: border-box;
`;

const StatCardTitle = styled.p`
  margin: 0 0 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
`;

const SummaryLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

const SummaryValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const ChartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const CategoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CategoryLabel = styled.span`
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: ${colors.body};
`;

const ColorDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
  background-color: ${(props) => props.color};
`;

const CategoryValue = styled.span`
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ParticipantRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ParticipantName = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: ${colors.body};
`;

const ParticipantValue = styled.span`
  font-family: 'Inter', sans-serif;
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

function DonutChart({ segments }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce((acc, segment) => {
    const dash = (segment.ratio / 100) * circumference;
    const offset =
      acc.length > 0
        ? acc[acc.length - 1].offset + acc[acc.length - 1].dash
        : 0;
    return [...acc, { ...segment, dash, offset }];
  }, []);

  return (
    <svg width="80" height="80" viewBox="0 0 110 110" aria-hidden="true">
      <g transform="rotate(-90 55 55)">
        {arcs.map((segment) => (
          <circle
            key={segment.category}
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="16"
            strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
            strokeDashoffset={-segment.offset}
          />
        ))}
      </g>
    </svg>
  );
}

function formatAmount(amount) {
  return `${(amount ?? 0).toLocaleString('ko-KR')}원`;
}

const TABS = [
  { key: 'expense', label: '지출' },
  { key: 'stats', label: '통계' },
  { key: 'schedule', label: '일정' },
  { key: 'budget', label: '예산' },
];

function GroupDetail() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isSettling, setIsSettling] = useState(false);
  const [activeTab, setActiveTab] = useState('expense');

  const [statsLoading, setStatsLoading] = useState(false);
  const [summary, setSummary] = useState({ totalExpense: 0, expenseCount: 0 });
  const [categories, setCategories] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const [groupResponse, expensesResponse] = await Promise.all([
        apiFetch(`/api/groups/${groupId}`),
        apiFetch(`/api/groups/${groupId}/expenses`),
      ]);
      const groupResult = await groupResponse.json();
      const expensesResult = await expensesResponse.json();

      if (!ignore) {
        if (groupResult.success) setGroup(groupResult.data);
        if (expensesResult.success) {
          setExpenses(expensesResult.data.expenses ?? []);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  useEffect(() => {
    if (activeTab !== 'stats') return undefined;

    let ignore = false;

    async function fetchStats() {
      setStatsLoading(true);

      const [summaryResponse, categoriesResponse, participantsResponse] =
        await Promise.all([
          apiFetch(`/api/groups/${groupId}/statistics`),
          apiFetch(`/api/groups/${groupId}/statistics/categories`),
          apiFetch(`/api/groups/${groupId}/statistics/participants`),
        ]);
      const summaryResult = await summaryResponse.json();
      const categoriesResult = await categoriesResponse.json();
      const participantsResult = await participantsResponse.json();

      if (!ignore) {
        if (summaryResult.success) {
          setSummary({
            totalExpense: summaryResult.data.totalExpense,
            expenseCount: summaryResult.data.expenseCount,
          });
        }
        if (categoriesResult.success) {
          setCategories(categoriesResult.data.categories ?? []);
        }
        if (participantsResult.success) {
          setParticipants(participantsResult.data.participants ?? []);
        }
        setStatsLoading(false);
      }
    }

    fetchStats();

    return () => {
      ignore = true;
    };
  }, [activeTab, groupId]);

  const hasExpenses = expenses.length > 0;
  const memberCount = group?.memberCount ?? 0;

  const currentUser = getCurrentUser();
  const myParticipant = (group?.participants ?? []).find(
    (p) => p.userId === currentUser?.userId,
  );
  const isOwner = myParticipant?.role === 'OWNER';

  const categorySegments = categories.map((item) => ({
    ...item,
    color: getCategoryColor(item.category),
  }));

  async function handleSettle() {
    if (isSettling) return;

    setIsSettling(true);

    try {
      const response = await apiFetch(`/api/groups/${groupId}/settle`, {
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
          onBack={() => navigate('/groups')}
          rightAction={
            isOwner ? (
              <Link
                to={`/groups/${groupId}/settings`}
                aria-label="모임 설정"
                style={{ display: 'flex' }}
              >
                <SettingsIcon />
              </Link>
            ) : null
          }
        />

        {group && (
          <MemoText
            style={!group.description ? { visibility: 'hidden' } : undefined}
          >
            {group.description || '메모 없음'}
          </MemoText>
        )}

        <TabBar>
          {TABS.map((tab) => (
            <TabButton
              key={tab.key}
              type="button"
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>

        {activeTab === 'expense' && (
          <>
            <ActionRow>
              <RegisterButton to={`/groups/${groupId}/expenses/new`}>
                지출 등록
              </RegisterButton>
              <SettleButton onClick={handleSettle} disabled={isSettling}>
                {isSettling ? '정산 중...' : '정산하기'}
              </SettleButton>
            </ActionRow>

            <ExpenseCard>
              <SectionTitle>지출 내역</SectionTitle>

              {hasExpenses ? (
                <ExpenseList>
                  {expenses.map((expense) => {
                    const CategoryIcon = getCategoryIcon(expense.category);

                    return (
                      <ExpenseRow
                        key={expense.expenseId}
                        to={`/groups/${groupId}/expenses/${expense.expenseId}`}
                      >
                        <ExpenseIconWrap>
                          <CategoryIcon />
                        </ExpenseIconWrap>
                        <ExpenseInfo>
                          <ExpenseCategory>
                            {expense.title ?? expense.category}
                          </ExpenseCategory>
                          <ExpensePayer>{expense.payerName}</ExpensePayer>
                        </ExpenseInfo>
                        <ExpenseAmount>
                          {formatAmount(expense.amount)}
                        </ExpenseAmount>
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
            </ExpenseCard>
          </>
        )}

        {activeTab === 'stats' &&
          (statsLoading ? (
            <EmptyWrap>
              <EmptyMessage>불러오는 중...</EmptyMessage>
            </EmptyWrap>
          ) : (
            <StatsWrap>
              <StatCard>
                <StatCardTitle>전체 요약</StatCardTitle>
                <SummaryRow>
                  <SummaryLabel>총 지출 금액</SummaryLabel>
                  <SummaryValue>
                    {formatAmount(summary.totalExpense)}
                  </SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>총 지출 건수</SummaryLabel>
                  <SummaryValue>{summary.expenseCount}건</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>참여 인원</SummaryLabel>
                  <SummaryValue>{memberCount}명</SummaryValue>
                </SummaryRow>
              </StatCard>

              <StatCard>
                <StatCardTitle>카테고리별 지출</StatCardTitle>
                {categories.length > 0 ? (
                  <ChartRow>
                    <DonutChart segments={categorySegments} />
                    <CategoryList>
                      {categories.map((item) => (
                        <CategoryRow key={item.category}>
                          <CategoryLabel>
                            <ColorDot color={getCategoryColor(item.category)} />
                            {item.category}
                          </CategoryLabel>
                          <CategoryValue>
                            {formatAmount(item.amount)} ({item.ratio}%)
                          </CategoryValue>
                        </CategoryRow>
                      ))}
                    </CategoryList>
                  </ChartRow>
                ) : (
                  <EmptyMessage>지출 내역이 없습니다.</EmptyMessage>
                )}
              </StatCard>

              <StatCard>
                <StatCardTitle>참여자별 지출</StatCardTitle>
                {participants.length > 0 ? (
                  <ParticipantList>
                    {participants.map((item) => (
                      <ParticipantRow key={item.userId ?? item.name}>
                        <ParticipantName>{item.name}</ParticipantName>
                        <ParticipantValue>
                          {formatAmount(item.paidAmount)} ({item.paidRatio}%)
                        </ParticipantValue>
                      </ParticipantRow>
                    ))}
                  </ParticipantList>
                ) : (
                  <EmptyMessage>참여자 정보가 없습니다.</EmptyMessage>
                )}
              </StatCard>
            </StatsWrap>
          ))}

        {activeTab === 'schedule' && (
          <EmptyWrap>
            <EmptyMessage>준비 중인 기능입니다.</EmptyMessage>
          </EmptyWrap>
        )}

        {activeTab === 'budget' && (
          <EmptyWrap>
            <EmptyMessage>준비 중인 기능입니다.</EmptyMessage>
          </EmptyWrap>
        )}
      </Content>
    </Page>
  );
}

export default GroupDetail;
