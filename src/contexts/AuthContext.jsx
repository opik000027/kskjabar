import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Diperlukan untuk inisialisasi, meskipun belum digunakan untuk data

const AuthContext = createContext();

export const AuthProvider = ({ children, initialData }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Status loading untuk autentikasi awal

  let app;
  let auth;
  let db; // Firestore instance, will be used later

  useEffect(() => {
    try {
      // Periksa apakah Firebase sudah diinisialisasi untuk menghindari error re-initialization
      if (!app) {
        // __firebase_config dan __app_id adalah variabel global yang disediakan oleh lingkungan Canvas
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        app = initializeApp(firebaseConfig);
      }
      if (!auth) {
        auth = getAuth(app);
      }
      if (!db) {
        db = getFirestore(app);
      }

      // Handle initial custom token sign-in if provided by Canvas
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

      if (initialAuthToken && !isAuthenticated) {
        signInWithCustomToken(auth, initialAuthToken)
          .then((userCredential) => {
            setCurrentUser(userCredential.user);
            setIsAuthenticated(true);
            setLoading(false);
            console.log('Signed in with custom token:', userCredential.user);
          })
          .catch((error) => {
            console.error('Error signing in with custom token:', error);
            // Fallback to anonymous sign-in if custom token fails or is not available
            signInAnonymously(auth).then((userCredential) => {
              setCurrentUser(userCredential.user);
              setIsAuthenticated(true);
              console.log('Signed in anonymously:', userCredential.user);
            }).catch(anonError => {
              console.error('Error signing in anonymously:', anonError);
              setLoading(false); // Stop loading even if anonymous sign-in fails
            });
          });
      } else {
        // Setup listener for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
          setLoading(false); // Stop loading once auth state is determined
        });
        return () => unsubscribe(); // Cleanup listener on unmount
      }
    } catch (error) {
      console.error("Firebase initialization error:", error);
      setLoading(false);
    }
  }, [isAuthenticated]); // Rerun if isAuthenticated changes (e.g., after custom token sign-in)

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // In a real app, you might fetch user roles from Firestore here
      // For now, let's assume a default role or fetch from mock if user exists
      const user = userCredential.user;
      console.log('User logged in:', user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login gagal. Silakan coba lagi.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Email atau kata sandi salah.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Kredensial tidak valid.';
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role = 'anggota') => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Anda bisa menambahkan data pengguna tambahan (seperti peran) ke Firestore di sini setelah user dibuat
      // Untuk saat ini, kita akan menganggap peran default 'anggota' untuk tujuan demo.
      const user = userCredential.user;
      // Simpan peran di objek user sementara untuk demo
      const userWithRole = { ...user, role: role }; 
      console.log('User registered:', userWithRole);
      setCurrentUser(userWithRole); // Set user dengan peran
      setIsAuthenticated(true);
      return { success: true, user: userWithRole };
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Pendaftaran gagal. Silakan coba lagi.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email sudah terdaftar.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Kata sandi terlalu lemah (minimal 6 karakter).';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      console.log('User logged out.');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Gagal logout. Silakan coba lagi.' };
    } finally {
      setLoading(false);
    }
  };

  // AuthContext Provider akan memberikan nilai-nilai ini ke semua komponen anaknya
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    auth, // Berikan instance auth
    db // Berikan instance db
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children hanya setelah loading selesai */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
