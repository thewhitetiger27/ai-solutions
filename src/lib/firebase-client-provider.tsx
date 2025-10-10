'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from './firebase'; // assuming app is exported

const AuthContext = createContext<User | null>(null);

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or some loading component
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);