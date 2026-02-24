import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NaveBar'; // Ahya 'NaveBar' spelling tamari file mujab rakhyu che
import TopBar from './TopBar';
import Footer from './Footer';

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <NavBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Header / TopBar */}
        <TopBar />

        {/* Dynamic Page Content */}
        {/* Footer ne scrollable area ma muki didhu che */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8 flex flex-col">
           <div className="flex-grow">
             <Outlet />
           </div>
           
           {/* Footer content ni niche dekhashe */}
           <div className="mt-8">
             <Footer />
           </div>
        </main>
        
      </div>
    </div>
  );
}