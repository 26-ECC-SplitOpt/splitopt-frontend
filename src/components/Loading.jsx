import styled from '@emotion/styled';

const LoadingText = styled.p`
  margin: 0;
  padding: ${(props) => props.padding ?? '40px 0'};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
`;

function Loading({ padding }) {
  return <LoadingText padding={padding}>불러오는 중...</LoadingText>;
}

export default Loading;
