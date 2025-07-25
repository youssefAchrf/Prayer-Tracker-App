// // File: AuthContext.tsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { supabase, isSupabaseConfigured } from '@/lib/supabase';
// import { User, Session } from '@supabase/supabase-js';
// import { router } from 'expo-router';

// interface AuthContextType {
//   user: User | null;
//   session: Session | null;
//   loading: boolean;
//   isConfigured: boolean;
//   signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
//   signIn: (email: string, password: string) => Promise<{ error: any }>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isConfigured] = useState(isSupabaseConfigured());

//   useEffect(() => {
//     if (!isConfigured) {
//       const demoUser = { id: 'demo-user-id', email: 'demo@example.com' } as User;
//       setUser(demoUser);
//       setLoading(false);
//       return;
//     }

//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
//         // setLoading(false); // THIS LINE IS REMOVED
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, [isConfigured]);

//   const signUp = async (email: string, password: string, name: string) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name: name,
//         }
//       }
//     });
//     return { error };
//   };

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     return { error };
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     router.replace('/(auth)/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, session, loading, isConfigured, signUp, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { router } from 'expo-router';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isConfigured) {
      const demoUser = { id: 'demo-user-id', email: 'demo@example.com' } as User;
      setUser(demoUser);
      setLoading(false);
      return;
    }

    setLoading(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name: name } } });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isConfigured, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}