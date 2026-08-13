import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';

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
  padding: 46px 24px 40px;
  box-sizing: border-box;
`;

const Section = styled.div`
  margin-top: 32px;

  &:first-of-type {
    margin-top: 30px;
  }
`;

const SectionTitle = styled.p`
  margin: 0 0 16px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 17px;
  color: ${colors.body};
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 20px;
  background-color: #f4f5f8;
  border-radius: 14px;
  box-sizing: border-box;
  min-height: 62px;
  justify-content: center;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ItemName = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemAmount = styled.span`
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const Badge = styled.button`
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 10px;
  border: none;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 10px;
  white-space: nowrap;
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};

  &:hover {
    opacity: ${(props) => (props.clickable ? 0.85 : 1)};
  }
`;

const PendingBadge = styled(Badge)`
  background-color: rgba(255, 40, 40, 0.12);
  color: #ff2828;
`;

const SentBadge = styled(Badge)`
  background-color: rgba(18, 177, 0, 0.12);
  color: #12b100;
`;

const EmptyText = styled.p`
  margin: 0;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.accent};
`;

const BackButtonBar = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  margin-top: auto;
  padding-top: 32px;
  border: none;
  background: none;
  cursor: pointer;
`;

const BackButtonInner = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 309px;
  height: 45px;
  background-color: ${colors.body};
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${colors.white};
`;

function formatAmount(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

function MySettlement() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [toSend, setToSend] = useState([]);
  const [toReceive, setToReceive] = useState([]);
  const [completed, setCompleted] = useState([]);

  const applySettlementsMe = (data) => {
    setToSend(data.toSend);
    setToReceive(data.toReceive);
    setCompleted(data.completed);
  };

  useEffect(() => {
    let ignore = false;

    async function fetchSettlements() {
      const response = await fetch(`/api/groups/${groupId}/settlements/me`);
      const result = await response.json();

      if (!ignore && result.success) {
        applySettlementsMe(result.data);
      }
    }

    fetchSettlements();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  async function updateStatus(settlementId, action) {
    const response = await fetch(
      `/api/groups/${groupId}/settlements/${settlementId}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      },
    );
    const result = await response.json();

    if (result.success) {
      // SEND/CONFIRM으로 상태가 바뀌면 보낼/받을/완료 목록 간 이동이 필요해서
      // 단일 항목만 patch하지 않고 /me를 다시 불러온다.
      const refetchResponse = await fetch(
        `/api/groups/${groupId}/settlements/me`,
      );
      const refetchResult = await refetchResponse.json();

      if (refetchResult.success) {
        applySettlementsMe(refetchResult.data);
      }
    }
  }

  return (
    <Page>
      <Header />

      <Content>
        <TitleBar title="내 정산 확인" onBack={() => navigate(-1)} />

        <Section>
          <SectionTitle>내가 보낼 내역</SectionTitle>
          {toSend.length > 0 ? (
            <Box>
              {toSend.map((item) => (
                <ItemRow key={item.settlementId}>
                  <ItemName>{item.counterpartName}</ItemName>
                  <ItemRight>
                    <ItemAmount>{formatAmount(item.amount)}</ItemAmount>
                    {item.status === 'SENT' ? (
                      <SentBadge
                        type="button"
                        clickable
                        onClick={() =>
                          updateStatus(item.settlementId, 'CANCEL')
                        }
                      >
                        송금 완료/취소
                      </SentBadge>
                    ) : (
                      <PendingBadge
                        type="button"
                        clickable
                        onClick={() => updateStatus(item.settlementId, 'SEND')}
                      >
                        송금 전
                      </PendingBadge>
                    )}
                  </ItemRight>
                </ItemRow>
              ))}
            </Box>
          ) : (
            <Box>
              <EmptyText>내가 보낼 내역이 없습니다.</EmptyText>
            </Box>
          )}
        </Section>

        <Section>
          <SectionTitle>내가 받을 내역</SectionTitle>
          {toReceive.length > 0 ? (
            <Box>
              {toReceive.map((item) => (
                <ItemRow key={item.settlementId}>
                  <ItemName>{item.counterpartName}</ItemName>
                  <ItemRight>
                    <ItemAmount>{formatAmount(item.amount)}</ItemAmount>
                    {item.status === 'SENT' ? (
                      <SentBadge
                        type="button"
                        clickable
                        onClick={() =>
                          updateStatus(item.settlementId, 'CONFIRM')
                        }
                      >
                        송금 확인
                      </SentBadge>
                    ) : (
                      <PendingBadge type="button" disabled>
                        미송금
                      </PendingBadge>
                    )}
                  </ItemRight>
                </ItemRow>
              ))}
            </Box>
          ) : (
            <Box>
              <EmptyText>내가 받을 내역이 없습니다.</EmptyText>
            </Box>
          )}
        </Section>

        <Section>
          <SectionTitle>정산 완료 내역</SectionTitle>
          {completed.length > 0 ? (
            <Box>
              {completed.map((item) => (
                <ItemRow key={item.settlementId}>
                  <ItemName>{item.counterpartName}</ItemName>
                  <ItemAmount>{formatAmount(item.amount)}</ItemAmount>
                </ItemRow>
              ))}
            </Box>
          ) : (
            <Box>
              <EmptyText>정산 완료 내역이 없습니다.</EmptyText>
            </Box>
          )}
        </Section>

        <BackButtonBar onClick={() => navigate(-1)}>
          <BackButtonInner>돌아가기</BackButtonInner>
        </BackButtonBar>
      </Content>
    </Page>
  );
}

export default MySettlement;
