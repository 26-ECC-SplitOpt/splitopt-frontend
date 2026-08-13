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

const SectionTitle = styled.p`
  margin: 37px 0 20px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.body};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 69px;
  padding: 0 20px;
  background-color: #f4f5f8;
  border-radius: 14px;
  box-sizing: border-box;
`;

const RowNames = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RowText = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const DoneBadge = styled.span`
  padding: 4px 10px;
  border-radius: 10px;
  background-color: rgba(18, 177, 0, 0.12);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 10px;
  color: #12b100;
  white-space: nowrap;
`;

const RowAmount = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: ${colors.body};
`;

const EmptyWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
`;

const CheckButton = styled.button`
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

const CheckButtonInner = styled.span`
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

function SettleResult() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [settlements, setSettlements] = useState([]);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      const [groupRes, settlementsRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`),
        fetch(`/api/groups/${groupId}/settlements`),
      ]);
      const groupResult = await groupRes.json();
      const settlementsResult = await settlementsRes.json();

      if (!ignore) {
        if (groupResult.success) setGroupName(groupResult.data.name);
        if (settlementsResult.success) {
          setSettlements(settlementsResult.data.settlements);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const hasSettlements = settlements.length > 0;

  return (
    <Page>
      <Header />

      <Content>
        <TitleBar title="정산 결과 조회" onBack={() => navigate(-1)} />

        <SectionTitle>
          {groupName ? `${groupName} 정산 목록` : '정산 목록'}
        </SectionTitle>

        {hasSettlements ? (
          <List>
            {settlements.map((settlement) => (
              <Row key={settlement.id}>
                <RowNames>
                  <RowText>
                    {settlement.from} → {settlement.to}
                  </RowText>
                  {settlement.status === 'CONFIRMED' && (
                    <DoneBadge>정산 완료</DoneBadge>
                  )}
                </RowNames>
                <RowAmount>
                  {settlement.amount.toLocaleString('ko-KR')}원
                </RowAmount>
              </Row>
            ))}
          </List>
        ) : (
          <EmptyWrap>
            <EmptyMessage>정산할 내역이 없습니다.</EmptyMessage>
          </EmptyWrap>
        )}

        <CheckButton onClick={() => navigate(`/groups/${groupId}/settle/me`)}>
          <CheckButtonInner>내 정산 확인하기</CheckButtonInner>
        </CheckButton>
      </Content>
    </Page>
  );
}

export default SettleResult;
