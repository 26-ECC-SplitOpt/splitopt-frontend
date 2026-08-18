import styled from '@emotion/styled';
import { colors } from '../../styles/colors';
import { FieldGroup, FieldLabel, RadioRow, RadioOption, displayName } from './shared';
import { FilledCircle, HollowCircle } from './icons';

const MemberGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
`;

const MemberOption = styled.button`
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

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

function ParticipantSelector({
  groupParticipants,
  selectionMode,
  onSelectionModeChange,
  selectedParticipantIds,
  activeParticipantIds,
  onToggleMember,
}) {
  return (
    <FieldGroup>
      <FieldLabel>정산 부담자</FieldLabel>
      <RadioRow>
        <RadioOption
          type="button"
          onClick={() => onSelectionModeChange('ALL')}
        >
          {selectionMode === 'ALL' ? <FilledCircle /> : <HollowCircle />}
          모두 ({groupParticipants.length}명)
        </RadioOption>
        <RadioOption
          type="button"
          onClick={() => onSelectionModeChange('PARTIAL')}
        >
          {selectionMode === 'PARTIAL' ? <FilledCircle /> : <HollowCircle />}
          일부 선택 ({selectedParticipantIds.length}명)
        </RadioOption>
      </RadioRow>

      <MemberGrid>
        {groupParticipants.map((p) => (
          <MemberOption
            key={p.participantId}
            type="button"
            disabled={selectionMode === 'ALL'}
            onClick={() => onToggleMember(p.participantId)}
          >
            {activeParticipantIds.includes(p.participantId) ? (
              <FilledCircle />
            ) : (
              <HollowCircle />
            )}
            {displayName(p)}
          </MemberOption>
        ))}
      </MemberGrid>
    </FieldGroup>
  );
}

export default ParticipantSelector;
