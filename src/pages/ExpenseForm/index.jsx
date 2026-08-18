import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import TitleBar from '../../components/TitleBar';
import PageShell from '../../components/PageShell';
import { colors } from '../../styles/colors';
import { getCurrentUser } from '../../utils/auth';
import { apiFetch } from '../../utils/api';
import {
  CATEGORY_OPTIONS,
  toApiCategory,
  toDisplayCategory,
} from '../../utils/category';
import { computeEqualShares } from './shared';
import ParticipantSelector from './ParticipantSelector';
import SplitFields from './SplitFields';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 31px;
`;

const FieldGroup = styled.div`
  margin-bottom: 26px;
`;

const FieldLabel = styled.p`
  margin: 0 0 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: rgba(28, 30, 34, 0.82);
`;

const TextInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid ${colors.accent};
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: rgba(28, 30, 34, 0.82);
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.body};
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 40px 0 14px;
  border: 1px solid ${colors.accent};
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: rgba(28, 30, 34, 0.82);
  outline: none;
  background-color: ${colors.white};
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%23454B60' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
  background-size: 12px;

  &:focus {
    border-color: ${colors.body};
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
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: rgba(28, 30, 34, 0.5);
`;

const ErrorText = styled.p`
  margin: 12px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: ${colors.error};
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  margin-top: auto;
  background-color: ${colors.body};
  color: ${colors.white};
  border: none;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function ExpenseForm() {
  const navigate = useNavigate();
  const { groupId, expenseId } = useParams();
  const isEditMode = Boolean(expenseId);

  const [groupParticipants, setGroupParticipants] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [scheduleId, setScheduleId] = useState(null);
  const [selectionMode, setSelectionMode] = useState('ALL');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);
  const [splitMode, setSplitMode] = useState('EQUAL');
  const [manualAmounts, setManualAmounts] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [isGroupLoading, setIsGroupLoading] = useState(true);
  const [isExpenseLoading, setIsExpenseLoading] = useState(isEditMode);
  const [accessError, setAccessError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchGroup() {
      const response = await apiFetch(`/api/groups/${groupId}`);
      const result = await response.json();

      if (!ignore) {
        if (result.success) {
          const participantList = result.data.participants ?? [];
          setGroupParticipants(participantList);
          if (!isEditMode) {
            setSelectedParticipantIds(
              participantList.map((p) => p.participantId),
            );
          }
        } else if (response.status === 403) {
          setAccessError('이 모임에 접근할 권한이 없어요.');
        } else if (response.status === 404) {
          setAccessError('모임을 찾을 수 없어요.');
        }
        setIsGroupLoading(false);
      }
    }

    fetchGroup();

    return () => {
      ignore = true;
    };
  }, [groupId, isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;

    let ignore = false;

    async function fetchExpense() {
      const [groupResponse, expenseResponse] = await Promise.all([
        apiFetch(`/api/groups/${groupId}`),
        apiFetch(`/api/groups/${groupId}/expenses/${expenseId}`),
      ]);
      const groupResult = await groupResponse.json();
      const result = await expenseResponse.json();

      if (!ignore && result.success) {
        const expense = result.data;
        setDate(expense.expenseDate ?? '');
        setTitle(expense.title ?? '');
        setMemo(expense.memo ?? '');
        setCategory(toDisplayCategory(expense.category ?? ''));
        setAmount(String(expense.amount ?? ''));
        setScheduleId(expense.schedule?.id ?? null);

        const shareParticipantIds = (expense.shares ?? []).map(
          (share) => share.participantId,
        );
        const groupParticipantList = groupResult.success
          ? (groupResult.data.participants ?? [])
          : [];
        const groupMemberCount =
          groupParticipantList.length || shareParticipantIds.length;

        setSelectionMode(
          shareParticipantIds.length === groupMemberCount ? 'ALL' : 'PARTIAL',
        );
        setSelectedParticipantIds(shareParticipantIds);
        // splitMethod는 서버에 저장되지 않으므로, 수정 화면에서는 항상
        // 기존 금액을 그대로 보여주는 "직접 입력" 모드로 시작한다.
        setSplitMode('DIRECT');
        setManualAmounts(
          (expense.shares ?? []).reduce(
            (acc, share) => ({
              ...acc,
              [share.participantId]: String(share.amount),
            }),
            {},
          ),
        );
      } else if (!ignore && groupResult.success) {
        if (expenseResponse.status === 403) {
          setAccessError('이 지출을 볼 권한이 없어요.');
        } else if (expenseResponse.status === 404) {
          setAccessError('지출 내역을 찾을 수 없어요.');
        }
      }
      if (!ignore) setIsExpenseLoading(false);
    }

    fetchExpense();

    return () => {
      ignore = true;
    };
  }, [groupId, expenseId, isEditMode]);

  const activeParticipantIds =
    selectionMode === 'ALL'
      ? groupParticipants.map((p) => p.participantId)
      : selectedParticipantIds;

  const activeParticipants = groupParticipants.filter((p) =>
    activeParticipantIds.includes(p.participantId),
  );

  const myParticipantId = useMemo(() => {
    const currentUser = getCurrentUser();
    return groupParticipants.find((p) => p.userId === currentUser?.userId)
      ?.participantId;
  }, [groupParticipants]);

  const equalShares = useMemo(
    () =>
      computeEqualShares(
        activeParticipants,
        Number(amount) || 0,
        myParticipantId,
      ),
    [activeParticipants, amount, myParticipantId],
  );

  const equalShareByParticipantId = useMemo(
    () =>
      Object.fromEntries(equalShares.map((s) => [s.participantId, s.amount])),
    [equalShares],
  );

  const manualTotal = useMemo(
    () =>
      activeParticipants.reduce(
        (sum, p) => sum + (Number(manualAmounts[p.participantId]) || 0),
        0,
      ),
    [activeParticipants, manualAmounts],
  );

  const isManualValid = manualTotal === (Number(amount) || 0);

  const allManualFilled = activeParticipants.every(
    (p) =>
      manualAmounts[p.participantId] !== undefined &&
      manualAmounts[p.participantId] !== '',
  );

  const toggleMember = (participantId) => {
    if (selectionMode !== 'PARTIAL') return;

    setSelectedParticipantIds((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId],
    );
  };

  const handleSelectionModeChange = (mode) => {
    setSelectionMode(mode);
    if (mode === 'ALL') {
      setSelectedParticipantIds(groupParticipants.map((p) => p.participantId));
    }
  };

  const handleManualAmountChange = (participantId, value) => {
    setManualAmounts((prev) => ({ ...prev, [participantId]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('지출 항목을 입력해주세요.');
      return;
    }

    if (!category) {
      setError('카테고리를 선택해주세요.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('금액을 올바르게 입력해주세요.');
      return;
    }

    if (activeParticipants.length === 0) {
      setError('정산 부담자를 1명 이상 선택해주세요.');
      return;
    }

    if (splitMode === 'DIRECT' && !isManualValid) {
      setShakeTrigger((prev) => prev + 1);
      return;
    }

    // 백엔드 API 명세: 결제자(payer)는 로그인 사용자로 서버가 자동 고정하므로
    // payerId는 보내지 않는다. EQUAL이면 shares에 participantId만 보내고
    // (서버가 균등 분배 계산), DIRECT면 participantId + amount를 보낸다.
    const shares =
      splitMode === 'EQUAL'
        ? activeParticipants.map((p) => ({ participantId: p.participantId }))
        : activeParticipants.map((p) => ({
            participantId: p.participantId,
            amount: Number(manualAmounts[p.participantId]) || 0,
          }));

    const payload = {
      title,
      amount: Number(amount),
      category: toApiCategory(category),
      memo,
      expenseDate: date,
      scheduleId: isEditMode ? scheduleId : null,
      splitMethod: splitMode,
      shares,
    };

    setIsSubmitting(true);

    try {
      const url = isEditMode
        ? `/api/groups/${groupId}/expenses/${expenseId}`
        : `/api/groups/${groupId}/expenses`;
      const response = await apiFetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '지출 등록에 실패했습니다.');
        return;
      }

      if (isEditMode) {
        navigate(`/groups/${groupId}/expenses/${expenseId}`);
      } else {
        navigate(`/groups/${groupId}`);
      }
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell
      isLoading={isGroupLoading || isExpenseLoading}
      accessError={accessError}
      contentPadding="46px 24px 30px"
      titleBar={
        <TitleBar
          title={isEditMode ? '지출 수정하기' : '지출 등록하기'}
          onBack={() => navigate(-1)}
        />
      }
    >
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldLabel>지출 날짜</FieldLabel>
          <TextInput
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>지출 항목</FieldLabel>
          <TextInput
            type="text"
            placeholder="지출 항목을 입력하세요"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>메모(선택)</FieldLabel>
          <TextInput
            type="text"
            placeholder="메모를 입력하세요"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>카테고리</FieldLabel>
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="" disabled hidden>
              카테고리를 선택하세요
            </option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>금액</FieldLabel>
          <AmountWrap>
            <TextInput
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
        </FieldGroup>

        <ParticipantSelector
          groupParticipants={groupParticipants}
          selectionMode={selectionMode}
          onSelectionModeChange={handleSelectionModeChange}
          selectedParticipantIds={selectedParticipantIds}
          activeParticipantIds={activeParticipantIds}
          onToggleMember={toggleMember}
        />

        <SplitFields
          splitMode={splitMode}
          onSplitModeChange={setSplitMode}
          activeParticipants={activeParticipants}
          equalShareByParticipantId={equalShareByParticipantId}
          manualAmounts={manualAmounts}
          onManualAmountChange={handleManualAmountChange}
          isManualValid={isManualValid}
          allManualFilled={allManualFilled}
          shakeTrigger={shakeTrigger}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? '처리 중...' : isEditMode ? '수정하기' : '등록하기'}
        </SubmitButton>
      </Form>
    </PageShell>
  );
}

export default ExpenseForm;
