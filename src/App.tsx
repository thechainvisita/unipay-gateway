import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import store from './redux/store';
import { Provider } from 'react-redux';
import { setUser } from './redux/auth/actions';
import { User } from './types';

const savedUser = localStorage.getItem('authUser');
if (savedUser) {
  try {
    const user: User = JSON.parse(savedUser);
    store.dispatch(setUser(user));
  } catch (error) {
    console.error('Error parsing saved user:', error);
  }
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  );
}

