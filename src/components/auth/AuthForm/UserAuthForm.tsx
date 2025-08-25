import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../../redux/auth/actions';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

interface AuthFormProps {
  isSignIn: boolean;
  toggleForm: () => void;
  redirectPath: string;
}

export default function AuthForm({ isSignIn, toggleForm, redirectPath }: AuthFormProps) {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { status } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'error') {
      setError('Incorrect email or password.');
    } else {
      setError('');
    }
  }, [status, isSignIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignIn) {
        const user = await dispatch(login(email, password, 'user'));
        if (user) {
          navigate(redirectPath);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (!email || !username || !password) {
          setError('Please fill in all fields.');
          return;
        }
        const user = await dispatch(signup(email, username, 'user', password));
        if (user) {
          navigate(redirectPath);
        } else {
          setError('Signup failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Auth form error:', err);
      const errorMessage = err.message || err.error?.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <h2 className="text-[24px] font-aeonik font-bold text-center text-[#f2f2f2]">
        {isSignIn ? 'Log in' : 'Create your account'}
      </h2>

      {/* Email input */}
      <div className="relative w-[60%] mx-auto">
        <Mail className="absolute left-4 top-3 text-white/50" size={18} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/10 text-white pl-12 pr-4 py-3 rounded-xl placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {!isSignIn && (
        <div className="relative w-[60%] mx-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-white/10 text-white px-4 py-3 rounded-xl placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      )}

      {/* Password input */}
      <div className="relative w-[60%] mx-auto">
        <Lock className="absolute left-4 top-3 text-white/50" size={18} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-white/10 text-white pl-12 pr-10 py-3 rounded-xl placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="button"
          className="absolute right-4 top-3 text-white/50"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Forgot Password link */}
      {isSignIn && (
        <div className="w-[60%] mx-auto text-right">
          <button
            type="button"
            className="text-sm text-cyan-300 hover:underline"
            onClick={() => alert('Reset password flow to be implemented')}
          >
            Forgot Password?
          </button>
        </div>
      )}

      {/* Confirm Password */}
      {!isSignIn && (
        <div className="font-aeonik relative w-[60%] mx-auto">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-white/10 text-white px-4 py-3 rounded-xl placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      )}

      {/* Error Message */}
      {error && <div className="text-sm text-red-400 text-center -mt-2">{error}</div>}

      <div className="relative w-[60%] mx-auto">
        <button
          type="submit"
          className="w-full bg-white text-[#0f1b44] font-gilroy font-bold rounded-full py-3 px-6 shadow-md hover:bg-gray-100 transition"
        >
          <span className="block text-center">{isSignIn ? 'Log in' : 'Sign Up'}</span>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#0f1b44]">
            <ArrowRight size={16} className="text-white" />
          </div>
        </button>
      </div>

      <p className="text-[16px] text-center text-white/60">
        {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={toggleForm}
          className="text-cyan-300 hover:underline font-aeonik"
        >
          {isSignIn ? 'Sign Up' : 'Log in'}
        </button>
      </p>
    </form>
  );
}

