import styled from '@emotion/styled';
import { colors } from './colors';

// 거의 모든 라우트 페이지가 반복하던 최상위 레이아웃.
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  background-color: ${colors.white};
  font-family: 'Inter', sans-serif;
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 342px;
  margin: 0 auto;
  padding: ${(props) => props.padding ?? '46px 24px 40px'};
  box-sizing: border-box;
`;
