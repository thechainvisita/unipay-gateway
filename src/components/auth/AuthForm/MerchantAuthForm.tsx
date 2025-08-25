import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../../../redux/auth/actions';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export default function MerchantAuthForm() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
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

  const toggleForm = () => setIsSignIn(!isSignIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignIn) {
        const user = await dispatch(login(email, password, 'merchant'));
        if (user) {
          navigate('/merchant/dashboard');
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
        const user = await dispatch(signup(email, username, 'merchant', password));
        if (user) {
          navigate('/merchant/dashboard');
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
    <form onSubmit={handleSubmit} className="space-y-6 mx-auto text-white px-4 py-4">
      <h1 className="text-[56px] font-grifter text-center leading-tight">
        Unipay Payments,
        <br className="hidden sm:inline" /> Real Rewards.
      </h1>

      <h2 className="text-center text-md font-aeonik">
        {isSignIn ? 'Log in' : 'Create merchant account'}
      </h2>

      <div className="w-[60%] mx-auto relative">
        <Mail className="absolute left-4 top-3 text-white/50" size={18} />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-white/10 font-aeonik text-white pl-12 pr-4 py-3 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {!isSignIn && (
        <div className="w-[60%] mx-auto relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Business Name"
            className="w-full bg-white/10 font-aeonik text-white px-4 py-3 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      )}

      <div className="w-[60%] mx-auto relative">
        <Lock className="absolute left-4 top-3 text-white/50" size={18} />
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-white/10 font-aeonik text-white pl-12 pr-10 py-3 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="button"
          className="absolute right-4 top-3 text-white/50"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {!isSignIn && (
        <div className="w-[60%] mx-auto relative">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-white/10 font-aeonik text-white px-4 py-3 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      )}

      {/* Error Message Display */}
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

      <p className="font-aeonik text-sm text-center text-white/60">
        {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={toggleForm}
          className="text-cyan-300 hover:underline font-medium"
        >
          {isSignIn ? 'Sign Up' : 'Log in'}
        </button>
      </p>
    </form>
  );
}

