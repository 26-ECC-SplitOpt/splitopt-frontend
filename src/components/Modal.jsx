import styled from '@emotion/styled';
import { colors } from '../styles/colors';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.45);
  box-sizing: border-box;
  z-index: 100;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 342px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px 24px 24px;
  background-color: ${colors.white};
  border-radius: 20px;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`;

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 2.5L13.5 13.5M13.5 2.5L2.5 13.5"
        stroke={colors.body}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Modal({ onClose, children }) {
  return (
    <Overlay onClick={onClose}>
      <Card onClick={(event) => event.stopPropagation()}>
        <CloseButton type="button" aria-label="닫기" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        {children}
      </Card>
    </Overlay>
  );
}

export default Modal;
