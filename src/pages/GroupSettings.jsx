import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import Header from '../components/Header';
import TitleBar from '../components/TitleBar';
import { colors } from '../styles/colors';
import { Input, SubmitButton, ErrorText } from '../styles/authForm';

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
  width: 100%;
  max-width: 342px;
  margin: 0 auto;
  padding: 43px 24px 40px;
  box-sizing: border-box;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
  margin-top: 37px;
`;

const SettingsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 24px;
  border: 1px solid rgba(173, 173, 173, 0.4);
  border-radius: 16px;
  box-sizing: border-box;
`;

const CardLabel = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: ${colors.label};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CodeBox = styled.div`
  flex: 1;
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border: 1px solid ${colors.accent};
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
`;

const CopyButton = styled.button`
  flex-shrink: 0;
  height: 34px;
  padding: 0 18px;
  background-color: ${colors.body};
  color: ${colors.white};
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }
`;

const OutlineButton = styled.button`
  flex-shrink: 0;
  height: 34px;
  padding: 0 18px;
  background: none;
  border: 1px solid rgba(173, 173, 173, 0.6);
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #888b95;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: rgba(173, 173, 173, 0.1);
  }
`;

const EditableInput = styled(Input)`
  height: 34px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
`;

const IconButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const MemberText = styled.p`
  margin: 0;
  flex: 1;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.label};
`;

const MembersRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
`;

const MemberChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 6px 6px 12px;
  border: 1px solid rgba(173, 173, 173, 0.5);
  border-radius: 999px;
  background-color: rgba(173, 173, 173, 0.08);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: ${colors.label};
`;

const RemoveChipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  padding: 0;
  background-color: rgba(173, 173, 173, 0.3);
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background-color: rgba(173, 173, 173, 0.5);
  }
`;

const TrashButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 5.5H16.5"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7.5 5.5V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5.5L6.2 16a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9l.7-10.5"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 8.5V14"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.7 8.5V14"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.5 2.5L15.5 6.5L6 16H2V12L11.5 2.5Z"
        stroke={colors.accent}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path
        d="M1 1L7 7M7 1L1 7"
        stroke={colors.body}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GroupSettings() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyLabel, setCopyLabel] = useState('복사');
  const [members, setMembers] = useState([]);
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const nameInputRef = useRef(null);
  const memoInputRef = useRef(null);

  const removeMemberAt = (index) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const focusNameInput = () => {
    nameInputRef.current?.focus();
  };

  const focusMemoInput = () => {
    memoInputRef.current?.focus();
  };

  useEffect(() => {
    let ignore = false;

    async function fetchGroup() {
      const response = await fetch(`/api/groups/${groupId}`);
      const result = await response.json();

      if (!ignore && result.success) {
        setGroup(result.data);
        setName(result.data.name);
        setMemo(result.data.memo ?? '');
        setMembers(result.data.members ?? []);
      }
    }

    fetchGroup();

    return () => {
      ignore = true;
    };
  }, [groupId]);

  const handleCopyCode = async () => {
    if (!group?.inviteCode) return;

    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopyLabel('복사됨');
      setTimeout(() => setCopyLabel('복사'), 1500);
    } catch {
      setError('초대 코드 복사에 실패했습니다.');
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, memo, members }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '변경에 실패했습니다.');
        return;
      }

      navigate(`/groups/${groupId}`);
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      '모임을 삭제하면 되돌릴 수 없습니다. 삭제하시겠어요?',
    );

    if (!confirmed) return;

    await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
    navigate('/groups');
  };

  return (
    <Page>
      <Header />

      <Content>
        <TitleBar
          title="모임 설정"
          onBack={() => navigate(-1)}
          rightAction={
            <TrashButton
              type="button"
              aria-label="모임 삭제"
              onClick={handleDelete}
            >
              <TrashIcon />
            </TrashButton>
          }
        />

        <form onSubmit={handleSave}>
          <CardList>
            <SettingsCard>
              <CardLabel>초대 코드 생성</CardLabel>
              <Row>
                <CodeBox>{group?.inviteCode ?? ''}</CodeBox>
                <CopyButton type="button" onClick={handleCopyCode}>
                  {copyLabel}
                </CopyButton>
              </Row>
            </SettingsCard>

            <SettingsCard>
              <CardLabel>모임 이름</CardLabel>
              <Row>
                <EditableInput
                  ref={nameInputRef}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <IconButton
                  type="button"
                  aria-label="모임 이름 수정"
                  onClick={focusNameInput}
                >
                  <EditIcon />
                </IconButton>
              </Row>
            </SettingsCard>

            <SettingsCard>
              <CardLabel>메모</CardLabel>
              <Row>
                <EditableInput
                  ref={memoInputRef}
                  placeholder="메모를 입력하세요"
                  value={memo}
                  onChange={(event) => setMemo(event.target.value)}
                />
                <IconButton
                  type="button"
                  aria-label="메모 수정"
                  onClick={focusMemoInput}
                >
                  <EditIcon />
                </IconButton>
              </Row>
            </SettingsCard>

            <SettingsCard>
              <CardLabel>참여자</CardLabel>
              <MembersRow>
                {isEditingMembers ? (
                  <ChipList>
                    {members.map((member, index) => (
                      <MemberChip key={`${member}-${index}`}>
                        {member}
                        <RemoveChipButton
                          type="button"
                          aria-label={`${member} 삭제`}
                          onClick={() => removeMemberAt(index)}
                        >
                          <XIcon />
                        </RemoveChipButton>
                      </MemberChip>
                    ))}
                  </ChipList>
                ) : (
                  <MemberText>{members.join(' ⋅ ')}</MemberText>
                )}
                <OutlineButton
                  type="button"
                  onClick={() => setIsEditingMembers((prev) => !prev)}
                >
                  {isEditingMembers ? '완료' : '수정'}
                </OutlineButton>
              </MembersRow>
            </SettingsCard>
          </CardList>

          {error && (
            <ErrorText style={{ margin: '20px 0 0' }}>{error}</ErrorText>
          )}

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            style={{ marginTop: '86px' }}
          >
            {isSubmitting ? '변경 중...' : '변경하기'}
          </SubmitButton>
        </form>
      </Content>
    </Page>
  );
}

export default GroupSettings;
