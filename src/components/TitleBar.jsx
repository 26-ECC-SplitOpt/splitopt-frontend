import styled from '@emotion/styled';
import { colors } from '../styles/colors';

const TitleRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 22px;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: ${colors.body};
`;

const RightSlot = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
`;

function BackIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11 3.5L5.5 9L11 14.5"
        stroke={colors.body}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TitleBar({ title, onBack, rightAction, style }) {
  return (
    <TitleRow style={style}>
      <BackButton type="button" aria-label="뒤로 가기" onClick={onBack}>
        <BackIcon />
      </BackButton>
      <PageTitle>{title}</PageTitle>
      {rightAction && <RightSlot>{rightAction}</RightSlot>}
    </TitleRow>
  );
}

export default TitleBar;
