import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

async function enableMocking() {
  // 아직 실제 백엔드가 없어서 배포 환경(Netlify 등)에서도 mock을 켜둔다.
  // 실제 API가 하나씩 준비되면 handlers.js에서 해당 핸들러를 지우면 되고,
  // onUnhandledRequest: 'bypass' 덕분에 mock에 없는 요청은 자동으로 실제
  // 서버로 나간다. 나중에 진짜 백엔드가 다 붙으면 이 함수 자체를 지우면 된다.
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
});
