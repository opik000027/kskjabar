import React from 'react';
// Import icons from Lucide React. Make sure 'lucide-react' is in your package.json dependencies.
import { Home, Users, Compass, Phone, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
// Import useAuth from your AuthContext. Make sure src/contexts/AuthContext.jsx exists.
import { useAuth } from '../../contexts/AuthContext.jsx'; 

const Navbar = ({ setCurrentView }) => {
  const { isAuthenticated, currentUser, logout } = useAuth(); // Using the useAuth hook

  // Define navigation items for public access
  const navItems = [
    { name: 'Beranda', view: 'home', icon: Home, public: true },
    { name: 'Pelatih', view: 'coaches', icon: Users, public: true },
    { name: 'Tempat & Jadwal', view: 'locations', icon: Compass, public: true },
    { name: 'Kontak', view: 'contact', icon: Phone, public: true },
  ];

  // Define navigation items based on authentication status
  const authNavItems = isAuthenticated ? [
    // Directs to appropriate dashboard based on user role
    { name: 'Dashboard', view: currentUser.role === 'pelatih' ? 'coach-dashboard' : (currentUser.role === 'anggota' ? 'member-profile' : 'home'), icon: LayoutDashboard },
    // Logout action
    { name: 'Logout', action: logout, icon: LogIn }
  ] : [
    // Login and Register options for unauthenticated users
    { name: 'Login', view: 'login', icon: LogIn },
    { name: 'Daftar', view: 'register', icon: UserPlus }
  ];

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Container for Logo and Title */}
        <div className="text-white text-2xl font-bold mb-2 md:mb-0 flex items-center">
            {/* Kei Shin Kan Logo */}
            {/* Pastikan '/logo-ksk.png' adalah nama file yang sudah diganti dan ada di folder public/ */}
            <img src="/logo-ksk.png" alt="Logo Kei Shin Kan" className="h-10 w-10 mr-3 rounded-full object-contain"/>
            <span className="text-blue-400">KEI SHIN KAN</span> JAWA BARAT
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          {/* Render public navigation items */}
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.view)}
              className="text-gray-300 hover:text-white flex items-center p-2 rounded-md transition-colors text-sm md:text-base"
            >
              <item.icon size={18} className="mr-2" /> {item.name}
            </button>
          ))}
          {/* Render authentication-related navigation items */}
          {authNavItems.map(item => (
            <button
              key={item.name}
              // If item has an action (like logout), execute it; otherwise, change view
              onClick={() => item.action ? item.action() : setCurrentView(item.view)}
              className={`px-4 py-2 rounded-md transition-colors flex items-center text-sm md:text-base ${item.name === 'Login' ? 'bg-blue-600 text-white hover:bg-blue-700' : (item.name === 'Daftar' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-gray-300 hover:text-white')}`}
            >
              <item.icon size={18} className="mr-2" /> {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
