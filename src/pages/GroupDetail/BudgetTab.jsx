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
  AddActionButton,
  formatAmount,
} from './shared';

const BudgetWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
`;

const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const EditLinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  text-decoration: underline;
`;

const ProgressTrack = styled.div`
  height: 8px;
  margin-top: 12px;
  border-radius: 999px;
  background-color: rgba(69, 75, 96, 0.12);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  width: ${(props) => Math.min(props.rate ?? 0, 100)}%;
  background-color: ${(props) =>
    (props.rate ?? 0) >= 100
      ? colors.error
      : (props.rate ?? 0) >= 80
        ? '#f5a623'
        : colors.body};
`;

const ForecastBanner = styled.div`
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.warning ? 'rgba(255, 40, 40, 0.1)' : 'rgba(18, 177, 0, 0.1)'};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: ${(props) => (props.warning ? colors.error : '#12b100')};
`;

function BudgetTab({ isLoading, budget, forecast, memberCount, onOpenBudgetModal }) {
  if (isLoading) {
    return (
      <EmptyWrap>
        <Loading />
      </EmptyWrap>
    );
  }

  if (!budget?.budgetType) {
    return (
      <BudgetWrap>
        <EmptyMessage>아직 예산이 설정되지 않았습니다.</EmptyMessage>
        <AddActionButton type="button" onClick={onOpenBudgetModal}>
          + 예산 설정하기
        </AddActionButton>
      </BudgetWrap>
    );
  }

  return (
    <BudgetWrap>
      <StatCard>
        <StatCardHeader>
          <StatCardTitle style={{ margin: 0 }}>예산 현황</StatCardTitle>
          <EditLinkButton type="button" onClick={onOpenBudgetModal}>
            수정
          </EditLinkButton>
        </StatCardHeader>

        <SummaryRow>
          <SummaryLabel>총 예산</SummaryLabel>
          <SummaryValue>{formatAmount(budget.totalBudget)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>1인당 금액</SummaryLabel>
          <SummaryValue>
            {formatAmount(
              budget.budgetPerPerson ??
                Math.floor((budget.totalBudget ?? 0) / (memberCount || 1)),
            )}
          </SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>지출</SummaryLabel>
          <SummaryValue>{formatAmount(budget.spent)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>남은 예산</SummaryLabel>
          <SummaryValue>{formatAmount(budget.remaining)}</SummaryValue>
        </SummaryRow>

        <ProgressTrack>
          <ProgressFill rate={budget.usageRate} />
        </ProgressTrack>
        <SummaryRow style={{ padding: '6px 0 0' }}>
          <SummaryLabel>사용률</SummaryLabel>
          <SummaryLabel>{budget.usageRate}%</SummaryLabel>
        </SummaryRow>
      </StatCard>

      {forecast && (
        <StatCard>
          <StatCardTitle>예산 초과 예측</StatCardTitle>

          {forecast.willExceed === null ? (
            <EmptyMessage>
              아직 일정이 없거나, 등록된 일정이 시작 전이라 예측할 수 없어요.
              일정이 시작되면 지출 속도를 기준으로 예측을 보여드려요.
            </EmptyMessage>
          ) : (
            <>
              {forecast.spentBeforePeriod > 0 && (
                <SummaryRow>
                  <SummaryLabel>여행 전 지출</SummaryLabel>
                  <SummaryValue>
                    {formatAmount(forecast.spentBeforePeriod)}
                  </SummaryValue>
                </SummaryRow>
              )}
              <SummaryRow>
                <SummaryLabel>일 평균 지출(여행 중)</SummaryLabel>
                <SummaryValue>
                  {formatAmount(forecast.dailyAverage)}
                </SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <SummaryLabel>예상 총 지출</SummaryLabel>
                <SummaryValue>
                  {formatAmount(forecast.projectedTotal)}
                </SummaryValue>
              </SummaryRow>

              <ForecastBanner warning={forecast.willExceed}>
                {forecast.willExceed
                  ? `이대로면 예산을 ${formatAmount(forecast.projectedOverage)} 초과할 것으로 예상돼요.`
                  : '지금 추세라면 예산 안에서 마무리될 것 같아요.'}
              </ForecastBanner>
            </>
          )}
        </StatCard>
      )}
    </BudgetWrap>
  );
}

export default BudgetTab;
