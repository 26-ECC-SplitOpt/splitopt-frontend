import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import GroupList from './pages/GroupList';
import GroupDetail from './pages/GroupDetail';
import GroupSettings from './pages/GroupSettings';
import SettleResult from './pages/SettleResult';
import MySettlement from './pages/MySettlement';
import MyInfo from './pages/MyInfo';
import ExpenseForm from './pages/ExpenseForm';
import ExpenseDetail from './pages/ExpenseDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
        <Route path="/groups/:groupId/settings" element={<GroupSettings />} />
        <Route path="/groups/:groupId/expenses/new" element={<ExpenseForm />} />
        <Route
          path="/groups/:groupId/expenses/:expenseId/edit"
          element={<ExpenseForm />}
        />
        <Route
          path="/groups/:groupId/expenses/:expenseId"
          element={<ExpenseDetail />}
        />
        <Route path="/groups/:groupId/settle" element={<SettleResult />} />
        <Route path="/groups/:groupId/settle/me" element={<MySettlement />} />
        <Route path="/me" element={<MyInfo />} />
      </Route>
    </Routes>
  );
}

export default App;
