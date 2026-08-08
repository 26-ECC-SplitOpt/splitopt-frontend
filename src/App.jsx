import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import GroupList from './pages/GroupList';
import GroupCreate from './pages/GroupCreate';
import GroupDetail from './pages/GroupDetail';
import GroupSettings from './pages/GroupSettings';
import InviteJoin from './pages/InviteJoin';
import SettleResult from './pages/SettleResult';
import MySettlement from './pages/MySettlement';
import MyInfo from './pages/MyInfo';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/groups" element={<GroupList />} />
      <Route
        path="/groups/new"
        element={
          <ProtectedRoute>
            <GroupCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/join"
        element={
          <ProtectedRoute>
            <InviteJoin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <GroupDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:groupId/settings"
        element={
          <ProtectedRoute>
            <GroupSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:groupId/members"
        element={<div>참여자 관리 페이지 준비 중</div>}
      />
      <Route
        path="/groups/:groupId/expenses/new"
        element={<div>지출 등록 페이지 준비 중</div>}
      />
      <Route
        path="/groups/:groupId/expenses/:expenseId"
        element={<div>지출 상세 페이지 준비 중</div>}
      />
      <Route
        path="/groups/:groupId/settle"
        element={
          <ProtectedRoute>
            <SettleResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:groupId/settle/me"
        element={
          <ProtectedRoute>
            <MySettlement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <MyInfo />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
