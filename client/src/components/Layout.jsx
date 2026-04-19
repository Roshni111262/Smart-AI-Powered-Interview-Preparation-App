import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-28 pb-12 px-5 sm:px-8 lg:px-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
