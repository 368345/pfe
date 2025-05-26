import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="search"
                className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-2 mr-4 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Bell size={20} />
            </button>
            
            <div className="relative ml-3">
              <div className="flex items-center">
                <div className="hidden md:block mr-3 text-right">
                  <div className="text-sm font-medium text-gray-700">{user?.name || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;