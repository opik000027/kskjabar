import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'; // Pastikan ekstensi .jsx

import HomePage from './components/public/HomePage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';

import CoachDashboard from './components/dashboard/CoachDashboard.jsx';
import MemberList from './components/dashboard/MemberList.jsx';
import MemberDetail from './components/dashboard/MemberDetail.jsx';
import AttendanceScanner from './components/dashboard/AttendanceScanner.jsx';
import PaymentManager from './components/dashboard/PaymentManager.jsx';
import ExamManager from './components/dashboard/ExamManager.jsx';
import AchievementManager from './components/dashboard/AchievementManager.jsx';
import AddAchievement from './components/dashboard/AddAchievement.jsx';
import ExportData from './components/dashboard/ExportData.jsx';

import Navbar from './components/common/Navbar.jsx';

// Data Mock yang akan tetap digunakan untuk sementara sampai semua diganti Firestore
const mockData = {
  // users data will now be handled by Firebase Auth
  branches: [
    { id: 'branch1', name: 'Kota Bandung', address: 'Jl. Asia Afrika No.1', contact: '022-123456' },
    { id: 'branch2', name: 'Kota Cimahi', address: 'Jl. Gandawijaya No.10', contact: '022-987654' },
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


function App() {
  const { isAuthenticated, currentUser, loading } = useAuth();
  const [currentView, setCurrentViewInternal] = useState({ view: 'home', targetId: null });
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const setCurrentView = (viewName, targetId = null) => {
    setCurrentViewInternal({ view: viewName, targetId: targetId });
  };

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Peran pengguna masih disimulasikan berdasarkan email sementara
      if (currentUser?.email?.includes('pelatih')) {
        setCurrentView('coach-dashboard');
      } else if (currentUser?.email?.includes('anggota')) {
        setCurrentView('member-profile');
      } else if (currentUser?.email?.includes('penguji')) {
        setCurrentView('exam-manager');
      }
    }
  }, [isAuthenticated, currentUser, loading, setCurrentView]);

  const renderView = () => {
    if (loading) {
      return <div className="text-center p-8 text-white">Memuat aplikasi...</div>;
    }

    // Role simulasi untuk demo, nanti akan didapatkan dari Firestore user profile
    const isCoach = isAuthenticated && currentUser?.email?.includes('pelatih');
    const isMember = isAuthenticated && currentUser?.email?.includes('anggota');
    const isExaminer = isAuthenticated && currentUser?.email?.includes('penguji');
    const isAdminBranch = isAuthenticated && currentUser?.email?.includes('admin_cabang'); // Contoh

    switch (currentView.view) {
      case 'home':
        return <HomePage targetSectionId={currentView.targetId} />;
      case 'login':
        return <LoginPage setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterPage setCurrentView={setCurrentView} />;
      case 'coach-dashboard':
        return isCoach ? <CoachDashboard setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'member-list':
        return isCoach ? <MemberList setCurrentView={setCurrentView} setSelectedMemberId={setSelectedMemberId} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'member-detail':
        const authorizedToViewDetail = isCoach || (isMember && currentUser?.uid === selectedMemberId);
        return authorizedToViewDetail ? <MemberDetail setCurrentView={setCurrentView} selectedMemberId={selectedMemberId} /> : <p className="text-center p-8 text-red-500">Akses ditolak.</p>;
      case 'member-profile':
        return isMember ? <MemberDetail setCurrentView={setCurrentView} selectedMemberId={currentUser.uid} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai anggota.</p>;
      case 'attendance-scanner':
        return isCoach ? <AttendanceScanner setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'payment-manager':
        return isCoach ? <PaymentManager setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'exam-manager':
        const authorizedToManageExam = isCoach || isExaminer;
        return authorizedToManageExam ? <ExamManager setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih/penguji.</p>;
      case 'achievement-manager':
        return isCoach ? <AchievementManager setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'add-achievement': // New case for adding achievement
        return isCoach ? <AddAchievement setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak. Silakan login sebagai pelatih.</p>;
      case 'export-data':
        const authorizedToExport = isCoach || isAdminBranch;
        return authorizedToExport ? <ExportData setCurrentView={setCurrentView} /> : <p className="text-center p-8 text-red-500">Akses ditolak.</p>;
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
