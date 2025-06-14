import React, { useState, useEffect } from 'react';
// Import AuthProvider dan useAuth dari konteks autentikasi
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';

// Import semua komponen halaman publik
// HomePage sekarang akan berisi konten landing page
import HomePage from './components/public/HomePage.jsx';
// Menghapus impor ini karena kontennya sudah diintegrasikan ke HomePage.jsx
// import CoachesPage from './components/public/CoachesPage.jsx';
// import LocationsPage from './components/public/LocationsPage.jsx';
// import ContactPage from './components/public/ContactPage.jsx';

// Import komponen autentikasi
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';

// Import komponen dashboard dan modul terkait
import CoachDashboard from './components/dashboard/CoachDashboard.jsx';
import MemberList from './components/dashboard/MemberList.jsx';
import MemberDetail from './components/dashboard/MemberDetail.jsx';
import AttendanceScanner from './components/dashboard/AttendanceScanner.jsx';
import PaymentManager from './components/dashboard/PaymentManager.jsx';
import ExamManager from './components/dashboard/ExamManager.jsx';
import AchievementManager from './components/dashboard/AchievementManager.jsx';
import AddAchievement from './components/dashboard/AddAchievement.jsx';
import ExportData from './components/dashboard/ExportData.jsx';

// Import komponen umum
import Navbar from './components/common/Navbar.jsx';

// --- Data Mock (Simulasi Database Backend) ---
const mockData = {
  users: [
    { id: 'user1', username: 'anggota001', password: 'password', role: 'anggota', fullName: 'Budi Santoso', email: 'budi@example.com', phone: '081234567890', dojoId: 'dojo1', uniqueMemberId: 'KSK-001', currentBeltId: 'belt1', status: 'aktif', dateOfBirth: '2000-01-15', placeOfBirth: 'Bandung', address: 'Jl. Contoh No.1' },
    { id: 'user2', username: 'pelatih1', password: 'password', role: 'pelatih', fullName: 'Sensei Rudi', email: 'rudi@example.com', phone: '081122334455', dojoId: 'dojo1', profilePicture: 'https://placehold.co/100x100/5e72e4/ffffff?text=SR' },
    { id: 'user3', username: 'anggota002', password: 'password', role: 'anggota', fullName: 'Siti Aminah', email: 'siti@example.com', phone: '087654321098', dojoId: 'dojo1', uniqueMemberId: 'KSK-002', currentBeltId: 'belt2', status: 'aktif', dateOfBirth: '1998-05-20', placeOfBirth: 'Cimahi', address: 'Jl. Mekar No.5' },
    { id: 'user4', username: 'pelatih2', password: 'password', role: 'pelatih', fullName: 'Sensei Lia', email: 'lia@example.com', phone: '089876543210', dojoId: 'dojo2', profilePicture: 'https://placehold.co/100x100/f87979/ffffff?text=SL' },
    { id: 'user5', username: 'penguji1', password: 'password', role: 'penguji', fullName: 'Shihan Ahmad', 'email': 'ahmad@example.com', phone: '081212121212', branchId: 'branch1', profilePicture: 'https://placehold.co/100x100/50b86a/ffffff?text=SA' },
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

// --- Komponen Utama Aplikasi ---
function App() {
  const { isAuthenticated, currentUser } = useAuth();
  const [currentView, setCurrentViewInternal] = useState({ view: 'home', targetId: null });
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Wrapper untuk setCurrentView agar bisa menerima targetId
  const setCurrentView = (viewName, targetId = null) => {
    setCurrentViewInternal({ view: viewName, targetId: targetId });
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === 'pelatih') {
        setCurrentView('coach-dashboard');
      } else if (currentUser.role === 'anggota') {
        setCurrentView('member-profile');
      } else if (currentUser.role === 'penguji') {
        setCurrentView('exam-manager');
      }
    }
  }, [isAuthenticated, currentUser, setCurrentView]);

  const renderView = () => {
    switch (currentView.view) {
      case 'home':
        return <HomePage targetSectionId={currentView.targetId} />;
      // Rute 'coaches', 'locations', 'contact' dihapus karena sudah diintegrasikan ke HomePage
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
        return <HomePage targetSectionId={null} />;
    }
  };

  return (
    <div className="min-h-screen font-inter bg-[url('https://images.unsplash.com/photo-1544377193-4a1122a2753a?q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-fixed bg-cover bg-center">
      <Navbar setCurrentView={setCurrentView} />
      <main className="pb-10">
        {renderView()}
      </main>
    </div>
  );
}

export { mockData };

const AppWrapper = () => (
  <AuthProvider initialData={mockData}>
    <App />
  </AuthProvider>
);

export default AppWrapper;
