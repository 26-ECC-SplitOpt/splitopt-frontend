import styled from '@emotion/styled';
import Loading from '../../components/Loading';
import { colors } from '../../styles/colors';
import {
  EmptyWrap,
  EmptyMessage,
  StatCard,
  StatCardTitle,
  SummaryRow,
  SummaryLabel,
  SummaryValue,
  formatAmount,
  toRatio,
} from './shared';

const CATEGORY_COLORS = {
  식비: '#BC97DF',
  교통: '#B0DF97',
  숙박: '#97CCDF',
  쇼핑: '#DF97B1',
  활동: '#F8D2A8',
  기타: '#A0A6B1',
};

function getCategoryColor(category) {
  return CATEGORY_COLORS[category];
}

const StatsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const ChartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const CategoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CategoryLabel = styled.span`
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: ${colors.body};
`;

const ColorDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
  background-color: ${(props) => props.color};
`;

const CategoryValue = styled.span`
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ParticipantRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ParticipantName = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: ${colors.body};
`;

const ParticipantValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

function DonutChart({ segments }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce((acc, segment) => {
    const dash = (segment.ratio / 100) * circumference;
    const offset =
      acc.length > 0
        ? acc[acc.length - 1].offset + acc[acc.length - 1].dash
        : 0;
    return [...acc, { ...segment, dash, offset }];
  }, []);

  return (
    <svg width="80" height="80" viewBox="0 0 110 110" aria-hidden="true">
      <g transform="rotate(-90 55 55)">
        {arcs.map((segment) => (
          <circle
            key={segment.category}
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="16"
            strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
            strokeDashoffset={-segment.offset}
          />
        ))}
      </g>
    </svg>
  );
}

function StatsTab({ isLoading, summary, categories, participants, memberCount }) {
  if (isLoading) {
    return (
      <EmptyWrap>
        <Loading />
      </EmptyWrap>
    );
  }

  const categorySegments = categories.map((item) => ({
    ...item,
    ratio: toRatio(item.amount, summary.totalAmount),
    color: getCategoryColor(item.category),
  }));

  return (
    <StatsWrap>
      <StatCard>
        <StatCardTitle>전체 요약</StatCardTitle>
        <SummaryRow>
          <SummaryLabel>총 지출 금액</SummaryLabel>
          <SummaryValue>{formatAmount(summary.totalAmount)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>총 지출 건수</SummaryLabel>
          <SummaryValue>{summary.expenseCount}건</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>참여 인원</SummaryLabel>
          <SummaryValue>{memberCount}명</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>1인당 평균</SummaryLabel>
          <SummaryValue>{formatAmount(summary.averagePerPerson)}</SummaryValue>
        </SummaryRow>
      </StatCard>

      <StatCard>
        <StatCardTitle>카테고리별 지출</StatCardTitle>
        {categories.length > 0 ? (
          <ChartRow>
            <DonutChart segments={categorySegments} />
            <CategoryList>
              {categorySegments.map((item) => (
                <CategoryRow key={item.category}>
                  <CategoryLabel>
                    <ColorDot color={item.color} />
                    {item.category}
                  </CategoryLabel>
                  <CategoryValue>
                    {formatAmount(item.amount)} ({item.ratio}%)
                  </CategoryValue>
                </CategoryRow>
              ))}
            </CategoryList>
          </ChartRow>
        ) : (
          <EmptyMessage>지출 내역이 없습니다.</EmptyMessage>
        )}
      </StatCard>

      <StatCard>
        <StatCardTitle>참여자별 지출</StatCardTitle>
        {participants.length > 0 ? (
          <ParticipantList>
            {participants.map((item) => (
              <ParticipantRow key={item.userId ?? item.name}>
                <ParticipantName>{item.name}</ParticipantName>
                <ParticipantValue>
                  {formatAmount(item.paidAmount)} (
                  {toRatio(item.paidAmount, summary.totalAmount)}%)
                </ParticipantValue>
              </ParticipantRow>
            ))}
          </ParticipantList>
        ) : (
          <EmptyMessage>참여자 정보가 없습니다.</EmptyMessage>
        )}
      </StatCard>
    </StatsWrap>
  );
}

export default StatsTab;
