// components/Sidebar.js
"use client"
import React, { useState } from 'react';

import {
    FiHome,
    FiBookOpen,       
    FiVideo,          
    FiMessageCircle,  
    FiSettings,       
    FiLogOut,         
    FiMenu,           
    FiX,              
  } from 'react-icons/fi';
  


const Sidebar = ({setSideBarOpen}: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSideBarOpen(!isSidebarOpen);
  };

  const navItems = [
    { name: 'Home', href: '#', icon: FiHome, current: true }, // Added 'current' state example
    { name: 'Posts', href: '#', icon: FiBookOpen, current: false },
    { name: 'Videos', href: '#', icon: FiVideo, current: false },
    { name: 'Comments', href: '#', icon: FiMessageCircle, current: false },
    { name: 'Settings', href: '#', icon: FiSettings, current: false },
  ];

  return (
    <>
      {/* Backdrop for mobile/tablet when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`poppins 
          fixed inset-y-0 left-0 z-40 flex flex-col
          bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64' : 'w-14'}
           lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header / Logo Area */}
        <div className={`flex items-center px-4 h-16 shrink-0 ${isSidebarOpen ? 'justify-between' : 'justify-center'} lg:justify-start`}>
           {/* Optional Logo/Title */}
           <span className={`font-bold text-xl text-white ${isSidebarOpen ? 'inline' : 'hidden'} `}>MyApp</span>

          {/* Mobile Close Button (appears top right of sidebar) */}
           {/* <button
            onClick={toggleSidebar}
            className={`text-slate-200 hover:text-white lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
           >
             <span className="sr-only">Close sidebar</span>
             <FiX className="h-6 w-6" aria-hidden="true" />
           </button> */}

           {/* Desktop Collapse Button (appears top right when expanded) */}
           {/* <button
            onClick={toggleSidebar}
            className={`hidden lg:block ml-auto text-slate-200 hover:text-white ${isSidebarOpen ? 'block' : 'hidden'}`}
           >
             <span className="sr-only">Collapse sidebar</span>
             <FiX className="h-6 w-6" aria-hidden="true" />
           </button> */}

           {/* Desktop Expand Button (appears when collapsed) */}
            <button
              onClick={toggleSidebar}
              className={` cursor-pointer hidden lg:block text-slate-200 hover:text-white ${!isSidebarOpen ? 'block' : 'hidden ml-30'}`} // Show only when collapsed on desktop
            >
              <span className="sr-only">Expand sidebar</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-4">
            {/* Main Nav Items */}
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`
                        group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${
                          item.current
                            ? 'bg-slate-700 text-white' // Active state
                            : 'text-slate-200 hover:text-white hover:bg-slate-700/50' // Inactive state
                        }
                        justify-start
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          item.current ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                        aria-hidden="true"
                      />
                      {/* Hide text when collapsed (on all sizes for simplicity here, but can use lg:inline etc.) */}
                      <span className={`${isSidebarOpen ? 'inline' : 'hidden'}`}>{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            {/* Logout Button (at the bottom) */}
            <li className="mt-auto pb-4">
               <a
                  href="#"
                   className={`
                    group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                    text-slate-200 hover:bg-slate-700/50 hover:text-white
                     justify-start
                  `}
                >
                  <FiLogOut className="h-6 w-6 shrink-0 text-slate-300 group-hover:text-white" aria-hidden="true" />
                  <span className={`${isSidebarOpen ? 'inline' : 'hidden'} `}>Logout</span>
                </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div
         className={`
           transition-all duration-300 ease-in-out
           lg:pl-64  // Default padding left for desktop open sidebar
           ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} // Adjust padding left based on desktop state
         `}
      >

      </div>
    </>
  );
};

export default Sidebar;