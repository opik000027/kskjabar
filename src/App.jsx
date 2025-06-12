import React, { useState, useEffect, useContext, createContext } from 'react';

// Import ikon dari lucide-react
import {
  Home, Users, Compass, Phone, LogIn, UserPlus, LayoutDashboard, QrCode, DollarSign, Award, BookOpen, Calendar, Mail, PhoneCall, MapPin, Edit, Eye, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight, EyeOff, Clipboard, Download
} from 'lucide-react';

// Tailwind CSS CDN (untuk styling)
// Pastikan ini dimuat di index.html atau di dalam elemen <style> global jika di production
// <script src="https://cdn.tailwindcss.com"></script>
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

// --- Mock Data (Simulasi Backend Database) ---
// Data ini akan disimpan di state lokal untuk demo.
// Dalam aplikasi nyata, ini akan diambil dari database backend (Django/PostgreSQL)
const mockData = {
  users: [
    { id: 'user1', username: 'anggota001', password: 'password', role: 'anggota', fullName: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890', dojoId: 'dojo1', uniqueMemberId: 'KSK-001', currentBeltId: 'belt1', status: 'aktif', dateOfBirth: '2000-01-15', placeOfBirth: 'Bandung', address: 'Jl. Contoh No.1' },
    { id: 'user2', username: 'pelatih1', password: 'password', role: 'pelatih', fullName: 'Sensei Rudi', email: 'rudi@example.com', phone: '081122334455', dojoId: 'dojo1', profilePicture: 'https://placehold.co/100x100/5e72e4/ffffff?text=SR' },
    { id: 'user3', username: 'anggota002', password: 'password', role: 'anggota', fullName: 'Siti Aminah', email: 'siti@example.com', phone: '087654321098', dojoId: 'dojo1', uniqueMemberId: 'KSK-002', currentBeltId: 'belt2', status: 'aktif', dateOfBirth: '1998-05-20', placeOfBirth: 'Cimahi', address: 'Jl. Mekar No.5' },
    { id: 'user4', username: 'pelatih2', password: 'password', role: 'pelatih', fullName: 'Sensei Lia', email: 'lia@example.com', phone: '089876543210', dojoId: 'dojo2', profilePicture: 'https://placehold.co/100x100/f87979/ffffff?text=SL' },
    { id: 'user5', username: 'penguji1', password: 'password', role: 'penguji', fullName: 'Shihan Ahmad', email: 'ahmad@example.com', phone: '081212121212', branchId: 'branch1', profilePicture: 'https://placehold.co/100x100/50b86a/ffffff?text=SA' },
    { id: 'user6', username: 'anggota003', password: 'password', role: 'anggota', fullName: 'Cici Paramida', email: 'cici@example.com', phone: '081298765432', dojoId: 'dojo2', uniqueMemberId: 'KSK-003', currentBeltId: 'belt3', status: 'aktif', dateOfBirth: '2001-11-10', placeOfBirth: 'Bandung', address: 'Jl. Damai No.10' },
  ],
  branches: [
    { id: 'branch1', name: 'Kota Bandung', address: 'Jl. Asia Afrika No.1', contact: '022-123456' },
    { id: 'branch2', name: 'Kota Cimahi', address: 'Jl. Gandawijaya No.10', contact: '022-987654' },
  ],
  dojos: [
    { id: 'dojo1', name: 'Dojo Harimau', branchId: 'branch1', address: 'Jl. Cisitu Lama No.1', headCoachId: 'user2' },
    { id: 'dojo2', name: 'Dojo Naga Langit', branchId: 'branch2', address: 'Jl. Raya Cibabat No.5', headCoachId: 'user4' },
  ],
  belts: [
    { id: 'belt1', name: 'Putih', order: 1 },
    { id: 'belt2', name: 'Kuning', order: 2 },
    { id: 'belt3', name: 'Orange', order: 3 },
    { id: 'belt4', name: 'Hijau', order: 4 },
    { id: 'belt5', name: 'Biru', order: 5 },
    { id: 'belt6', name: 'Coklat', order: 6 },
    { id: 'belt7', name: 'Hitam', order: 7 },
  ],
  schedules: [
    { id: 'sched1', dojoId: 'dojo1', day: 'Senin', startTime: '16:00', endTime: '18:00', location: 'GOR Cihampelas' },
    { id: 'sched2', dojoId: 'dojo1', day: 'Rabu', startTime: '19:00', endTime: '21:00', location: 'GOR Cihampelas' },
    { id: 'sched3', dojoId: 'dojo2', day: 'Selasa', startTime: '15:00', endTime: '17:00', location: 'Pusat Olahraga Cimahi' },
  ],
  attendances: [],
  payments: [],
  gradingExams: [],
  achievements: [],
  trainingPrograms: [],
  memberProgress: [],
};

// --- Firebase Initialization (Boilerplate) ---
// Dalam aplikasi nyata, ini akan digunakan untuk autentikasi dan/atau data persistence (Firestore).
// Untuk demo ini, data persistence disimulasikan secara lokal dalam React state.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// const auth = getAuth(app); // Tidak diinisialisasi karena tidak ada import getAuth di sini untuk demo React lokal

// Function to simulate API calls
const mockApiCall = (data, delay = 500) => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// --- Auth Context untuk manajemen state otentikasi global ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(mockData); // State untuk mock data

  // Menginisialisasi user saat aplikasi dimuat (misalnya dari local storage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username, password) => {
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
      await mockApiCall({}); // Simulate API delay
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, message: 'Username atau password salah!' };
    }
  };

  const register = async (userData) => {
    const newUser = {
      id: `user${data.users.length + 1}`,
      ...userData,
      password: userData.password, // Dalam aplikasi nyata, ini harus di-hash
      role: 'anggota',
      account_status: 'pending_verifikasi',
      uniqueMemberId: `KSK-${String(data.users.length + 1).padStart(3, '0')}`,
      currentBeltId: 'belt1', // Sabuk awal
      join_date: new Date().toISOString().split('T')[0],
    };
    await mockApiCall({}); // Simulate API delay
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      members: [...prev.members, {
        id: newUser.id, // Member ID sama dengan User ID untuk simplifikasi
        userId: newUser.id,
        dojoId: newUser.dojoId,
        uniqueMemberId: newUser.uniqueMemberId,
        currentBeltId: newUser.currentBeltId,
        membershipStatus: newUser.status,
        paymentType: 'bulanan', // Default
        joinDate: newUser.join_date,
        // catatan_pelatih: '' // Ini akan ditambahkan oleh pelatih
      }]
    }));
    return { success: true, user: newUser };
  };


  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateData = async (newData) => {
    // Simulasi update data di backend
    await mockApiCall({});
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, register, data, updateData }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Komponen Umum (Reusable Components) ---

// Component untuk Modal kustom
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle size={24} />
          </button>
        </div>
        <div>{children}</div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// Card untuk menampilkan informasi
