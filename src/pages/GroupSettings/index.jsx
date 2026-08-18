import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import TitleBar from '../../components/TitleBar';
import PageShell from '../../components/PageShell';
import { SubmitButton, ErrorText } from '../../styles/authForm';
import { apiFetch } from '../../utils/api';
import { CardList } from './shared';
import { TrashIcon } from './icons';
import InviteCodeCard from './InviteCodeCard';
import EditableFieldCard from './EditableFieldCard';
import ParticipantsCard from './ParticipantsCard';

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

function GroupSettings() {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyLabel, setCopyLabel] = useState('복사');
  const [isReissuing, setIsReissuing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [isInviteExpired, setIsInviteExpired] = useState(false);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessError, setAccessError] = useState('');
  const nameInputRef = useRef(null);
  const memoInputRef = useRef(null);

  const handleRemoveParticipant = async (userId) => {
    if (removingUserId) return;

    setRemovingUserId(userId);
    setError('');

    try {
      const response = await apiFetch(
        `/api/groups/${groupId}/participants/${userId}`,
        { method: 'DELETE' },
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '참여자를 삭제하지 못했습니다.');
        return;
      }

      setParticipants((prev) => prev.filter((p) => p.userId !== userId));
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setRemovingUserId(null);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function fetchGroup() {
      const response = await apiFetch(`/api/groups/${groupId}`);
      const result = await response.json();

      if (!ignore) {
        if (result.success) {
          setGroup(result.data);
          setName(result.data.name);
          setDescription(result.data.description ?? '');
          setParticipants(result.data.participants ?? []);
          setIsInviteExpired(
            result.data.inviteExpiresAt
              ? new Date(result.data.inviteExpiresAt).getTime() < Date.now()
              : false,
          );
        } else if (response.status === 403) {
          setAccessError('이 모임에 접근할 권한이 없어요.');
        } else if (response.status === 404) {
          setAccessError('모임을 찾을 수 없어요.');
        }
        setIsLoading(false);
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

  const handleReissueCode = async () => {
    if (isReissuing) return;

    setIsReissuing(true);
    setError('');

    try {
      const response = await apiFetch(`/api/groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '초대 코드 재발급에 실패했습니다.');
        return;
      }

      setGroup((prev) => ({
        ...prev,
        inviteCode: result.data.inviteCode,
        inviteExpiresAt: result.data.expiresAt,
      }));
      setCopyLabel('복사');
      setIsInviteExpired(false);
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsReissuing(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
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

    setError('');

    try {
      const response = await apiFetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message ?? '모임을 삭제하지 못했습니다.');
        return;
      }

      navigate('/groups');
    } catch {
      setError('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <PageShell
      isLoading={isLoading}
      accessError={accessError}
      contentPadding="43px 24px 40px"
      titleBar={
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
      }
    >
      <form onSubmit={handleSave}>
        <CardList>
          <InviteCodeCard
            inviteCode={group?.inviteCode}
            isInviteExpired={isInviteExpired}
            isReissuing={isReissuing}
            copyLabel={copyLabel}
            onCopy={handleCopyCode}
            onReissue={handleReissueCode}
          />

          <EditableFieldCard
            label="모임 이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            inputRef={nameInputRef}
            ariaLabel="모임 이름 수정"
          />

          <EditableFieldCard
            label="메모"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="메모를 입력하세요"
            inputRef={memoInputRef}
            ariaLabel="메모 수정"
          />

          <ParticipantsCard
            participants={participants}
            isEditingMembers={isEditingMembers}
            removingUserId={removingUserId}
            onToggleEdit={() => setIsEditingMembers((prev) => !prev)}
            onRemoveParticipant={handleRemoveParticipant}
          />
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
    </PageShell>
  );
}

export default GroupSettings;
