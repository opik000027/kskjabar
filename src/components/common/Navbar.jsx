import React, { useState } from 'react'; // Impor useState untuk mengelola status menu
import { Home, Users, Compass, Phone, LogIn, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react'; // Tambah ikon Menu dan X
import { useAuth } from '../../contexts/AuthContext.jsx'; // Pastikan ekstensi .jsx

const Navbar = ({ setCurrentView }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk mengelola status buka/tutup menu burger

  // Fungsi untuk mengganti status menu burger
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavItemClick = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false); // Tutup menu setelah item diklik (untuk mobile)
  };

  const handleAuthAction = (action, view) => {
    if (action) {
      action(); // Jalankan aksi logout
    } else {
      setCurrentView(view);
    }
    setIsMenuOpen(false); // Tutup menu setelah aksi otentikasi
  };

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
        <div className="text-white text-2xl font-bold flex items-center mb-2 md:mb-0">
            <img src="/logo-ksk.png" alt="Logo Kei Shin Kan" className="h-10 w-10 mr-3 rounded-full object-contain"/>
            <span className="text-blue-400">KEI SHIN KAN</span> JAWA BARAT
        </div>

        {/* Tombol Burger Menu untuk Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 hover:text-white p-2 rounded-md transition-colors">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Daftar Navigasi (Tampilan Desktop) */}
        <div className="hidden md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => handleNavItemClick(item.view)}
              className="text-gray-300 hover:text-white flex items-center p-2 rounded-md transition-colors text-sm md:text-base"
            >
              <item.icon size={18} className="mr-2" /> {item.name}
            </button>
          ))}
          {authNavItems.map(item => (
            <button
              key={item.name}
              onClick={() => handleAuthAction(item.action, item.view)}
              className={`px-4 py-2 rounded-md transition-colors flex items-center text-sm md:text-base ${item.name === 'Login' ? 'bg-blue-600 text-white hover:bg-blue-700' : (item.name === 'Daftar' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-gray-300 hover:text-white')}`}
            >
              <item.icon size={18} className="mr-2" /> {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Mobile yang Collapsible */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[64px] left-0 w-full bg-gray-800 flex flex-col items-start p-4 space-y-2 shadow-lg animate-fade-in-down">
          {navItems.map(item => (
            <button
              key={item.name}
              onClick={() => handleNavItemClick(item.view)}
              className="text-gray-300 hover:text-white w-full text-left p-2 rounded-md transition-colors text-base"
            >
              <item.icon size={18} className="inline mr-2" /> {item.name}
            </button>
          ))}
          {authNavItems.map(item => (
            <button
              key={item.name}
              onClick={() => handleAuthAction(item.action, item.view)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors text-base ${item.name === 'Login' ? 'bg-blue-600 text-white hover:bg-blue-700' : (item.name === 'Daftar' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-gray-300 hover:text-white')}`}
            >
              <item.icon size={18} className="inline mr-2" /> {item.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
