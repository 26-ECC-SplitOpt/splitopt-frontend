import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import TitleBar from '../../components/TitleBar';
import PageShell from '../../components/PageShell';
import { toDisplayCategory } from '../../utils/category';
import { colors } from '../../styles/colors';
import { getCurrentUser } from '../../utils/auth';
import { apiFetch } from '../../utils/api';
import ScheduleForm from '../ScheduleForm';
import ScheduleDetail from '../ScheduleDetail';
import BudgetForm from '../BudgetForm';
import ExpenseTab from './ExpenseTab';
import StatsTab from './StatsTab';
import ScheduleTab from './ScheduleTab';
import BudgetTab from './BudgetTab';

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
  const [isLoading, setIsLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const [hasSettlements, setHasSettlements] = useState(false);
  const [activeTab, setActiveTab] = useState('expense');

  const [statsLoading, setStatsLoading] = useState(false);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    expenseCount: 0,
    averagePerPerson: 0,
  });
  const [categories, setCategories] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budget, setBudget] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const [groupResponse, expensesResponse, settlementsResponse] =
        await Promise.all([
          apiFetch(`/api/groups/${groupId}`),
          apiFetch(`/api/groups/${groupId}/expenses`),
          apiFetch(`/api/groups/${groupId}/settlements`),
        ]);
      const groupResult = await groupResponse.json();
      const expensesResult = await expensesResponse.json();
      const settlementsResult = await settlementsResponse.json();

      if (!ignore) {
        if (groupResult.success) {
          setGroup(groupResult.data);
        } else if (groupResponse.status === 403) {
          setAccessError('이 모임에 접근할 권한이 없어요.');
        } else if (groupResponse.status === 404) {
          setAccessError('모임을 찾을 수 없어요.');
        } else {
          setAccessError('모임 정보를 불러오지 못했어요.');
        }
        if (expensesResult.success) {
          setExpenses(
            (expensesResult.data ?? []).map((item) => ({
              ...item,
              category: toDisplayCategory(item.category),
            })),
          );
        }
        if (settlementsResult.success) {
          setHasSettlements(
            (settlementsResult.data.settlements ?? []).length > 0,
          );
        }
        setIsLoading(false);
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
            totalAmount: summaryResult.data.totalAmount,
            expenseCount: summaryResult.data.expenseCount,
            averagePerPerson: summaryResult.data.averagePerPerson,
          });
        }
        if (categoriesResult.success) {
          setCategories(
            (categoriesResult.data.categories ?? []).map((item) => ({
              ...item,
              category: toDisplayCategory(item.category),
            })),
          );
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

  // 일정 목록 조회 응답엔 총 지출이 안 내려오고, 그룹 전체 지출 목록에도
  // 일정 연결 정보가 안 내려오는 것 같아서, 일정별로 실제 값이 확인된
  // "일정별 지출 조회"(.../schedules/:scheduleId/expenses)를 따로 불러와 합산한다.
  async function attachScheduleTotals(scheduleList) {
    const results = await Promise.all(
      scheduleList.map((schedule) =>
        apiFetch(`/api/groups/${groupId}/schedules/${schedule.id}/expenses`).then(
          (res) => res.json(),
        ),
      ),
    );

    return scheduleList.map((schedule, index) => {
      const result = results[index];
      const scheduleExpenses = result.success ? result.data.expenses ?? [] : [];

      return {
        ...schedule,
        totalExpense: scheduleExpenses.reduce(
          (sum, expense) => sum + (expense.amount ?? 0),
          0,
        ),
      };
    });
  }

  async function fetchSchedules() {
    setSchedulesLoading(true);

    const response = await apiFetch(`/api/groups/${groupId}/schedules`);
    const result = await response.json();

    if (result.success) {
      setSchedules(await attachScheduleTotals(result.data ?? []));
    }
    setSchedulesLoading(false);
  }

  useEffect(() => {
    if (activeTab !== 'schedule') return undefined;

    let ignore = false;

    async function load() {
      setSchedulesLoading(true);

      const response = await apiFetch(`/api/groups/${groupId}/schedules`);
      const result = await response.json();

      if (!ignore && result.success) {
        setSchedules(await attachScheduleTotals(result.data ?? []));
      }
      if (!ignore) setSchedulesLoading(false);
    }

    load();

    return () => {
      ignore = true;
    };
  }, [activeTab, groupId]);

  async function fetchBudget() {
    setBudgetLoading(true);

    const [budgetResponse, forecastResponse] = await Promise.all([
      apiFetch(`/api/groups/${groupId}/budget`),
      apiFetch(`/api/groups/${groupId}/budget/forecast`),
    ]);
    const budgetResult = await budgetResponse.json();
    const forecastResult = await forecastResponse.json();

    if (budgetResult.success) setBudget(budgetResult.data);
    if (forecastResult.success) setForecast(forecastResult.data);
    setBudgetLoading(false);
  }

  useEffect(() => {
    if (activeTab !== 'budget') return undefined;

    let ignore = false;

    async function load() {
      setBudgetLoading(true);

      const [budgetResponse, forecastResponse] = await Promise.all([
        apiFetch(`/api/groups/${groupId}/budget`),
        apiFetch(`/api/groups/${groupId}/budget/forecast`),
      ]);
      const budgetResult = await budgetResponse.json();
      const forecastResult = await forecastResponse.json();

      if (!ignore) {
        if (budgetResult.success) setBudget(budgetResult.data);
        if (forecastResult.success) setForecast(forecastResult.data);
        setBudgetLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [activeTab, groupId]);

  const memberCount = (group?.participants ?? []).length;

  const currentUser = getCurrentUser();
  const myParticipant = (group?.participants ?? []).find(
    (p) => p.userId === currentUser?.userId,
  );
  const isOwner = myParticipant?.role === 'OWNER';

  async function handleSettle() {
    if (isSettling) return;

    setHasSettlements(true);
    setIsSettling(true);

    try {
      const response = await apiFetch(
        `/api/groups/${groupId}/settlements/optimize`,
        { method: 'POST' },
      );
      const result = await response.json();

      if (result.success) {
        navigate(`/groups/${groupId}/settle`);
      }
    } finally {
      setIsSettling(false);
    }
  }

  return (
    <PageShell
      accessError={accessError}
      titleBar={
        <>
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
              style={
                !group.description ? { visibility: 'hidden' } : undefined
              }
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
        </>
      }
    >
      {activeTab === 'expense' && (
        <ExpenseTab
          groupId={groupId}
          isLoading={isLoading}
          expenses={expenses}
          hasSettlements={hasSettlements}
          isSettling={isSettling}
          onSettle={handleSettle}
        />
      )}

      {activeTab === 'stats' && (
        <StatsTab
          isLoading={statsLoading}
          summary={summary}
          categories={categories}
          participants={participants}
          memberCount={memberCount}
        />
      )}

      {activeTab === 'schedule' && (
        <ScheduleTab
          isLoading={schedulesLoading}
          schedules={schedules}
          onSelectSchedule={setSelectedScheduleId}
          onAddSchedule={() => setIsScheduleModalOpen(true)}
        />
      )}

      {activeTab === 'budget' && (
        <BudgetTab
          isLoading={budgetLoading}
          budget={budget}
          forecast={forecast}
          memberCount={memberCount}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />
      )}

      {isScheduleModalOpen && (
        <ScheduleForm
          onClose={() => setIsScheduleModalOpen(false)}
          onCreated={async () => {
            setIsScheduleModalOpen(false);
            await fetchSchedules();
          }}
        />
      )}

      {selectedScheduleId && (
        <ScheduleDetail
          groupId={groupId}
          scheduleId={selectedScheduleId}
          onClose={() => setSelectedScheduleId(null)}
          onChanged={fetchSchedules}
        />
      )}

      {isBudgetModalOpen && (
        <BudgetForm
          budget={budget}
          onClose={() => setIsBudgetModalOpen(false)}
          onSaved={async () => {
            setIsBudgetModalOpen(false);
            await fetchBudget();
          }}
        />
      )}
    </PageShell>
  );
}

export default GroupDetail;
