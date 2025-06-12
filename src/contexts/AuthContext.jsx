import React, { useState, useEffect, createContext, useContext } from 'react';

// Buat AuthContext
const AuthContext = createContext(null);

// Fungsi utilitas untuk mensimulasikan panggilan API dengan penundaan
const mockApiCall = (data, delay = 500) => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

// AuthProvider adalah komponen yang akan membungkus seluruh aplikasi Anda
// dan menyediakan nilai dari AuthContext kepada semua komponen di dalamnya.
export const AuthProvider = ({ children, initialData }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Menggunakan initialData yang diteruskan sebagai prop
  const [data, setData] = useState(initialData);

  // Menginisialisasi user saat aplikasi dimuat (misalnya dari local storage)
  // dan juga mensimulasikan pemuatan data awal
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
    // Jika tidak ada data awal yang disediakan (misalnya dari mockData),
    // Anda bisa memuatnya di sini dari API nyata.
    // Untuk demo ini, initialData sudah diset dari App.jsx
  }, []);

  // Fungsi login
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

  // Fungsi register anggota baru
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
    setData(prev => {
      // Pastikan members ada saat menambahkan anggota baru
      const updatedMembers = prev.members ? [...prev.members] : [];
      return {
        ...prev,
        users: [...prev.users, newUser],
        members: [...updatedMembers, {
          id: newUser.id, // Member ID sama dengan User ID untuk simplifikasi
          userId: newUser.id,
          dojoId: newUser.dojoId,
          uniqueMemberId: newUser.uniqueMemberId,
          currentBeltId: newUser.currentBeltId,
          membershipStatus: newUser.status,
          paymentType: 'bulanan', // Default
          joinDate: newUser.join_date,
        }]
      };
    });
    return { success: true, user: newUser };
  };

  // Fungsi logout
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Fungsi untuk memperbarui data aplikasi
  const updateData = async (newData) => {
    // Simulasi update data di backend
    await mockApiCall({});
    setData(prev => ({ ...prev, ...newData }));
  };

  // Nilai yang disediakan oleh AuthContext
  const authContextValue = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    register,
    data, // Menyediakan semua mock data melalui konteks
    updateData, // Fungsi untuk memperbarui mock data
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk memudahkan penggunaan AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
