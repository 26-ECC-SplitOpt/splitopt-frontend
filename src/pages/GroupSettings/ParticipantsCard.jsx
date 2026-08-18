import styled from '@emotion/styled';
import { colors } from '../../styles/colors';
import { SettingsCard, CardLabel } from './shared';
import { XIcon } from './icons';

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

const MemberText = styled.p`
  margin: 0;
  flex: 1;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${colors.label};
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

function ParticipantsCard({
  participants,
  isEditingMembers,
  removingUserId,
  onToggleEdit,
  onRemoveParticipant,
}) {
  return (
    <SettingsCard>
      <CardLabel>참여자</CardLabel>
      <MembersRow>
        {isEditingMembers ? (
          <ChipList>
            {participants.map((p) => (
              <MemberChip key={p.userId}>
                {p.name}
                <RemoveChipButton
                  type="button"
                  aria-label={`${p.name} 삭제`}
                  onClick={() => onRemoveParticipant(p.userId)}
                  disabled={removingUserId === p.userId}
                >
                  <XIcon />
                </RemoveChipButton>
              </MemberChip>
            ))}
          </ChipList>
        ) : (
          <MemberText>{participants.map((p) => p.name).join(' ⋅ ')}</MemberText>
        )}
        <OutlineButton type="button" onClick={onToggleEdit}>
          {isEditingMembers ? '완료' : '수정'}
        </OutlineButton>
      </MembersRow>
    </SettingsCard>
  );
}

export default ParticipantsCard;