const InfoCard = ({ title, value, icon: Icon, bgColor = 'bg-blue-100', textColor = 'text-blue-800' }) => {
  return (
    <div className={`p-6 rounded-lg shadow-md ${bgColor} ${textColor} flex items-center justify-between`}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      {Icon && <Icon size={48} className="opacity-50" />}
    </div>
  );
};

// --- Komponen Navigasi ---
const Navbar = ({ setCurrentView }) => {
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Beranda', view: 'home', icon: Home, public: true },
    { name: 'Pelatih', view: 'coaches', icon: Users, public: true },
    { name: 'Tempat & Jadwal', view: 'locations', icon: Compass, public: true },
    { name: 'Kontak', view: 'contact', icon: Phone, public: true },
  ];

  const authNavItems = isAuthenticated ? [
    { name: 'Dashboard', view: currentUser.role === 'pelatih' ? 'coach-dashboard' : (currentUser.role === 'anggota' ? 'member-profile' : 'home'), icon: LayoutDashboard }, // Menggunakan LayoutDashboard
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

// --- Halaman Publik ---
const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
      <div className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-3xl border border-blue-200">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Selamat Datang di <span className="text-blue-600">KEI SHIN KAN</span> Jawa Barat
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Temukan Dojo Karate Terbaik di Dekat Anda. Bergabunglah dengan Komunitas Kami untuk Mencapai Potensi Tertinggi Anda dalam Seni Bela Diri.
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Jelajahi Dojo
          </button>
          <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Hubungi Kami
          </button>
        </div>
      </div>
    </div>
  );
};

