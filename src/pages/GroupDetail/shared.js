import styled from '@emotion/styled';
import { colors } from '../../styles/colors';

// 지출/통계/일정/예산 탭이 공통으로 쓰는 스타일 컴포넌트와 헬퍼.
export const EmptyWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
`;

export const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

export const StatCard = styled.div`
  padding: 20px;
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  box-sizing: border-box;
`;

export const StatCardTitle = styled.p`
  margin: 0 0 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
`;

export const SummaryLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

export const SummaryValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

export const AddActionButton = styled.button`
  margin-top: 24px;
  height: 45px;
  border: none;
  border-radius: 12px;
  background-color: ${colors.body};
  color: ${colors.white};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export function formatAmount(amount) {
  return `${(amount ?? 0).toLocaleString('ko-KR')}원`;
}

// 백엔드 ratio 필드를 믿지 않고 프론트에서 직접 계산한다.
export function toRatio(amount, total) {
  return total > 0 ? Math.round((amount / total) * 1000) / 10 : 0;
}
