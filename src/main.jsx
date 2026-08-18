import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// 이제 실제 백엔드를 직접 호출하는 구조라 mock(MSW)은 꺼둠.
// 다시 켜려면 이 파일을 mock 붙어 있던 이전 버전으로 되돌리면 됨(mocks/browser.js는 남겨둠).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
