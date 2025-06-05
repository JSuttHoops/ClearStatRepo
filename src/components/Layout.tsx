import { Link, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/login');
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 border-b">
        <Link to="/dashboard" className="font-bold text-lg">
          ClearStat
        </Link>
        <button onClick={handleLogout} className="text-sm text-red-500">
          Logout
        </button>
      </nav>
      <Outlet />
    </div>
  );
}
