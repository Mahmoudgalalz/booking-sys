import { useUserStore } from '../../store/userStore';
import HomePage from '../../pages/home/HomePage';
import SignupPage from '../../pages/auth/SignupPage';

export default function IndexRoute() {
  const { user } = useUserStore();
  return user ? <HomePage /> : <SignupPage />;
}
