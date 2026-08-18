import styled from '@emotion/styled';
import Loading from '../../components/Loading';
import { ChevronRightIcon } from '../../components/icons';
import { formatScheduleDate } from '../../utils/scheduleDate';
import { colors } from '../../styles/colors';
import { EmptyWrap, EmptyMessage, AddActionButton, formatAmount } from './shared';

const ScheduleTabWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const ScheduleSectionTitle = styled.p`
  margin: 0 0 16px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ScheduleRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 18px 20px;
  border: 1px solid ${colors.border};
  border-radius: 16px;
  background-color: ${colors.white};
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
`;

const ScheduleDate = styled.span`
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

const ScheduleTitle = styled.span`
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const ScheduleAmount = styled.span`
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
`;

function ScheduleTab({ isLoading, schedules, onSelectSchedule, onAddSchedule }) {
  if (isLoading) {
    return (
      <EmptyWrap>
        <Loading />
      </EmptyWrap>
    );
  }

  return (
    <ScheduleTabWrap>
      <ScheduleSectionTitle>일정 목록</ScheduleSectionTitle>

      {schedules.length > 0 ? (
        <ScheduleList>
          {schedules.map((schedule) => (
            <ScheduleRow
              key={schedule.id}
              type="button"
              onClick={() => onSelectSchedule(schedule.id)}
            >
              <ScheduleDate>{formatScheduleDate(schedule.startAt)}</ScheduleDate>
              <ScheduleTitle>{schedule.title}</ScheduleTitle>
              <ScheduleAmount>
                {formatAmount(schedule.totalExpense ?? 0)}
              </ScheduleAmount>
              <ChevronRightIcon color="rgba(29, 31, 34, 0.82)" />
            </ScheduleRow>
          ))}
        </ScheduleList>
      ) : (
        <EmptyMessage>일정이 없습니다.</EmptyMessage>
      )}

      <AddActionButton type="button" onClick={onAddSchedule}>
        + 새 일정 추가하기
      </AddActionButton>
    </ScheduleTabWrap>
  );
}

export default ScheduleTab;
