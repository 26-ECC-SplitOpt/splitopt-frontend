import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';
import { getCurrentUser } from '../utils/auth';

const CATEGORY_OPTIONS = ['식비', '교통', '숙박', '활동', '쇼핑', '기타'];

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
  padding: 46px 24px 30px;
  box-sizing: border-box;
`;

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
  padding: 0 14px;
  border: 1px solid ${colors.accent};
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  color: rgba(28, 30, 34, 0.82);
  outline: none;
  background-color: ${colors.white};
  box-sizing: border-box;

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

const RadioRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 14px;
`;

const RadioOption = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.body};
`;

const MemberGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
`;

const MemberOption = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.body};

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const ShareList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
`;

const ShareRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ShareName = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: ${colors.body};
  width: 40px;
  flex-shrink: 0;
`;

const ShareAmountRow = styled.div`
  position: relative;
  flex: 1;
`;

const ShareInput = styled.input`
  width: 100%;
  height: 32px;
  padding: 0 30px 0 12px;
  border: 1px solid rgba(69, 75, 96, 0.35);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: ${colors.body};
  outline: none;
  box-sizing: border-box;
  text-align: right;

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ShareUnit = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(28, 30, 34, 0.5);
`;

const EqualShareValue = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(28, 30, 34, 0.6);
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
`;

const ValidationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  animation: ${(props) => (props.shakeTrigger > 0 ? shake : 'none')} 0.4s ease;
`;

const ValidationText = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 10px;
  color: ${(props) => (props.ok ? '#12b100' : colors.error)};
