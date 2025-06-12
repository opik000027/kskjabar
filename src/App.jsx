import React from 'react';
// Pastikan ekstensi .jsx disertakan. Nama folder 'contexts' harus semua huruf kecil.
// Nama file 'AuthContext.jsx' harus dengan 'A' dan 'C' besar.
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'; 

function App() {
  const { isAuthenticated } = useAuth(); // Menggunakan useAuth hook

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col p-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">
        🎉 Selamat! Aplikasi Berhasil Dimuat! 🎉
      </h1>
      <p className="text-lg text-gray-600 text-center">
        Ini adalah awal dari landing page Anda. Kita akan membangunnya dari sini.
      </p>
      <p className="mt-4 text-md text-gray-500">
        Status Otentikasi: {isAuthenticated ? 'Terotentikasi' : 'Belum Terotentikasi'}
      </p>
    </div>
  );
}

// Minimal mock data untuk inisialisasi AuthProvider
const initialMockData = {
  users: [],
  members: [],
  branches: [],
  dojos: [],
  belts: [],
  schedules: [],
  attendances: [],
  payments: [],
  gradingExams: [],
  achievements: [],
  trainingPrograms: [],
  memberProgress: [],
};

const AppWrapper = () => (
  <AuthProvider initialData={initialMockData}>
    <App />
  </AuthProvider>
);

export default AppWrapper;
