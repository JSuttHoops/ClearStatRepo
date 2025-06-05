import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (!error && data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        role: 'employee',
        department: 'general',
      });
      navigate('/dashboard');
    } else {
      alert(error?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form
        onSubmit={handleSubmit}
        className="glass w-80 p-6 space-y-4 text-gray-200"
      >
        <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-transparent border border-white/30 focus:border-blue-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-transparent border border-white/30 focus:border-blue-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold"
        >
          Sign Up
        </button>
        <p className="text-center text-sm">
          Have an account?{' '}
          <Link to="/login" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
