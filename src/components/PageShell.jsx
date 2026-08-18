import Header from './Header';
import Loading from './Loading';
import AccessDenied from './AccessDenied';
import { Page, Content } from '../styles/layout';

// 라우트 페이지들이 공통으로 반복하던 Page/Content 레이아웃 +
// Header 렌더링 + 로딩/접근 거부 분기 처리를 한 곳으로 모은다.
function PageShell({
  isLoading,
  accessError,
  contentPadding,
  titleBar,
  children,
}) {
  if (!isLoading && accessError) {
    return (
      <Page>
        <Header />
        <AccessDenied message={accessError} />
      </Page>
    );
  }

  return (
    <Page>
      <Header />
      <Content padding={contentPadding}>
        {titleBar}
        {isLoading ? <Loading /> : children}
      </Content>
    </Page>
  );
}

export default PageShell;