`;

const ValidationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
  transform: translateY(2px);
  color: ${(props) => (props.ok ? '#12b100' : colors.error)};
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

function FilledCircle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.3" fill="#454B60" />
      <path
        d="M4.8 8.2L6.8 10.2L11.2 5.6"
        stroke={colors.white}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HollowCircle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="7.3"
        stroke="rgba(69, 75, 96, 0.4)"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function displayName(participant) {
  return participant.name;
}

// 서버는 shares[].amount를 그대로 저장하고 Σ(shares.amount) === amount만
// 검증하므로, 균등 분담도 프론트가 미리 나눠서 명시적으로 보낸다. 나머지 금액은
// 결제자가 우선으로 받고, 결제자가 부담자 목록에 없으면 첫 번째 참여자가 받는다.
function computeEqualShares(participants, amount, payerParticipantId) {
  const count = participants.length;
  if (count === 0) return [];

  const base = Math.floor(amount / count);
  const remainder = amount - base * count;
  const priorityIndex = participants.findIndex(
    (p) => String(p.participantId) === String(payerParticipantId),
  );
  const remainderIndex = priorityIndex === -1 ? 0 : priorityIndex;

  return participants.map((p, index) => ({
    participantId: p.participantId,
    amount: index === remainderIndex ? base + remainder : base,
  }));
}

function ExpenseForm() {
  const navigate = useNavigate();
  const { groupId, expenseId } = useParams();
  const isEditMode = Boolean(expenseId);

  const [groupParticipants, setGroupParticipants] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [amount, setAmount] = useState('');
  const [selectionMode, setSelectionMode] = useState('ALL');
  const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);
  const [splitMode, setSplitMode] = useState('EQUAL');
  const [manualAmounts, setManualAmounts] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchGroup() {
      const response = await fetch(`/api/groups/${groupId}`);
      const result = await response.json();

      if (!ignore && result.success) {
        const participantList = result.data.participants ?? [];
        setGroupParticipants(participantList);
        if (!isEditMode) {
          setSelectedParticipantIds(
            participantList.map((p) => p.participantId),
          );
        }
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
        fetch(`/api/groups/${groupId}`),
        fetch(`/api/groups/${groupId}/expenses/${expenseId}`),
      ]);
      const groupResult = await groupResponse.json();
      const result = await expenseResponse.json();

      if (!ignore && result.success) {
        const expense = result.data;
        setDate(expense.expenseDate ?? '');
        setTitle(expense.title ?? '');
        setMemo(expense.memo ?? '');
        setCategory(expense.category ?? CATEGORY_OPTIONS[0]);
        setAmount(String(expense.amount ?? ''));

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
      }
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('지출 항목을 입력해주세요.');
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

    const shares =
      splitMode === 'EQUAL'
        ? equalShares
        : activeParticipants.map((p) => ({
            participantId: p.participantId,
            amount: Number(manualAmounts[p.participantId]) || 0,
          }));

    const payload = {
      title,
      amount: Number(amount),
      category,
      expenseDate: date,
      memo,
      splitMethod: splitMode,
      shares,
    };

    setIsSubmitting(true);

    try {
      const url = isEditMode
        ? `/api/groups/${groupId}/expenses/${expenseId}`
        : `/api/groups/${groupId}/expenses`;
      const response = await fetch(url, {
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
    <Page>
      <Header />

      <Content>
        <TitleBar
          title={isEditMode ? '지출 수정하기' : '지출 등록하기'}
          onBack={() => navigate(-1)}
        />

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
            >
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

          <FieldGroup>
            <FieldLabel>정산 부담자</FieldLabel>
            <RadioRow>
              <RadioOption
                type="button"
                onClick={() => handleSelectionModeChange('ALL')}
              >
                {selectionMode === 'ALL' ? <FilledCircle /> : <HollowCircle />}
                모두 ({groupParticipants.length}명)
              </RadioOption>
              <RadioOption
                type="button"
                onClick={() => handleSelectionModeChange('PARTIAL')}
              >
                {selectionMode === 'PARTIAL' ? (
                  <FilledCircle />
                ) : (
                  <HollowCircle />
                )}
                일부 선택 ({selectedParticipantIds.length}명)
              </RadioOption>
            </RadioRow>

            <MemberGrid>
              {groupParticipants.map((p) => (
                <MemberOption
                  key={p.participantId}
                  type="button"
                  disabled={selectionMode === 'ALL'}
                  onClick={() => toggleMember(p.participantId)}
                >
                  {activeParticipantIds.includes(p.participantId) ? (
                    <FilledCircle />
                  ) : (
                    <HollowCircle />
                  )}
                  {displayName(p)}
                </MemberOption>
              ))}
            </MemberGrid>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>정산 방법</FieldLabel>
            <RadioRow>
              <RadioOption type="button" onClick={() => setSplitMode('EQUAL')}>
                {splitMode === 'EQUAL' ? <FilledCircle /> : <HollowCircle />}
                균등 분담
              </RadioOption>
              <RadioOption type="button" onClick={() => setSplitMode('DIRECT')}>
                {splitMode === 'DIRECT' ? <FilledCircle /> : <HollowCircle />}
                직접 입력
              </RadioOption>
            </RadioRow>

            <ShareList>
              {activeParticipants.map((p) => (
                <ShareRow key={p.participantId}>
                  <ShareName>{displayName(p)}</ShareName>
                  {splitMode === 'EQUAL' ? (
                    <EqualShareValue>
                      {formatAmount(
                        equalShareByParticipantId[p.participantId] ?? 0,
                      )}
                    </EqualShareValue>
                  ) : (
                    <ShareAmountRow>
                      <ShareInput
                        type="number"
                        min="0"
                        value={manualAmounts[p.participantId] ?? ''}
                        onChange={(event) =>
                          setManualAmounts((prev) => ({
                            ...prev,
                            [p.participantId]: event.target.value,
                          }))
                        }
                      />
                      <ShareUnit>원</ShareUnit>
                    </ShareAmountRow>
                  )}
                </ShareRow>
              ))}
            </ShareList>

            {splitMode === 'DIRECT' && allManualFilled && (
              <ValidationRow key={shakeTrigger} shakeTrigger={shakeTrigger}>
                <ValidationBadge ok={isManualValid}>*</ValidationBadge>
                <ValidationText ok={isManualValid}>
                  {isManualValid
                    ? '입력한 금액이 결제 금액과 일치합니다.'
                    : '입력한 금액의 합이 결제 금액과 다릅니다.'}
                </ValidationText>
              </ValidationRow>
            )}
          </FieldGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? '처리 중...' : isEditMode ? '수정하기' : '등록하기'}
          </SubmitButton>
        </Form>
      </Content>
    </Page>
  );
}

export default ExpenseForm;
