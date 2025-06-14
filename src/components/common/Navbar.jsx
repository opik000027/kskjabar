import React, { useState } from 'react'; // Impor useState untuk mengelola status menu
import { Home, Users, Compass, Phone, LogIn, UserPlus, LayoutDashboard, Menu, X } from 'lucide-react'; // Tambah ikon Menu dan X
import { useAuth } from '../../contexts/AuthContext.jsx'; // Pastikan ekstensi .jsx

const Navbar = ({ setCurrentView }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi yang dimodifikasi untuk menangani navigasi atau scroll
  const handleNavItemClick = (view, targetId = null) => {
    // Jika ada targetId, arahkan ke 'home' terlebih dahulu (jika belum di home)
    // lalu picu scroll setelah view di-render.
    // Jika view yang diminta adalah 'home', targetSectionId akan diteruskan.
    // Jika tidak, targetSectionId akan null.
    setCurrentView(view, targetId); 
    setIsMenuOpen(false); // Tutup menu setelah item diklik
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
    // Tombol 'Beranda' sekarang juga mengarahkan ke bagian hero-homepage
    { name: 'Beranda', view: 'home', icon: Home, public: true, targetId: 'hero-homepage' }, 
    { name: 'Pelatih', view: 'home', icon: Users, public: true, targetId: 'pelatih-section' }, // Target untuk scroll
    { name: 'Tempat & Jadwal', view: 'home', icon: Compass, public: true, targetId: 'jadwal-tempat-section' }, // Target untuk scroll
    { name: 'Kontak', view: 'home', icon: Phone, public: true, targetId: 'kontak-section' }, // Target untuk scroll
  ];

  const authNavItems = isAuthenticated ? [
    { name: 'Dashboard', view: currentUser.role === 'pelatih' ? 'coach-dashboard' : (currentUser.role === 'anggota' ? 'member-profile' : 'home'), icon: LayoutDashboard, targetId: null },
    { name: 'Logout', action: logout, icon: LogIn, targetId: null }
  ] : [
    { name: 'Login', view: 'login', icon: LogIn, targetId: null },
    { name: 'Daftar', view: 'register', icon: UserPlus, targetId: null }
  ];

  return (
    <nav className="bg-gray-800 p-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Kontainer untuk Logo dan Judul - Sekarang bisa diklik */}
        <button 
          onClick={() => handleNavItemClick('home', 'hero-homepage')} // Mengarahkan ke bagian hero-homepage
          className="text-white text-2xl font-bold mb-2 md:mb-0 flex items-center cursor-pointer p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
            {/* Logo Kei Shin Kan */}
            <img src="/logo-ksk.png" alt="Logo Kei Shin Kan" className="h-10 w-10 mr-3 rounded-full object-contain"/>
            <span className="text-blue-400">KEI SHIN KAN</span> Jawa Barat {/* Teks dengan spasi */}
        </button>

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
              onClick={() => handleNavItemClick(item.view, item.targetId)}
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
              onClick={() => handleNavItemClick(item.view, item.targetId)}
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
