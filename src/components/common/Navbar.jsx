import React from 'react';
import { Home, Users, Compass, Phone, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
// Pastikan ekstensi .jsx disertakan secara eksplisit pada jalur impor.
import { useAuth } from '../../contexts/AuthContext.jsx'; 

const Navbar = ({ setCurrentView }) => {
  const { isAuthenticated, currentUser, logout } = useAuth(); // Menggunakan useAuth hook

  const navItems = [
    { name: 'Beranda', view: 'home', icon: Home, public: true },
    { name: 'Pelatih', view: 'coaches', icon: Users, public: true },
    { name: 'Tempat & Jadwal', view: 'locations', icon: Compass, public: true },
    { name: 'Kontak', view: 'contact', icon: Phone, public: true },
  ];

  const authNavItems = isAuthenticated ? [
    { name: 'Dashboard', view: currentUser.role === 'pelatih' ? 'coach-dashboard' : (currentUser.role === 'anggota' ? 'member-profile' : 'home'), icon: LayoutDashboard },
    { name: 'Logout', action: logout, icon: LogIn }
  ] : [
    { name: 'Login', view: 'login', icon: LogIn },
    { name: 'Daftar', view: 'register', icon: UserPlus }
  ];

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <div className="text-white text-2xl font-bold mb-2 md:mb-0">
          <span className="text-blue-400">KEI SHIN KAN</span> JAWA BARAT
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => setCurrentView(item.view)}
              className="text-gray-300 hover:text-white flex items-center p-2 rounded-md transition-colors text-sm md:text-base"
            >
              <item.icon size={18} className="mr-2" /> {item.name}
            </button>
          ))}
          {authNavItems.map(item => (
            <button
              key={item.name}
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
