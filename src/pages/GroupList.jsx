import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { ChevronRightIcon } from '../components/icons';
import { colors } from '../styles/colors';
import { apiFetch } from '../utils/api';
import { Page, Content } from '../styles/layout';
import GroupCreate from './GroupCreate';
import InviteJoin from './InviteJoin';

const STATUS_META = {
  NOT_STARTED: {
    label: '정산 전',
    color: '#FF2828',
    background: 'rgba(255, 40, 40, 0.12)',
  },
  IN_PROGRESS: {
    label: '정산 중',
    color: '#9F0EFF',
    background: 'rgba(159, 14, 255, 0.12)',
  },
  DONE: {
    label: '정산 완료',
    color: '#12B100',
    background: 'rgba(18, 177, 0, 0.12)',
  },
};

const Title = styled.h1`
  margin: 0;
  margin-bottom: ${(props) => (props.hasGroups ? '29px' : '217px')};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${colors.body};
`;

const EmptyMessage = styled.p`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  color: ${colors.body};
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Card = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 32px 24px 32px 28px;
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  text-decoration: none;
  cursor: pointer;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardTitle = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  color: ${colors.label};
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.label};
`;

const CardRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
`;

const ChevronWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 21px;
  margin-top: ${(props) => (props.hasGroups ? '38px' : '32px')};
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 52px;
  background-color: ${colors.body};
  color: ${colors.white};
  border: none;
  border-radius: 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    opacity: 0.9;
  }
`;

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchGroups() {
      try {
        const response = await apiFetch(`/api/groups`);
        const result = await response.json();

        if (!ignore && result.success) {
          setGroups(result.data.groups);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchGroups();

    return () => {
      ignore = true;
    };
  }, []);

  async function refetchGroups() {
    const response = await apiFetch(`/api/groups`);
    const result = await response.json();

    if (result.success) {
      setGroups(result.data.groups);
    }
  }

  const hasGroups = groups.length > 0;

  return (
    <Page>
      <Header />

      <Content padding="50px 24px 40px">
        <Title hasGroups={hasGroups}>내 모임</Title>

        {isLoading && <Loading />}

        {!isLoading && !hasGroups && (
          <EmptyMessage>
            모임 목록이 비었습니다. <br />
            새로운 모임에 참여해보세요!
          </EmptyMessage>
        )}

        {hasGroups && (
          <CardList>
            {groups.map((group) => {
              const status = STATUS_META[group.settlementStatus];

              return (
                <Card key={group.groupId} to={`/groups/${group.groupId}`}>
                  <CardInfo>
                    <CardTitle>{group.name}</CardTitle>
                    <CardSubtitle>
                      참여 인원 {group.participantCount}명
                    </CardSubtitle>
                  </CardInfo>
                  <CardRight>
                    <StatusBadge
                      style={{
                        backgroundColor: status.background,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </StatusBadge>
                    <ChevronWrapper>
                      <ChevronRightIcon />
                    </ChevronWrapper>
                  </CardRight>
                </Card>
              );
            })}
          </CardList>
        )}

        <ActionRow hasGroups={hasGroups}>
          <ActionButton type="button" onClick={() => setActiveModal('create')}>
            + 새 모임 생성하기
          </ActionButton>
          <ActionButton type="button" onClick={() => setActiveModal('join')}>
            초대 코드 입력
          </ActionButton>
        </ActionRow>
      </Content>

      {activeModal === 'create' && (
        <GroupCreate
          onClose={() => setActiveModal(null)}
          onCreated={async () => {
            setActiveModal(null);
            await refetchGroups();
          }}
        />
      )}

      {activeModal === 'join' && (
        <InviteJoin onClose={() => setActiveModal(null)} />
      )}
    </Page>
  );
}

export default GroupList;
