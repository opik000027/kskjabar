    import React, { createContext, useContext, useState } from 'react';

    // Buat Context baru
    const AuthContext = createContext(null);

    // Custom hook untuk menggunakan AuthContext
    export const useAuth = () => {
      return useContext(AuthContext);
    };

    // AuthProvider Component
    export const AuthProvider = ({ children, initialData }) => {
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const [currentUser, setCurrentUser] = useState(null);
      // Data aplikasi (mock) sekarang dikelola di sini
      const [data, setData] = useState(initialData); 

      // Fungsi untuk simulasi login
      const login = (username, password) => {
        const user = data.users.find(
          (u) => u.username === username && u.password === password
        );
        if (user) {
          setIsAuthenticated(true);
          setCurrentUser(user);
          return true; // Login berhasil
        }
        return false; // Login gagal
      };

      // Fungsi untuk simulasi logout
      const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
      };

      // Fungsi untuk simulasi registrasi
      const register = (newUser) => {
        // Cek apakah username sudah ada
        if (data.users.some(u => u.username === newUser.username)) {
            return false; // Username sudah terdaftar
        }
        // Tambahkan user baru ke data mock
        const newUserId = `user${data.users.length + 1}`;
        const userWithId = { ...newUser, id: newUserId, status: 'aktif' };
        setData(prevData => ({
            ...prevData,
            users: [...prevData.users, userWithId]
        }));
        // Langsung login user setelah registrasi berhasil
        setIsAuthenticated(true);
        setCurrentUser(userWithId);
        return true; // Registrasi berhasil
      };

      // Fungsi untuk memperbarui data (contoh: menambahkan anggota baru, pembayaran, dll.)
      const updateData = (dataType, newItem) => {
        setData(prevData => ({
          ...prevData,
          [dataType]: [...prevData[dataType], newItem]
        }));
      };

      const authValue = {
        isAuthenticated,
        currentUser,
        login,
        logout,
        register,
        data, // Memberikan akses ke data mock dari konteks
        updateData,
      };

      return (
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      );
    };
    
