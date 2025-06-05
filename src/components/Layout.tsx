import { Link, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/login');
  };

  return (
    <div className="pt-20 px-4 3xl:px-0 max-w-screen-3xl mx-auto">
      <nav className="glass fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 mx-4 mt-4 rounded-xl">
        <Link to="/dashboard" className="font-bold text-xl tracking-wide">
          ClearStat
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-1 text-sm text-red-500 hover:text-red-400"
        >
          Logout
        </button>
      </nav>
      <Outlet />
    </div>
  );
}
