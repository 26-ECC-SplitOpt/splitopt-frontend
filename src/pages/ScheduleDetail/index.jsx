import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Modal from '../../components/Modal';
import Loading from '../../components/Loading';
import { PencilIcon, TrashIcon } from '../../components/icons';
import { formatScheduleDateTime } from '../../utils/scheduleDate';
import { colors } from '../../styles/colors';
import { apiFetch } from '../../utils/api';
import ScheduleForm from '../ScheduleForm';
import ScheduleLinkExpense from '../ScheduleLinkExpense';
import ExpenseList from './ExpenseList';

const ModalTitle = styled.h2`
  margin: 0 0 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  color: ${colors.body};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoDate = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

const InfoTitle = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${colors.body};
`;

const InfoMemo = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

const IconRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
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

const Divider = styled.div`
  height: 1px;
  margin: 24px 0;
  background-color: rgba(69, 75, 96, 0.2);
`;

const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const TotalLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const TotalValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
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

const LinkButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
  height: 52px;
  border: none;
  border-radius: 12px;
  background-color: ${colors.body};
  color: ${colors.white};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    opacity: 0.9;
  }
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

function ScheduleDetail({ groupId, scheduleId, onClose, onChanged }) {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [unlinkingId, setUnlinkingId] = useState(null);
  const [error, setError] = useState('');

  // 명세서상 일정 단건 조회는 없고, "일정별 지출 조회"(.../schedules/:scheduleId/expenses)가
  // schedule + expenses를 함께 내려준다. totalExpense는 명세서에 없어서 프론트에서 합산한다.
  function toScheduleWithExpenses(data) {
    const expenses = data.expenses ?? [];
    return {
      ...data.schedule,
      expenses,
      totalExpense: expenses.reduce(
        (sum, expense) => sum + (expense.amount ?? 0),
        0,
      ),
    };
  }

  async function fetchSchedule() {
    setIsLoading(true);

    const response = await apiFetch(
      `/api/groups/${groupId}/schedules/${scheduleId}/expenses`,
    );
    const result = await response.json();

    if (result.success) setSchedule(toScheduleWithExpenses(result.data));
    setIsLoading(false);
  }

  useEffect(() => {
    let ignore = false;

    async function load() {
      setIsLoading(true);

      const response = await apiFetch(
        `/api/groups/${groupId}/schedules/${scheduleId}/expenses`,
      );
      const result = await response.json();

      if (!ignore) {
        if (result.success) setSchedule(toScheduleWithExpenses(result.data));
        setIsLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [groupId, scheduleId]);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError('');

    try {
      const response = await apiFetch(
        `/api/groups/${groupId}/schedules/${scheduleId}`,
        { method: 'DELETE' },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '삭제에 실패했습니다.');
        return;
      }

      await onChanged();
      onClose();
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUnlink = async (expenseId) => {
    if (unlinkingId) return;

    setUnlinkingId(expenseId);
    setError('');

    try {
      const response = await apiFetch(
        `/api/groups/${groupId}/expenses/${expenseId}/schedule`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduleId: null }),
        },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '지출 연결 해제에 실패했습니다.');
        return;
      }

      await fetchSchedule();
      await onChanged();
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setUnlinkingId(null);
    }
  };

  if (isEditing && schedule) {
    return (
      <ScheduleForm
        schedule={schedule}
        onClose={() => setIsEditing(false)}
        onCreated={async () => {
          setIsEditing(false);
          await fetchSchedule();
          await onChanged();
        }}
      />
    );
  }

  if (isLinking) {
    return (
      <ScheduleLinkExpense
        groupId={groupId}
        scheduleId={scheduleId}
        onClose={() => setIsLinking(false)}
        onLinked={async () => {
          setIsLinking(false);
          await fetchSchedule();
          await onChanged();
        }}
      />
    );
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>일정 상세</ModalTitle>

      {isLoading && <Loading />}

      {!isLoading && !schedule && (
        <EmptyMessage>일정을 찾을 수 없습니다.</EmptyMessage>
      )}

      {schedule && (
        <>
          <InfoRow>
            <InfoBlock>
              <InfoDate>{formatScheduleDateTime(schedule.startAt)}</InfoDate>
              <InfoTitle>{schedule.title}</InfoTitle>
              {schedule.memo && <InfoMemo>{schedule.memo}</InfoMemo>}
            </InfoBlock>

            <IconRow>
              <IconButton
                type="button"
                aria-label="일정 수정"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon />
              </IconButton>
              <IconButton
                type="button"
                aria-label="일정 삭제"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <TrashIcon />
              </IconButton>
            </IconRow>
          </InfoRow>

          <Divider />

          <TotalRow>
            <TotalLabel>총 지출</TotalLabel>
            <TotalValue>{formatAmount(schedule.totalExpense ?? 0)}</TotalValue>
          </TotalRow>

          <ExpenseList
            expenses={schedule.expenses}
            unlinkingId={unlinkingId}
            onUnlink={handleUnlink}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <LinkButton type="button" onClick={() => setIsLinking(true)}>
            + 지출 연결하기
          </LinkButton>
        </>
      )}
    </Modal>
  );
}

export default ScheduleDetail;
