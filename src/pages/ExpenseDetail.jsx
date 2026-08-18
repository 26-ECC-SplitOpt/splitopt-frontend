import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import TitleBar from '../components/TitleBar';
import PageShell from '../components/PageShell';
import { colors } from '../styles/colors';
import { getCurrentUser } from '../utils/auth';
import { apiFetch } from '../utils/api';
import { toDisplayCategory } from '../utils/category';

const InfoRow = styled.div`
  display: flex;
  margin-top: 28px;
`;

const InfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const InfoValue = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const Divider = styled.div`
  height: 1px;
  margin-top: 40px;
  background-color: rgba(69, 75, 96, 0.2);
`;

const SectionTitle = styled.p`
  margin: 22px 0 15px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const ShareList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ShareRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(173, 173, 173, 0.25);

  &:last-of-type {
    border-bottom: none;
  }
`;

const ShareName = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const ShareAmount = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
`;

const ActionRow = styled.div`
  display: flex;
  gap: 11px;
  margin-top: auto;
  padding-top: 40px;
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.white};
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: ${colors.body};
`;

const DeleteButton = styled(ActionButton)`
  background-color: ${colors.body};
`;

const ErrorText = styled.p`
  margin: 12px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: ${colors.error};
  text-align: center;
`;

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function ExpenseDetail() {
  const navigate = useNavigate();
  const { groupId, expenseId } = useParams();
  const [expense, setExpense] = useState(null);
  const [myParticipant, setMyParticipant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [accessError, setAccessError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchExpense() {
      const [groupResponse, expenseResponse] = await Promise.all([
        apiFetch(`/api/groups/${groupId}`),
        apiFetch(`/api/groups/${groupId}/expenses/${expenseId}`),
      ]);
      const groupResult = await groupResponse.json();
      const result = await expenseResponse.json();

      if (!ignore) {
        if (groupResult.success) {
          const currentUser = getCurrentUser();
          setMyParticipant(
            (groupResult.data.participants ?? []).find(
              (p) => p.userId === currentUser?.userId,
            ) ?? null,
          );
        } else if (groupResponse.status === 403) {
          setAccessError('이 모임에 접근할 권한이 없어요.');
        } else if (groupResponse.status === 404) {
          setAccessError('모임을 찾을 수 없어요.');
        }

        if (result.success) {
          setExpense(result.data);
        } else if (groupResult.success) {
          if (expenseResponse.status === 403) {
            setAccessError('이 지출을 볼 권한이 없어요.');
          } else if (expenseResponse.status === 404) {
            setAccessError('지출 내역을 찾을 수 없어요.');
          }
        }
        setIsLoading(false);
      }
    }

    fetchExpense();

    return () => {
      ignore = true;
    };
  }, [groupId, expenseId]);

  const isPayer =
    Boolean(expense?.payer) &&
    expense.payer.participantId === myParticipant?.participantId;
  const isOwner = myParticipant?.role === 'OWNER';
  const payerWithdrawn = Boolean(expense) && !expense.payer;
  const canDelete = isPayer || (isOwner && payerWithdrawn);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError('');

    try {
      const response = await apiFetch(
        `/api/groups/${groupId}/expenses/${expenseId}`,
        { method: 'DELETE' },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '삭제에 실패했습니다.');
        return;
      }

      navigate(`/groups/${groupId}`);
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageShell
      isLoading={isLoading}
      accessError={accessError}
      contentPadding="56px 24px 30px"
      titleBar={
        <TitleBar
          title="지출 상세"
          onBack={() => navigate(`/groups/${groupId}`)}
          style={{ marginBottom: '16px' }}
        />
      }
    >
      <InfoRow>
        <InfoBlock>
          <InfoLabel>지출 일자</InfoLabel>
          <InfoValue>{expense?.expenseDate ?? ''}</InfoValue>
        </InfoBlock>
      </InfoRow>

      <InfoRow>
        <InfoBlock>
          <InfoLabel>지출 항목</InfoLabel>
          <InfoValue>{expense?.title ?? ''}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>카테고리</InfoLabel>
          <InfoValue>
            {expense?.category ? toDisplayCategory(expense.category) : ''}
          </InfoValue>
        </InfoBlock>
      </InfoRow>

      <InfoRow>
        <InfoBlock>
          <InfoLabel>결제자</InfoLabel>
          <InfoValue>{expense?.payer?.name ?? ''}</InfoValue>
        </InfoBlock>
        <InfoBlock>
          <InfoLabel>금액</InfoLabel>
          <InfoValue>{expense ? formatAmount(expense.amount) : ''}</InfoValue>
        </InfoBlock>
      </InfoRow>

      <Divider />

      <SectionTitle>정산 부담 금액</SectionTitle>

      <ShareList>
        {(expense?.shares ?? [])
          .slice()
          .sort((a, b) => b.amount - a.amount)
          .map((share) => (
            <ShareRow key={share.participantId}>
              <ShareName>{share.name}</ShareName>
              <ShareAmount>{formatAmount(share.amount)}</ShareAmount>
            </ShareRow>
          ))}
      </ShareList>

      {error && <ErrorText>{error}</ErrorText>}

      {(isPayer || canDelete) && (
        <ActionRow>
          {isPayer && (
            <EditButton
              type="button"
              onClick={() =>
                navigate(`/groups/${groupId}/expenses/${expenseId}/edit`)
              }
            >
              수정하기
            </EditButton>
          )}
          {canDelete && (
            <DeleteButton
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </DeleteButton>
          )}
        </ActionRow>
      )}
    </PageShell>
  );
}

export default ExpenseDetail;
