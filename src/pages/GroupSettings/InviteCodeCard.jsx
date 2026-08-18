import styled from '@emotion/styled';
import { colors } from '../../styles/colors';
import { SettingsCard, CardLabel, Row } from './shared';

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

function InviteCodeCard({
  inviteCode,
  isInviteExpired,
  isReissuing,
  copyLabel,
  onCopy,
  onReissue,
}) {
  return (
    <SettingsCard>
      <CardLabel>초대 코드 생성</CardLabel>
      <Row>
        <CodeBox>{inviteCode ?? ''}</CodeBox>
        <CopyButton
          type="button"
          onClick={isInviteExpired ? onReissue : onCopy}
          disabled={isReissuing}
        >
          {isInviteExpired ? (isReissuing ? '재발급 중...' : '재발급') : copyLabel}
        </CopyButton>
      </Row>
    </SettingsCard>
  );
}

export default InviteCodeCard;
