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

// --- Data Mock (Simulasi Database Backend - akan diganti oleh Firestore nanti) ---
const mockData = {
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
  const { isAuthenticated, currentUser, loading } = useAuth();
  const [currentView, setCurrentViewInternal] = useState({ view: 'home', targetId: null });
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  // Wrapper untuk setCurrentView agar bisa menerima targetId
  const setCurrentView = (viewName, targetId = null) => {
    setCurrentViewInternal({ view: viewName, targetId: targetId });
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (currentUser.role === 'pelatih') {
        setCurrentView('coach-dashboard');
      } else if (currentUser.role === 'anggota') {
        setCurrentView('member-profile');
      } else if (currentUser.role === 'penguji') {
        setCurrentView('exam-manager');
      }
    }
  }, [isAuthenticated, currentUser, loading, setCurrentView]);

  const renderView = () => {
    if (loading) {
      return <div className="text-center p-8 text-white">Memuat aplikasi...</div>;
    }

    switch (currentView.view) {
      case 'home':
        return <HomePage targetSectionId={currentView.targetId} />;
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} />;
      case 'coach-dashboard':
        // Simulasikan role karena belum ada di Firebase user object langsung
        const isCoach = isAuthenticated && currentUser && currentUser.email.includes('pelatih');
        return isCoach ? <CoachDashboard setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'member-list':
        const isCoachForMemberList = isAuthenticated && currentUser && currentUser.email.includes('pelatih');
        return isCoachForMemberList ? <MemberList setCurrentView={setCurrentView} setSelectedMemberId={setSelectedMemberId} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'member-detail':
        const isAuthorizedToViewMember = isAuthenticated && ( (currentUser && currentUser.email.includes('pelatih')) || (currentUser && currentUser.uid === selectedMemberId) );
        return isAuthorizedToViewMember ? <MemberDetail setCurrentView={setCurrentView} selectedMemberId={selectedMemberId} /> : <p className="text-center p-8 text-red-500">Akses ditolak.</p>;
      case 'member-profile':
        const isMemberProfile = isAuthenticated && currentUser && currentUser.email.includes('anggota');
        return isMemberProfile ? <MemberDetail setCurrentView={setCurrentView} selectedMemberId={currentUser.uid} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai anggota.</p>;
      case 'attendance-scanner':
        const isCoachForAttendance = isAuthenticated && currentUser && currentUser.email.includes('pelatih');
        return isCoachForAttendance ? <AttendanceScanner setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'payment-manager':
        const isCoachForPayment = isAuthenticated && currentUser && currentUser.email.includes('pelatih');
        return isCoachForPayment ? <PaymentManager setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'exam-manager':
        const isExamManager = isAuthenticated && currentUser && (currentUser.email.includes('pelatih') || currentUser.email.includes('penguji'));
        return isExamManager ? <ExamManager setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih/penguji.</p>;
      case 'achievement-manager':
        const isCoachForAchievement = isAuthenticated && currentUser && currentUser.email.includes('pelatih');
        return isCoachForAchievement ? <AchievementManager setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'export-data':
        const isAuthorizedForExport = isAuthenticated && currentUser && (currentUser.email.includes('pelatih') || currentUser.email.includes('admin_cabang'));
        return isAuthorizedForExport ? <ExportData setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak.</p>;
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
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
