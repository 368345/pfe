import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Upload,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/invoices', icon: <FileText size={20} />, label: 'Invoices' },
    { to: '/clients', icon: <Users size={20} />, label: 'Clients' },
    { to: '/upload', icon: <Upload size={20} />, label: 'Upload' },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-blue-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-blue-900">
          <NavLink to="/" className="flex items-center">
            <FileText className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">InvoicePro</span>
          </NavLink>
          <button 
            onClick={toggleSidebar}
            className="text-white focus:outline-none lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-8 mt-8 border-t border-blue-700">
            <NavLink
              to="/settings"
              className="flex items-center px-4 py-3 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-200"
            >
              <Settings size={20} />
              <span className="ml-3">Settings</span>
            </NavLink>

            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 mt-2 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;