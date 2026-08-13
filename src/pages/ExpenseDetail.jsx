import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';
import { getCurrentUser } from '../utils/auth';

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
  padding: 56px 24px 30px;
  box-sizing: border-box;
`;

const InfoRow = styled.div`
  display: flex;
  margin-top: 28px;

  &:first-of-type {
    margin-top: 52px;
  }
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
  margin-top: 34px;
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
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchExpense() {
      const [groupResponse, expenseResponse] = await Promise.all([
        fetch(`/api/groups/${groupId}`),
        fetch(`/api/groups/${groupId}/expenses/${expenseId}`),
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
        }
        if (result.success) setExpense(result.data);
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
  // payer가 null이면 결제자가 모임을 탈퇴해 참여자 목록에서 빠졌다는 뜻 —
  // 이 경우에만 owner가 대신 삭제할 수 있다.
  const payerWithdrawn = Boolean(expense) && !expense.payer;
  const canDelete = isPayer || (isOwner && payerWithdrawn);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(
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
    <Page>
      <Header />

      <Content>
        <TitleBar
          title="지출 상세"
          onBack={() => navigate(`/groups/${groupId}`)}
        />

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
            <InfoValue>{expense?.category ?? ''}</InfoValue>
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
          {(expense?.shares ?? []).map((share) => (
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
      </Content>
    </Page>
  );
}

export default ExpenseDetail;
