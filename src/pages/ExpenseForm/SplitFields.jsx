import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '../../styles/colors';
import {
  FieldGroup,
  FieldLabel,
  RadioRow,
  RadioOption,
  formatAmount,
  displayName,
} from './shared';
import { FilledCircle, HollowCircle } from './icons';

const ShareList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
`;

const ShareRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ShareName = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 13px;
  color: ${colors.body};
  width: 40px;
  flex-shrink: 0;
`;

const ShareAmountRow = styled.div`
  position: relative;
  flex: 1;
`;

const ShareInput = styled.input`
  width: 100%;
  height: 32px;
  padding: 0 30px 0 12px;
  border: 1px solid rgba(69, 75, 96, 0.35);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: ${colors.body};
  outline: none;
  box-sizing: border-box;
  text-align: right;

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ShareUnit = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: rgba(28, 30, 34, 0.5);
`;

const EqualShareValue = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: rgba(28, 30, 34, 0.6);
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
`;

const ValidationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  animation: ${(props) => (props.shakeTrigger > 0 ? shake : 'none')} 0.4s ease;
`;

const ValidationText = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 10px;
  color: ${(props) => (props.ok ? '#12b100' : colors.error)};
`;

const ValidationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
  transform: translateY(2px);
  color: ${(props) => (props.ok ? '#12b100' : colors.error)};
`;

function SplitFields({
  splitMode,
  onSplitModeChange,
  activeParticipants,
  equalShareByParticipantId,
  manualAmounts,
  onManualAmountChange,
  isManualValid,
  allManualFilled,
  shakeTrigger,
}) {
  return (
    <FieldGroup>
      <FieldLabel>정산 방법</FieldLabel>
      <RadioRow>
        <RadioOption type="button" onClick={() => onSplitModeChange('EQUAL')}>
          {splitMode === 'EQUAL' ? <FilledCircle /> : <HollowCircle />}
          균등 분담
        </RadioOption>
        <RadioOption
          type="button"
          onClick={() => onSplitModeChange('DIRECT')}
        >
          {splitMode === 'DIRECT' ? <FilledCircle /> : <HollowCircle />}
          직접 입력
        </RadioOption>
      </RadioRow>

      <ShareList>
        {activeParticipants.map((p) => (
          <ShareRow key={p.participantId}>
            <ShareName>{displayName(p)}</ShareName>
            {splitMode === 'EQUAL' ? (
              <EqualShareValue>
                {formatAmount(equalShareByParticipantId[p.participantId] ?? 0)}
              </EqualShareValue>
            ) : (
              <ShareAmountRow>
                <ShareInput
                  type="number"
                  min="0"
                  value={manualAmounts[p.participantId] ?? ''}
                  onChange={(event) =>
                    onManualAmountChange(p.participantId, event.target.value)
                  }
                />
                <ShareUnit>원</ShareUnit>
              </ShareAmountRow>
            )}
          </ShareRow>
        ))}
      </ShareList>

      {splitMode === 'DIRECT' && allManualFilled && (
        <ValidationRow key={shakeTrigger} shakeTrigger={shakeTrigger}>
          <ValidationBadge ok={isManualValid}>*</ValidationBadge>
          <ValidationText ok={isManualValid}>
            {isManualValid
              ? '입력한 금액이 결제 금액과 일치합니다.'
              : '입력한 금액의 합이 결제 금액과 다릅니다.'}
          </ValidationText>
        </ValidationRow>
      )}
    </FieldGroup>
  );
}

export default SplitFields;
