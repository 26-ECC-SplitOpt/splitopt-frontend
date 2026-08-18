import { useState } from 'react';
import { toLocalDateInput, toLocalTimeInput } from '../utils/scheduleDate';
import { useParams } from 'react-router-dom';
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

const DateTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateTimeInput = styled(Input)`
  flex: 1;
  padding: 0 10px;
  font-size: 13px;
`;

const RangeDash = styled.span`
  flex-shrink: 0;
  color: ${colors.accent};
`;

function ScheduleForm({ onClose, onCreated, schedule }) {
  const { groupId } = useParams();
  const isEditing = Boolean(schedule);
  const [title, setTitle] = useState(schedule?.title ?? '');
  const [date, setDate] = useState(toLocalDateInput(schedule?.startAt));
  const [startTime, setStartTime] = useState(
    toLocalTimeInput(schedule?.startAt),
  );
  const [endTime, setEndTime] = useState(toLocalTimeInput(schedule?.endAt));
  const [memo, setMemo] = useState(schedule?.memo ?? '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('일정 이름을 입력해주세요.');
      return;
    }

    if (!date) {
      setError('일정 날짜를 입력해주세요.');
      return;
    }

    if (!startTime) {
      setError('시작 시간을 입력해주세요.');
      return;
    }

    if (endTime && endTime <= startTime) {
      setError('종료 시간은 시작 시간보다 늦어야 해요.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const url = isEditing
        ? `/api/groups/${groupId}/schedules/${schedule.id}`
        : `/api/groups/${groupId}/schedules`;

      const response = await apiFetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          startAt: new Date(`${date}T${startTime}`).toISOString(),
          endAt: endTime ? new Date(`${date}T${endTime}`).toISOString() : null,
          memo,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ??
            (isEditing
              ? '일정 수정에 실패했습니다.'
              : '일정 추가에 실패했습니다.'),
        );
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
      <ModalTitle>
        {isEditing ? '일정 수정하기' : '새 일정 추가하기'}
      </ModalTitle>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="schedule-date">일정 날짜</Label>
          <Input
            id="schedule-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="schedule-start-time">일정 시간</Label>
          <DateTimeRow>
            <DateTimeInput
              id="schedule-start-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
            <RangeDash>~</RangeDash>
            <DateTimeInput
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              aria-label="종료 시간"
            />
          </DateTimeRow>
        </Field>

        <Field>
          <Label htmlFor="schedule-title">일정 이름</Label>
          <Input
            id="schedule-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </Field>

        <Field>
          <Label htmlFor="schedule-memo">메모(선택)</Label>
          <Input
            id="schedule-memo"
            type="text"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </Field>

        {error && <ErrorText style={{ margin: 0 }}>{error}</ErrorText>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : isEditing ? '수정' : '일정 추가'}
        </SubmitButton>
      </Form>
    </Modal>
  );
}

export default ScheduleForm;
