import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, initialData }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(initialData); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username, password) => { 
    // Stub fungsionalitas login - akan diimplementasikan nanti
    console.log('Simulasi login untuk:', username);
    if (username === 'testuser' && password === 'password') {
      const mockUser = { id: 'user1', username: 'testuser', role: 'anggota', fullName: 'Test Anggota' };
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    }
    return { success: false, message: 'Username atau password salah (mock).' }; 
  };

  const register = async (userData) => { 
    // Stub fungsionalitas register - akan diimplementasikan nanti
    console.log('Simulasi register untuk:', userData);
    return { success: false, message: 'Pendaftaran tidak diimplementasikan penuh di mock ini.' }; 
  };

  const logout = () => { 
    setCurrentUser(null); 
    setIsAuthenticated(false); 
    localStorage.removeItem('currentUser'); 
    console.log('User logged out.');
  };

  const updateData = async (newData) => { 
    // Stub fungsionalitas update data - akan diimplementasikan nanti
    setData(prev => ({ ...prev, ...newData })); 
    console.log('Data diupdate (mock):', newData);
  };

  const authContextValue = {
    currentUser, isAuthenticated, login, logout, register, data, updateData
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