const CoachesPage = () => {
  const { data } = useContext(AuthContext);
  const coaches = data.users.filter(user => user.role === 'pelatih');
  const dojos = data.dojos;
  const belts = data.belts;

  const getDojoName = (dojoId) => dojos.find(d => d.id === dojoId)?.name || 'N/A';
  const getBeltName = (beltId) => belts.find(b => b.id === beltId)?.name || 'N/A'; // Assuming coaches have a belt for profile

  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Profil Pelatih Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map(coach => (
          <div key={coach.id} className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-200">
            <img
              src={coach.profilePicture || `https://placehold.co/400x250/5e72e4/ffffff?text=${coach.fullName.split(' ').map(n => n[0]).join('')}`}
              alt={`Foto ${coach.fullName}`}
              className="w-full h-48 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x250/5e72e4/ffffff?text=${coach.fullName.split(' ').map(n => n[0]).join('')}` }}
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{coach.fullName}</h2>
              <p className="text-blue-600 font-medium mb-1">
                <span className="font-bold">Dojo:</span> {getDojoName(coach.dojoId)}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-bold">Email:</span> {coach.email}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-bold">Telepon:</span> {coach.phone}
              </p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LocationsPage = () => {
  const { data } = useContext(AuthContext);
  const branches = data.branches;
  const dojos = data.dojos;
  const schedules = data.schedules;

  const getDojoSchedules = (dojoId) => {
    return schedules.filter(s => s.dojoId === dojoId).map(s => (
      <li key={s.id} className="text-sm text-gray-700 mb-1">
        {s.day}, {s.startTime} - {s.endTime} ({s.location})
      </li>
    ));
  };

  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Tempat & Jadwal Latihan</h1>
      <div className="space-y-12">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center">
              <MapPin size={28} className="mr-3 text-blue-500" /> Cabang {branch.name}
            </h2>
            <p className="text-gray-700 mb-4 ml-10">Alamat: {branch.address}</p>
            <p className="text-gray-700 mb-6 ml-10">Kontak: {branch.contact}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              {dojos.filter(dojo => dojo.branchId === branch.id).map(dojo => (
                <div key={dojo.id} className="bg-blue-50 rounded-lg p-6 shadow-md border border-blue-100">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                    <Compass size={24} className="mr-2 text-blue-600" /> Dojo {dojo.name}
                  </h3>
                  <p className="text-gray-700 mb-2 ml-8">Alamat: {dojo.address}</p>
                  <p className="text-gray-700 mb-2 ml-8 font-semibold">Jadwal Latihan:</p>
                  <ul className="list-disc list-inside ml-10">
                    {getDojoSchedules(dojo.id).length > 0 ? getDojoSchedules(dojo.id) : <li className="text-sm text-gray-500">Jadwal belum tersedia.</li>}
                  </ul>
                  <button className="mt-4 text-blue-600 hover:underline flex items-center text-sm">
                    <MapPin size={16} className="mr-1" /> Lihat Peta
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Hubungi Kami</h1>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto border border-gray-200 text-gray-800">
        <p className="text-lg mb-6 text-center">
          Kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
        </p>
        <div className="space-y-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-md">
            <Mail size={24} className="text-blue-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">Email</h3>
              <p className="text-gray-700">info@keishinkan-jabar.com</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-md">
            <PhoneCall size={24} className="text-green-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">Telepon</h3>
              <p className="text-gray-700">0812-3456-7890</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 rounded-md">
            <MapPin size={24} className="text-purple-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">Alamat Sekretariat</h3>
              <p className="text-gray-700">Jl. Contoh Alamat No. 123, Bandung, Jawa Barat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Halaman Autentikasi ---
const LoginPage = ({ setCurrentView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    if (result.success) {
      if (result.user.role === 'pelatih') {
        setCurrentView('coach-dashboard');
      } else if (result.user.role === 'anggota') {
        setCurrentView('member-profile');
      } else if (result.user.role === 'penguji') {
        setCurrentView('exam-manager'); // Asumsi ada dashboard penguji
      } else {
        setCurrentView('home'); // Kembali ke home jika role tidak spesifik
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username / Email</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Memuat...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Belum punya akun? <button onClick={() => setCurrentView('register')} className="text-blue-600 hover:underline font-medium">Daftar Sekarang</button>
        </p>
      </div>
    </div>
  );
};

const RegisterPage = ({ setCurrentView }) => {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', phone: '', dojoId: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data, register } = useContext(AuthContext);

  const dojos = data.dojos;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }
    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);
    if (result.success) {
      setSuccess('Pendaftaran berhasil! Akun Anda sedang menunggu verifikasi pelatih.');
      setFormData({
        fullName: '', username: '', email: '', password: '', phone: '', dojoId: '', confirmPassword: ''
      });
      // Optionally, redirect after a short delay
      setTimeout(() => setCurrentView('login'), 3000);
    } else {
      setError(result.message || 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Daftar Akun Anggota</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
            <input type="text" id="fullName" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">Username</label>
            <input type="text" id="username" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
            <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="dojoId" className="block text-gray-700 font-medium mb-2">Pilih Dojo</label>
            <select id="dojoId" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.dojoId} onChange={handleChange} required>
              <option value="">-- Pilih Dojo Anda --</option>
              {dojos.map(dojo => (
                <option key={dojo.id} value={dojo.id}>{dojo.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input type="password" id="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Konfirmasi Password</label>
            <input type="password" id="confirmPassword" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Sudah punya akun? <button onClick={() => setCurrentView('login')} className="text-blue-600 hover:underline font-medium">Login di Sini</button>
        </p>
      </div>
    </div>
  );
};


// --- Dashboard Pelatih ---
const CoachDashboard = ({ setCurrentView }) => {
  const { currentUser, data } = useContext(AuthContext);
  const dojoMembers = data.members.filter(m => m.dojoId === currentUser.dojoId);
  const users = data.users;
  const payments = data.payments;
  const exams = data.gradingExams;
  const achievements = data.achievements;

  // Mendapatkan jumlah anggota
  const totalMembers = dojoMembers.length;

  // Mendapatkan anggota belum bayar bulan ini (contoh, bulan Juni 2025)
  const currentMonth = '2025-06';
  const membersWithPayments = payments.filter(p => p.paymentPeriod === currentMonth && p.status === 'lunas').map(p => p.memberId);
  const membersNotPaid = dojoMembers.filter(m => !membersWithPayments.includes(m.userId));
  const pendingPaymentsCount = membersNotPaid.length;

  // Anggota akan ujian bulan ini
  const upcomingExams = exams.filter(e => {
    const examDate = new Date(e.examDate);
    const today = new Date();
    return examDate.getMonth() === today.getMonth() && examDate.getFullYear() === today.getFullYear();
  }).length;

  // Notifikasi verifikasi prestasi
  const pendingAchievements = achievements.filter(a => a.verificationStatus === 'pending' && dojoMembers.map(m=>m.userId).includes(a.memberId));
  const pendingAchievementsCount = pendingAchievements.length;


  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Pelatih <span className="text-blue-600">{currentUser.fullName}</span></h1>
      <p className="text-lg text-gray-600 mb-8">Dojo: {data.dojos.find(d => d.id === currentUser.dojoId)?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <InfoCard title="Total Anggota" value={totalMembers} icon={Users} bgColor="bg-blue-100" textColor="text-blue-800" />
        <InfoCard title="Belum Bayar Bulan Ini" value={pendingPaymentsCount} icon={DollarSign} bgColor="bg-red-100" textColor="text-red-800" />
        <InfoCard title="Ujian Bulan Ini" value={upcomingExams} icon={BookOpen} bgColor="bg-green-100" textColor="text-green-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifikasi & Pengingat */}
        <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center"><Mail size={24} className="mr-3 text-orange-500" /> Notifikasi & Pengingat</h2>
          <ul className="space-y-3">
            {pendingPaymentsCount > 0 && (
              <li className="flex items-center text-orange-700 bg-orange-50 p-3 rounded-md">
                <XCircle size={20} className="mr-3" /> {pendingPaymentsCount} anggota belum melunasi iuran bulan ini.
              </li>
            )}
            {pendingAchievementsCount > 0 && (
              <li className="flex items-center text-purple-700 bg-purple-50 p-3 rounded-md">
                <Award size={20} className="mr-3" /> {pendingAchievementsCount} prestasi baru menunggu verifikasi.
              </li>
            )}
            {upcomingExams > 0 && (
              <li className="flex items-center text-blue-700 bg-blue-50 p-3 rounded-md">
                <BookOpen size={20} className="mr-3" /> {upcomingExams} anggota akan mengikuti ujian bulan ini.
              </li>
            )}
            {pendingPaymentsCount === 0 && pendingAchievementsCount === 0 && upcomingExams === 0 && (
              <li className="text-gray-600 text-center py-4">Tidak ada notifikasi penting saat ini.</li>
            )}
          </ul>
        </div>

        {/* Aksi Cepat */}
        <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center"><LayoutDashboard size={24} className="mr-3 text-blue-500" /> Aksi Cepat</h2> {/* Menggunakan LayoutDashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setCurrentView('attendance-scanner')} className="bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md">
              <QrCode size={20} className="mr-2" /> Scan Kehadiran
            </button>
            <button onClick={() => setCurrentView('member-list')} className="bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center shadow-md">
              <Users size={20} className="mr-2" /> Kelola Anggota
            </button>
            <button onClick={() => setCurrentView('payment-manager')} className="bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center shadow-md">
              <DollarSign size={20} className="mr-2" /> Catat Pembayaran
            </button>
            <button onClick={() => setCurrentView('exam-manager')} className="bg-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center shadow-md">
              <BookOpen size={20} className="mr-2" /> Ujian Kenaikan Tingkat
            </button>
            <button onClick={() => setCurrentView('register')} className="bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md">
              <UserPlus size={20} className="mr-2" /> Tambah Anggota Baru
            </button>
            <button onClick={() => setCurrentView('achievement-manager')} className="bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center shadow-md">
              <Award size={20} className="mr-2" /> Verifikasi Prestasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Modul Anggota (untuk Pelatih & Anggota) ---

const MemberList = ({ setCurrentView, setSelectedMemberId }) => {
  const { currentUser, data } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');

  const members = data.members.filter(member => member.dojoId === currentUser.dojoId);
  const users = data.users;
  const belts = data.belts;

  const filteredMembers = members.filter(member => {
    const user = users.find(u => u.id === member.userId);
    return user && user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getFullName = (userId) => users.find(u => u.id === userId)?.fullName || 'N/A';
  const getBeltName = (beltId) => belts.find(b => b.id === beltId)?.name || 'N/A';

  return (
    <div className="container mx-auto p-8 pt-12">
      <button onClick={() => setCurrentView('coach-dashboard')} className="mb-6 flex items-center text-blue-600 hover:underline">
        <ChevronLeft size={20} className="mr-2" /> Kembali ke Dashboard
      </button>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Daftar Anggota Dojo</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari anggota berdasarkan nama..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Anggota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabuk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.length > 0 ? (
              filteredMembers.map(member => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.uniqueMemberId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFullName(member.userId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBeltName(member.currentBeltId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{member.membershipStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setSelectedMemberId(member.userId); setCurrentView('member-detail'); }}
                      className="text-blue-600 hover:text-blue-900 transition-colors mr-3"
                    >
                      <Eye size={20} />
                    </button>
                    {/* Add edit/delete buttons if needed */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada anggota ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MemberDetail = ({ setCurrentView, selectedMemberId }) => {
  const { currentUser, data, updateData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const targetUser = data.users.find(u => u.id === selectedMemberId);
  const targetMember = data.members.find(m => m.userId === selectedMemberId);

  const isCoachViewing = currentUser.role === 'pelatih' && targetMember?.dojoId === currentUser.dojoId;
  const isMemberViewingOwnProfile = currentUser.role === 'anggota' && currentUser.id === selectedMemberId;
  const isAllowedToEdit = isCoachViewing || isMemberViewingOwnProfile;

  useEffect(() => {
    if (targetUser) {
      setFormData({
        fullName: targetUser.fullName,
        email: targetUser.email,
        phone: targetUser.phone,
        address: targetUser.address || '',
        dateOfBirth: targetUser.dateOfBirth || '',
        placeOfBirth: targetUser.placeOfBirth || '',
        paymentType: targetMember?.paymentType || 'bulanan', // From member data
      });
    }
  }, [targetUser, targetMember]);

  if (!targetUser || !targetMember) {
    return (
      <div className="container mx-auto p-8 pt-12 text-center text-red-500">
        Anggota tidak ditemukan.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Update user data
    const updatedUsers = data.users.map(u =>
      u.id === selectedMemberId
        ? { ...u, fullName: formData.fullName, email: formData.email, phone: formData.phone, address: formData.address, dateOfBirth: formData.dateOfBirth, placeOfBirth: formData.placeOfBirth }
        : u
    );

    // Update member data (for payment type)
    const updatedMembers = data.members.map(m =>
      m.userId === selectedMemberId
        ? { ...m, paymentType: formData.paymentType }
        : m
    );

    await updateData({ users: updatedUsers, members: updatedMembers });
    setSuccessMessage('Data berhasil diperbarui!');
    setIsEditing(false);
  };

  const getBeltName = (beltId) => data.belts.find(b => b.id === beltId)?.name || 'N/A';
  const getDojoName = (dojoId) => data.dojos.find(d => d.id === dojoId)?.name || 'N/A';

  const memberAttendances = data.attendances.filter(att => att.memberId === selectedMemberId);
  const memberProgresses = data.memberProgress.filter(mp => mp.memberId === selectedMemberId);
  const memberPayments = data.payments.filter(pay => pay.memberId === selectedMemberId);
  const memberExams = data.gradingExams.filter(exam => exam.memberId === selectedMemberId);
  const memberAchievements = data.achievements.filter(ach => ach.memberId === selectedMemberId);

  const handleCopyToClipboard = (text) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setSuccessMessage('Nomor anggota berhasil disalin!');
    } catch (err) {
      setErrorMessage('Gagal menyalin nomor anggota.');
    }
  };

  const handleDownloadIjazah = (link) => {
    window.open(link, '_blank'); // Open PDF in new tab
  };

  const handleAddToGoogleCalendar = () => {
    const dojoSchedules = data.schedules.filter(s => s.dojoId === targetMember.dojoId);
    if (dojoSchedules.length === 0) {
      alert('Tidak ada jadwal latihan untuk dojo ini.');
      return;
    }

    const events = dojoSchedules.map(schedule => {
      const today = new Date();
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + (schedule.day === 'Senin' ? 1 : schedule.day === 'Selasa' ? 2 : schedule.day === 'Rabu' ? 3 : schedule.day === 'Kamis' ? 4 : schedule.day === 'Jumat' ? 5 : schedule.day === 'Sabtu' ? 6 : schedule.day === 'Minggu' ? 0 : 0));
      nextDay.setHours(parseInt(schedule.startTime.split(':')[0]), parseInt(schedule.startTime.split(':')[1]), 0);

      const endDate = new Date(nextDay);
      endDate.setHours(parseInt(schedule.endTime.split(':')[0]), parseInt(schedule.endTime.split(':')[1]), 0);

      const formattedStartTime = nextDay.toISOString().replace(/-|:|\.\d{3}/g, '');
      const formattedEndTime = endDate.toISOString().replace(/-|:|\.\d{3}/g, '');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Latihan+Karate+Dojo+${getDojoName(targetMember.dojoId)}&dates=${formattedStartTime}/${formattedEndTime}&details=Materi+latihan+rutin.&location=${schedule.location}`;
    });

    if (events.length > 0) {
      // Open all schedules in new tabs, as multiple events in one URL is complex
      events.forEach(eventUrl => window.open(eventUrl, '_blank'));
      setSuccessMessage('Jadwal latihan berhasil ditambahkan ke Google Calendar (akan membuka tab baru).');
    }
  };


  return (
    <div className="container mx-auto p-8 pt-12">
      <button onClick={() => isCoachViewing ? setCurrentView('member-list') : setCurrentView('home')} className="mb-6 flex items-center text-blue-600 hover:underline">
        <ChevronLeft size={20} className="mr-2" /> Kembali
      </button>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">{targetUser.fullName}</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage('')}>
            <XCircle size={18} />
          </span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage('')}>
            <XCircle size={18} />
          </span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 p-4 text-center font-medium ${activeTab === 'profile' ? 'bg-blue-600 text-white rounded-tl-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex-1 p-4 text-center font-medium ${activeTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
          >
            Kehadiran
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 p-4 text-center font-medium ${activeTab === 'progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
          >
            Perkembangan
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 p-4 text-center font-medium ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
          >
            Pembayaran
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 p-4 text-center font-medium ${activeTab === 'exams' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
          >
            Ujian
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 p-4 text-center font-medium ${activeTab === 'achievements' ? 'bg-blue-600 text-white rounded-tr-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
          >
            Prestasi
          </button>
        </div>

        <div className="p-6">
          {/* TAB: Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Nomor Anggota Unik</label>
                  <div className="flex items-center">
                    <p className="text-gray-900 text-lg font-mono bg-gray-100 p-2 rounded-md flex-grow">
                      {targetMember.uniqueMemberId}
                    </p>
                    <button
                      onClick={() => handleCopyToClipboard(targetMember.uniqueMemberId)}
                      className="ml-2 px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                      title="Salin ke Clipboard"
                    >
                      <Clipboard size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Dojo</label>
                  <p className="text-gray-900 text-lg">{getDojoName(targetMember.dojoId)}</p>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Sabuk Terkini</label>
                  <p className="text-gray-900 text-lg">{getBeltName(targetMember.currentBeltId)}</p>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-semibold mb-1">Status Keanggotaan</label>
                  <p className="text-gray-900 text-lg capitalize">{targetMember.membershipStatus}</p>
                </div>
              </div>

              <hr className="my-6 border-t border-gray-200" />

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Nama Lengkap</label>
                    <input type="text" id="fullName" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.fullName} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
                    <input type="tel" id="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Alamat</label>
                    <input type="text" id="address" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.address} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div>
                    <label htmlFor="placeOfBirth" className="block text-gray-700 font-medium mb-2">Tempat Lahir</label>
                    <input type="text" id="placeOfBirth" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.placeOfBirth} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-gray-700 font-medium mb-2">Tanggal Lahir</label>
                    <input type="date" id="dateOfBirth" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  {isCoachViewing && ( // Hanya pelatih yang bisa mengubah jenis pembayaran
                    <div>
                      <label htmlFor="paymentType" className="block text-gray-700 font-medium mb-2">Jenis Pembayaran Iuran</label>
                      <select id="paymentType" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.paymentType} onChange={handleChange} disabled={!isEditing}>
                        <option value="bulanan">Bulanan</option>
                        <option value="per_latihan">Per Latihan</option>
                      </select>
                    </div>
                  )}
                </div>

                {isAllowedToEdit && (
                  <div className="flex justify-end space-x-3 mt-6">
                    {isEditing ? (
                      <>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                          Batal
                        </button>
                        <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Simpan Perubahan
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setIsEditing(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Edit size={18} className="inline mr-2" /> Edit Profil
                      </button>
                    )}
                  </div>
                )}
              </form>

              {isMemberViewingOwnProfile && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat Anggota</h3>
                  <button
                    onClick={handleAddToGoogleCalendar}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center mt-3"
                  >
                    <Calendar size={18} className="inline mr-2" /> Tambah Jadwal Latihan ke Kalender
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: Kehadiran */}
          {activeTab === 'attendance' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Kehadiran</h3>
              {memberAttendances.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Hadir</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dicatat Oleh</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberAttendances.map((att, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{att.timeIn}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.users.find(u => u.id === att.recordedBy)?.fullName || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada riwayat kehadiran.</p>
              )}
            </div>
          )}

          {/* TAB: Perkembangan */}
          {activeTab === 'progress' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Perkembangan Kemampuan</h3>
              {memberProgresses.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materi Latihan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hasil (Kuantitas x Set)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberProgresses.map((mp, index) => {
                        // Ensure trainingDetails is defined before attempting to find
                        const trainingDetail = data.trainingDetails ? data.trainingDetails.find(td => td.id === mp.trainingDetailId) : null;
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mp.recordDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trainingDetail?.materialDescription || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${mp.achievedQuantity} x ${mp.achievedSets}`}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mp.notes}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada riwayat perkembangan kemampuan.</p>
              )}
            </div>
          )}

          {/* TAB: Pembayaran */}
          {activeTab === 'payments' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pembayaran Iuran</h3>
              {memberPayments.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberPayments.map((pay, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pay.paymentPeriod}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pay.paymentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rp{pay.amount.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{pay.method}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pay.status === 'lunas' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {pay.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada riwayat pembayaran.</p>
              )}
            </div>
          )}

          {/* TAB: Ujian */}
          {activeTab === 'exams' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Ujian Kenaikan Tingkat</h3>
              {memberExams.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabuk Sebelumnya</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabuk Baru</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberExams.map((exam, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.examDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBeltName(exam.previousBeltId)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBeltName(exam.newBeltId)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.status === 'lulus' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {exam.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exam.status === 'lulus' && exam.certificatePdfLink && (
                              <button
                                onClick={() => handleDownloadIjazah(exam.certificatePdfLink)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <Download size={16} className="mr-1" /> Unduh Ijazah
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada riwayat ujian.</p>
              )}
            </div>
          )}

          {/* TAB: Prestasi */}
          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Prestasi</h3>
              {isMemberViewingOwnProfile && (
                <AddAchievement selectedMemberId={selectedMemberId} />
              )}
              {memberAchievements.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kejuaraan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juara Ke</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Verifikasi</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberAchievements.map((ach, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.competitionName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.rank}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ach.verificationStatus === 'terverifikasi' ? 'bg-green-100 text-green-800' : ach.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {ach.verificationStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                            {ach.certificateFile && (
                              <a href={ach.certificateFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                <Eye size={18} />
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada riwayat prestasi.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const AttendanceScanner = ({ setCurrentView }) => {
  const { currentUser, data, updateData } = useContext(AuthContext);
  const [memberIdInput, setMemberIdInput] = useState('');
  const [scannedMember, setScannedMember] = useState(null);
  const [trainingMaterial, setTrainingMaterial] = useState('');
  const [achievedQuantity, setAchievedQuantity] = useState('');
  const [achievedSets, setAchievedSets] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const handleScan = async () => {
    setMessage('');
    const member = data.members.find(m => m.uniqueMemberId === memberIdInput && m.dojoId === currentUser.dojoId);
    if (member) {
      const user = data.users.find(u => u.id === member.userId);
      const belt = data.belts.find(b => b.id === member.currentBeltId);
      const paymentStatus = data.payments.find(p => p.memberId === member.userId && p.paymentPeriod === '2025-06')?.status || 'belum_lunas'; // Contoh bulan ini
      setScannedMember({ ...member, user, belt, paymentStatus });
    } else {
      setMessage('Anggota tidak ditemukan di dojo Anda atau ID salah.');
      setScannedMember(null);
    }
  };

  const handleSubmitAttendance = async () => {
    if (!scannedMember) {
      setMessage('Silakan pindai anggota terlebih dahulu.');
      return;
    }

    const newAttendance = {
      id: `att${data.attendances.length + 1}`,
      memberId: scannedMember.userId,
      date: new Date().toISOString().split('T')[0],
      timeIn: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      recordedBy: currentUser.id,
    };

    const newProgress = {
      id: `prog${data.memberProgress.length + 1}`,
      memberId: scannedMember.userId,
      trainingDetailId: `td${data.trainingDetails ? data.trainingDetails.length + 1 : 1}`, // Ini akan diganti dengan ID program latihan asli, pastikan trainingDetails ada
      recordDate: new Date().toISOString().split('T')[0],
      achievedQuantity: parseInt(achievedQuantity),
      achievedSets: parseInt(achievedSets),
      notes: notes,
    };

    // Simulate adding a new training detail if not selecting from existing programs
    const newTrainingDetail = {
      id: newProgress.trainingDetailId,
      trainingProgramId: 'prog1', // Contoh ID program
      materialDescription: trainingMaterial,
      targetQuantity: parseInt(achievedQuantity),
      targetSets: parseInt(achievedSets),
    };


    await updateData({
      attendances: [...data.attendances, newAttendance],
      memberProgress: [...data.memberProgress, newProgress],
      trainingDetails: [...(data.trainingPrograms || []), newTrainingDetail], // Perbaikan: Pastikan ini trainingPrograms
    });

    setMessage(`Kehadiran dan perkembangan ${scannedMember.user.fullName} berhasil dicatat!`);
    setMemberIdInput('');
    setScannedMember(null);
    setTrainingMaterial('');
    setAchievedQuantity('');
    setAchievedSets('');
    setNotes('');
  };

  return (
    <div className="container mx-auto p-8 pt-12">
      <button onClick={() => setCurrentView('coach-dashboard')} className="mb-6 flex items-center text-blue-600 hover:underline">
        <ChevronLeft size={20} className="mr-2" /> Kembali ke Dashboard
      </button>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Catat Kehadiran Anggota</h1>

      <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center"><QrCode size={24} className="mr-3 text-blue-500" /> Pindai Barcode ID Card</h2>
        <p className="text-gray-600 mb-4">
          (Simulasi: Masukkan No. Anggota Unik di sini. Dalam aplikasi nyata, ini akan menggunakan kamera HP untuk memindai barcode.)
        </p>
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="text"
            placeholder="Masukkan No. Anggota Unik (Contoh: KSK-001)"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={memberIdInput}
            onChange={(e) => setMemberIdInput(e.target.value)}
          />
          <button
            onClick={handleScan}
            className="bg-blue-600 text-white py-2 px-5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            Pindai
          </button>
        </div>
        {message && <p className="text-sm text-red-500 mb-4">{message}</p>}

        {scannedMember && (
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Anggota Terdeteksi:</h3>
            <p className="text-lg font-semibold text-blue-700">{scannedMember.user.fullName}</p>
            <p className="text-gray-700">No. Anggota: {scannedMember.uniqueMemberId}</p>
            <p className="text-gray-700">Sabuk: {scannedMember.belt.name}</p>
            <p className="text-gray-700">Status Iuran Bulan Ini: <span className={`font-semibold ${scannedMember.paymentStatus === 'lunas' ? 'text-green-600' : 'text-red-600'}`}>{scannedMember.paymentStatus.toUpperCase()}</span></p>

            <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">Catat Perkembangan Latihan:</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="trainingMaterial" className="block text-gray-700 text-sm font-medium mb-1">Materi Latihan (Contoh: Push up 15x 3 set)</label>
                <input
                  type="text"
                  id="trainingMaterial"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={trainingMaterial}
                  onChange={(e) => setTrainingMaterial(e.target.value)}
                  placeholder="Deskripsikan materi latihan hari ini"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="achievedQuantity" className="block text-gray-700 text-sm font-medium mb-1">Kuantitas Dicapai</label>
                  <input
                    type="number"
                    id="achievedQuantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={achievedQuantity}
                    onChange={(e) => setAchievedQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="achievedSets" className="block text-gray-700 text-sm font-medium mb-1">Set Dicapai</label>
                  <input
                    type="number"
                    id="achievedSets"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={achievedSets}
                    onChange={(e) => setAchievedSets(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-gray-700 text-sm font-medium mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  id="notes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleSubmitAttendance}
                className="bg-green-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle size={20} className="mr-2" /> Konfirmasi & Simpan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentManager = ({ setCurrentView }) => {
  const { currentUser, data, updateData } = useContext(AuthContext);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dojoMembers = data.members.filter(m => m.dojoId === currentUser.dojoId);
  const users = data.users;
  const payments = data.payments;

  const getFullName = (userId) => users.find(u => u.id === userId)?.fullName || 'N/A';

  const handleRecordPayment = async () => {
    if (!selectedMemberId || !amount) {
      setMessage('Silakan pilih anggota dan masukkan jumlah.');
      return;
    }

    const newPayment = {
      id: `pay${data.payments.length + 1}`,
      memberId: selectedMemberId,
      paymentPeriod: '2025-06', // Contoh bulan ini
      paymentDate: new Date().toISOString().split('T')[0],
      amount: parseFloat(amount),
      method: 'cash', // Ini adalah pencatatan manual (cash)
      status: 'lunas',
      recordedBy: currentUser.id,
    };

    await updateData({ payments: [...data.payments, newPayment] });
    setMessage(`Pembayaran Rp${amount} dari ${getFullName(selectedMemberId)} berhasil dicatat.`);
    setSelectedMemberId('');
    setAmount('');
    setIsModalOpen(false);
  };

  const handleSendReminder = async (memberId) => {
    setMessage(`Mengirim pengingat pembayaran ke ${getFullName(memberId)}... (Simulasi: Pesan terkirim via SMS/WhatsApp)`);
    await mockApiCall({}); // Simulate sending
    setMessage(`Pengingat berhasil dikirim ke ${getFullName(memberId)}.`);
  };

  const getPaymentStatus = (memberId, period) => {
    const memberPayments = payments.filter(p => p.memberId === memberId && p.paymentPeriod === period);
    if (memberPayments.some(p => p.status === 'lunas')) return 'Lunas';
    return 'Belum Lunas';
  };

  return (
    <div className="container mx-auto p-8 pt-12">
      <button onClick={() => setCurrentView('coach-dashboard')} className="mb-6 flex items-center text-blue-600 hover:underline">
        <ChevronLeft size={20} className="mr-2" /> Kembali ke Dashboard
      </button>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Manajemen Pembayaran Iuran</h1>

      {message && <p className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">{message}</p>}

      <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center"><DollarSign size={24} className="mr-3 text-green-500" /> Catat Pembayaran Manual (Cash)</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center shadow-md"
        >
          <CheckCircle size={20} className="mr-2" /> Catat Pembayaran Baru
        </button>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Status Iuran Anggota Dojo</h2>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Anggota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Pembayaran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Iuran (Bulan Ini)</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dojoMembers.map(member => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFullName(member.userId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{member.paymentType === 'bulanan' ? 'Bulanan' : 'Per Latihan'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatus(member.userId, '2025-06') === 'Lunas' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {getPaymentStatus(member.userId, '2025-06')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {getPaymentStatus(member.userId, '2025-06') === 'Belum Lunas' && (
                    <button
                      onClick={() => handleSendReminder(member.userId)}
                      className="text-orange-600 hover:text-orange-900 transition-colors mr-3"
                      title="Kirim Pengingat"
                    >
                      <Mail size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedMemberId(member.userId); setIsModalOpen(true); }}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Catat Pembayaran"
                  >
                    <DollarSign size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catat Pembayaran Iuran">
        <div className="space-y-4">
          <div>
            <label htmlFor="memberSelect" className="block text-gray-700 font-medium mb-2">Pilih Anggota</label>
            <select
              id="memberSelect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
            >
              <option value="">-- Pilih Anggota --</option>
              {dojoMembers.map(member => (
                <option key={member.id} value={member.userId}>{getFullName(member.userId)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">Jumlah Pembayaran (Rp)</label>
            <input
              type="number"
              id="amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 100000"
              required
            />
          </div>
          <button
            onClick={handleRecordPayment}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Simpan Pembayaran
          </button>
        </div>
      </Modal>
    </div>
  );
};

const ExamManager = ({ setCurrentView }) => {
  const { currentUser, data, updateData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(currentUser.role === 'pelatih' ? 'register' : 'judge'); // Default tab berdasarkan role
  const [selectedMemberForExam, setSelectedMemberForExam] = useState('');
  const [examLocation, setExamLocation] = useState('');
  const [examDate, setExamDate] = useState('');
  const [message, setMessage] = useState('');

  const dojoMembers = data.members.filter(m => m.dojoId === currentUser.dojoId);
  const users = data.users;
  const belts = data.belts;
  const gradingExams = data.gradingExams;

  const getFullName = (userId) => users.find(u => u.id === userId)?.fullName || 'N/A';
  const getBeltName = (beltId) => belts.find(b => b.id === beltId)?.name || 'N/A';
  const getDojoName = (dojoId) => data.dojos.find(d => d.id === dojoId)?.name || 'N/A';

  // --- Register Exam Tab (for Coaches) ---
  const handleRegisterExam = async () => {
    if (!selectedMemberForExam || !examLocation || !examDate) {
      setMessage('Harap lengkapi semua bidang untuk pendaftaran ujian.');
      return;
    }

    const member = data.members.find(m => m.userId === selectedMemberForExam);
    if (!member) {
      setMessage('Anggota tidak ditemukan.');
      return;
    }

    const newExam = {
      id: `exam${data.gradingExams.length + 1}`,
      memberId: selectedMemberForExam,
      previousBeltId: member.currentBeltId,
      newBeltId: belts.find(b => b.order === belts.find(bt => bt.id === member.currentBeltId).order + 1)?.id || 'belt7',
      examDate: examDate,
      examLocation: examLocation,
      examinerId: '',
      status: 'pending',
      certificatePdfLink: '',
      examinerSignature: '',
    };

    await updateData({ gradingExams: [...data.gradingExams, newExam] });
    setMessage(`Anggota ${getFullName(selectedMemberForExam)} berhasil didaftarkan untuk ujian.`);
    setSelectedMemberForExam('');
    setExamLocation('');
    setExamDate('');
  };

  // --- Judge Exam Tab (for Examiners) ---
  const examsForJudging = data.gradingExams.filter(exam => {
    const member = data.members.find(m => m.userId === exam.memberId);
    const dojo = data.dojos.find(d => d.id === member?.dojoId);
    return dojo?.branchId === currentUser.branchId && exam.status === 'pending';
  });

  const handleJudgeExam = async (examId, status) => {
    const updatedExams = data.gradingExams.map(exam => {
      if (exam.id === examId) {
        let certificatePdfLink = exam.certificatePdfLink;
        if (status === 'lulus') {
          certificatePdfLink = `https://example.com/certificates/ijazah_${exam.memberId}_${exam.newBeltId}.pdf`;
        }

        return {
          ...exam,
          status: status,
          examinerId: currentUser.id,
          certificatePdfLink: certificatePdfLink,
          examinerSignature: currentUser.profilePicture || 'https://placehold.co/50x50/cccccc/000000?text=Sig',
        };
      }
      return exam;
    });

    const updatedMembers = data.members.map(member => {
      const exam = updatedExams.find(e => e.memberId === member.userId && e.id === examId);
      if (exam && exam.status === 'lulus') {
        return { ...member, currentBeltId: exam.newBeltId };
      }
      return member;
    });

    await updateData({ gradingExams: updatedExams, members: updatedMembers });
    setMessage(`Ujian berhasil diproses: ${status.toUpperCase()}`);
  };


  return (
    <div className="container mx-auto p-8 pt-12">
      <button onClick={() => currentUser.role === 'pelatih' ? setCurrentView('coach-dashboard') : setCurrentView('home')} className="mb-6 flex items-center text-blue-600 hover:underline">
        <ChevronLeft size={20} className="mr-2" /> Kembali
      </button>

      <h1 className="text-4xl font-bold text-gray-800 mb-8">Manajemen Ujian Kenaikan Tingkat</h1>

      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage('')}>
            <XCircle size={18} />
          </span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl border border-gray-200">
        {currentUser.role === 'pelatih' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 p-4 text-center font-medium ${activeTab === 'register' ? 'bg-blue-600 text-white rounded-tl-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              Daftarkan Anggota
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 p-4 text-center font-medium ${activeTab === 'history' ? 'bg-blue-600 text-white rounded-tr-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              Riwayat Ujian Dojo
            </button>
          </div>
        )}
        {currentUser.role === 'penguji' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('judge')}
              className={`flex-1 p-4 text-center font-medium ${activeTab === 'judge' ? 'bg-blue-600 text-white rounded-tl-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              Nilai Ujian
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 p-4 text-center font-medium ${activeTab === 'history' ? 'bg-blue-600 text-white rounded-tr-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              Riwayat Ujian Cabang
            </button>
          </div>
        )}

        <div className="p-6">
          {activeTab === 'register' && currentUser.role === 'pelatih' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Daftarkan Anggota Dojo untuk Ujian</h3>
              <div>
                <label htmlFor="memberSelect" className="block text-gray-700 font-medium mb-2">Pilih Anggota</label>
                <select
                  id="memberSelect"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={selectedMemberForExam}
                  onChange={(e) => setSelectedMemberForExam(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Anggota --</option>
                  {dojoMembers.map(member => (
                    <option key={member.id} value={member.userId}>{getFullName(member.userId)} (Sabuk: {getBeltName(member.currentBeltId)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="examLocation" className="block text-gray-700 font-medium mb-2">Tempat Ujian</label>
                <input type="text" id="examLocation" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={examLocation} onChange={(e) => setExamLocation(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="examDate" className="block text-gray-700 font-medium mb-2">Tanggal Ujian</label>
                <input type="date" id="examDate" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
              </div>
              <button
                onClick={handleRegisterExam}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Daftarkan Ujian
              </button>
            </div>
          )}

          {activeTab === 'judge' && currentUser.role === 'penguji' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ujian yang Perlu Dinilai</h3>
              {examsForJudging.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anggota</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dojo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabuk Sekarang</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabuk Baru</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Ujian</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {examsForJudging.map(exam => (
                        <tr key={exam.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFullName(exam.memberId)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getDojoName(data.members.find(m=>m.userId === exam.memberId)?.dojoId)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBeltName(exam.previousBeltId)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBeltName(exam.newBeltId)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exam.examDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleJudgeExam(exam.id, 'lulus')}
                              className="text-green-600 hover:text-green-900 transition-colors mr-3"
                              title="Luluskan"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleJudgeExam(exam.id, 'tidak_lulus')}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Tidak Lulus"
                            >
                              <XCircle size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada ujian yang menunggu penilaian.</p>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Ujian</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anggota</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dojo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sabuk Baru</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penguji</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ijazah</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gradingExams.filter(exam => {
                      const member = data.members.find(m => m.userId === exam.memberId);
                      if (currentUser.role === 'pelatih' && member?.dojoId !== currentUser.dojoId) return false;
                      if (currentUser.role === 'penguji' && data.dojos.find(d => d.id === member?.dojoId)?.branchId !== currentUser.branchId) return false;
                      return true;
                    }).map(exam => (
                      <tr key={exam.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFullName(exam.memberId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getDojoName(data.members.find(m=>m.userId === exam.memberId)?.dojoId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBeltName(exam.newBeltId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.status === 'lulus' ? 'bg-green-100 text-green-800' : exam.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {exam.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFullName(exam.examinerId) || 'Belum Dinilai'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          {exam.status === 'lulus' && exam.certificatePdfLink && (
                            <a href={exam.certificatePdfLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              <Download size={18} />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const AchievementManager = ({ setCurrentView }) => {
  const { currentUser, data, updateData } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const pendingAchievements = data.achievements.filter(a => {
    const member = data.members.find(m => m.userId === a.memberId);
    return member?.dojoId === currentUser.dojoId && a.verificationStatus === 'pending';
  });

  const getFullName = (userId) => data.users.find(u => u.id === userId)?.fullName || 'N/A';

  const handleVerifyAchievement = async (achievementId, status) => {
    const updatedAchievements = data.achievements.map(ach =>
      ach.id === achievementId
        ? { ...ach, verificationStatus: status, verifiedBy: currentUser.id }
        : ach
    );
    await updateData({ achievements: updatedAchievements });
    setMessage(`Prestasi berhasil di${status === 'terverifikasi' ? 'verifikasi' : 'tolak'}.`);
  };

  return (
    <div className="container mx-auto p-8 pt-12">
      <button onClick={() => setCurrentView('coach-dashboard')} className="mb-6 flex items-center text-blue-600 hover:underline">
        <ChevronLeft size={20} className="mr-2" /> Kembali ke Dashboard
      </button>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Verifikasi Prestasi Anggota</h1>

      {message && <p className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">{message}</p>}

      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anggota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kejuaraan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juara Ke</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingAchievements.length > 0 ? (
              pendingAchievements.map(ach => (
                <tr key={ach.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getFullName(ach.memberId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.competitionName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ach.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {ach.certificateFile && (
                      <a href={ach.certificateFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        <Eye size={18} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleVerifyAchievement(ach.id, 'terverifikasi')}
                      className="text-green-600 hover:text-green-900 transition-colors mr-3"
                      title="Verifikasi"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => handleVerifyAchievement(ach.id, 'ditolak')}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Tolak"
                    >
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">Tidak ada prestasi menunggu verifikasi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const AddAchievement = ({ selectedMemberId }) => {
  const { updateData, data } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    competitionName: '', category: '', rank: '', date: '', location: '', certificateFile: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    // Simulasi upload file. Dalam aplikasi nyata, ini akan upload ke penyimpanan cloud (e.g., Firebase Storage, S3)
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Menggunakan base64 data URL untuk demo
        setFormData({ ...formData, certificateFile: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const newAchievement = {
      id: `ach${data.achievements.length + 1}`,
      memberId: selectedMemberId,
      ...formData,
      verificationStatus: 'pending', // Baru diunggah, statusnya pending
      verifiedBy: null,
    };

    await updateData({ achievements: [...data.achievements, newAchievement] });
    setMessage('Prestasi berhasil diunggah dan menunggu verifikasi pelatih!');
    setFormData({ competitionName: '', category: '', rank: '', date: '', location: '', certificateFile: '' });
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Tambahkan Prestasi Baru</h3>
      {message && <p className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="competitionName" className="block text-gray-700 font-medium mb-2">Nama Kejuaraan</label>
          <input type="text" id="competitionName" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.competitionName} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Kelas Pertandingan</label>
          <input type="text" id="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.category} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="rank" className="block text-gray-700 font-medium mb-2">Juara Ke</label>
          <input type="text" id="rank" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.rank} onChange={handleChange} placeholder="Contoh: 1 (Emas)" required />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Tanggal Pertandingan</label>
          <input type="date" id="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Tempat Pertandingan</label>
          <input type="text" id="location" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="certificateFile" className="block text-gray-700 font-medium mb-2">Piagam / Bukti Prestasi</label>
          <input type="file" id="certificateFile" accept=".jpg,.jpeg,.png,.pdf" className="w-full px-4 py-2 border border-gray-300 rounded-lg" onChange={handleFileChange} required />
          {formData.certificateFile && <p className="text-sm text-gray-500 mt-2">File dipilih: {formData.certificateFile.substring(0, 50)}...</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Mengunggah...' : 'Unggah Prestasi'}
        </button>
      </form>
    </div>
  );
};


const ExportData = ({ setCurrentView }) => {
  const [exportType, setExportType] = useState('members');
  const [message, setMessage] = useState('');

  const handleExport = () => {
    setMessage('');
    const mockExcelData = "Nama,No. Anggota,Sabuk\nBudi Santoso,KSK-001,Putih\nSiti Aminah,KSK-002,Kuning";
    const blob = new Blob([mockExcelData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportType}-data-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMessage(`Data ${exportType} berhasil diekspor ke Excel.`);
  };

  return (
    <div className="container mx-auto p-8 pt-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Ekspor Data</h1>
      <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
        {message && <p className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">{message}</p>}

        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center"><Download size={24} className="mr-3 text-purple-500" /> Ekspor Data ke Excel</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="exportType" className="block text-gray-700 font-medium mb-2">Jenis Data yang Diekspor</label>
            <select
              id="exportType"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
            >
              <option value="members">Data Anggota</option>
              <option value="attendances">Data Kehadiran</option>
              <option value="payments">Data Pembayaran</option>
              {/* Tambahkan opsi lain sesuai kebutuhan */}
            </select>
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <Download size={20} className="mr-2" /> Unduh Data Excel
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('home'); // State untuk routing
  const [selectedMemberId, setSelectedMemberId] = useState(null); // Untuk detail anggota

  // Mengarahkan user setelah login
  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === 'pelatih') {
        setCurrentView('coach-dashboard');
      } else if (currentUser.role === 'anggota') {
        setCurrentView('member-profile');
      } else if (currentUser.role === 'penguji') {
        setCurrentView('exam-manager'); // Penguji langsung ke halaman ujian
      }
    }
  }, [isAuthenticated, currentUser]);

  // Fungsi untuk merender tampilan berdasarkan currentView
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'coaches':
        return <CoachesPage />;
      case 'locations':
        return <LocationsPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} />;
      case 'coach-dashboard':
        return isAuthenticated && currentUser.role === 'pelatih' ? <CoachDashboard setCurrentView={setCurrentView} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'member-list':
        return isAuthenticated && currentUser.role === 'pelatih' ? <MemberList setCurrentView={setCurrentView} setSelectedMemberId={setSelectedMemberId} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'member-detail':
        return isAuthenticated && (currentUser.role === 'pelatih' || currentUser.id === selectedMemberId) ? <MemberDetail setCurrentView={setCurrentView} selectedMemberId={selectedMemberId} /> : <p className="text-center p-8">Akses ditolak.</p>;
      case 'member-profile':
        return isAuthenticated && currentUser.role === 'anggota' ? <MemberDetail setCurrentView={setCurrentView} selectedMemberId={currentUser.id} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai anggota.</p>;
      case 'attendance-scanner':
        return isAuthenticated && currentUser.role === 'pelatih' ? <AttendanceScanner setCurrentView={setCurrentView} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'payment-manager':
        return isAuthenticated && currentUser.role === 'pelatih' ? <PaymentManager setCurrentView={setCurrentView} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'exam-manager':
        return isAuthenticated && (currentUser.role === 'pelatih' || currentUser.role === 'penguji') ? <ExamManager setCurrentView={setCurrentView} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai pelatih/penguji.</p>;
      case 'achievement-manager':
        return isAuthenticated && currentUser.role === 'pelatih' ? <AchievementManager setCurrentView={setCurrentView} /> : <p className="text-center p-8">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'export-data':
        return isAuthenticated && (currentUser.role === 'pelatih' || currentUser.role === 'admin_cabang') ? <ExportData setCurrentView={setCurrentView} /> : <p className="text-center p-8">Akses ditolak.</p>;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar setCurrentView={setCurrentView} />
      <main className="pb-10"> {/* Padding bottom for content */}
        {renderView()}
      </main>
    </div>
  );
}

// Wrap App with AuthProvider
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;

