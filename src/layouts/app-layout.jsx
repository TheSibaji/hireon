import Header from '@/components/header';
import { Outlet } from 'react-router-dom';
// import './App.css';

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container mt-2 px-10">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">Made with ❤️ by Team SSRM</div>
    </div>
  )
}

export default AppLayout
