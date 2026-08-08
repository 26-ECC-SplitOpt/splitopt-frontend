import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { colors } from '../styles/colors';

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 17px 24px;
  border-bottom: 1px solid ${colors.border};
  box-sizing: border-box;
`;

const Logo = styled.p`
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: ${colors.dark};

  span {
    color: ${colors.accent};
  }
`;

const MenuButton = styled(Link)`
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

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 6h16M2 10h16M2 14h16"
        stroke={colors.dark}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Header() {
  return (
    <HeaderBar>
      <Logo>
        Split<span>Opt</span>
      </Logo>
      <MenuButton to="/me" aria-label="내 정보 보기">
        <MenuIcon />
      </MenuButton>
    </HeaderBar>
  );
}

export default Header;
