import styled from '@emotion/styled';
import { colors } from '../../styles/colors';

// 지출 등록/수정 폼의 여러 섹션(정산 부담자 선택, 정산 방법)이 공통으로
// 쓰는 스타일 컴포넌트와 헬퍼.
export const FieldGroup = styled.div`
  margin-bottom: 26px;
`;

export const FieldLabel = styled.p`
  margin: 0 0 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: rgba(28, 30, 34, 0.82);
`;

export const RadioRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 14px;
`;

export const RadioOption = styled.button`
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

export function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function displayName(participant) {
  return participant.name;
}

// 서버는 shares[].amount를 그대로 저장하고 Σ(shares.amount) === amount만
// 검증하므로, 균등 분담도 프론트가 미리 나눠서 명시적으로 보낸다. 나머지 금액은
// 결제자가 우선으로 받고, 결제자가 부담자 목록에 없으면 첫 번째 참여자가 받는다.
export function computeEqualShares(participants, amount, payerParticipantId) {
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
