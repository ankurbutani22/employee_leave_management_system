import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar'; // Updated NavBar import karo
import TopBar from './TopBar';

export default function AdminLayout() {
  // Have 'useState' ni jarur nathi karan ke Navbar CSS thi handle thay che

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* Sidebar / Bottom Nav */}
      {/* Aa component pote j decide karshe ke te bottom ma rehse ke side ma */}
      <NavBar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">

        {/* TopBar */}
        {/* Note: TopBar ma thi tame have hamburger menu kadhi shako cho */}
        <TopBar onToggleSidebar={() => { }} />

        {/* Dynamic Page Content */}
        {/* Mobile ma content bottom bar pachal na jay mate 'pb-24' */}
        <main className="p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}