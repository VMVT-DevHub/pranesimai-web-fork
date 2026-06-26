import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { useQuery } from '@tanstack/react-query';

export const useWindowSize = (width: string) => {
  const [isInRange, setIsInRange] = useState(false);

  const handleResize = useCallback(() => {
    const mediaQuery = window.matchMedia(width);
    setIsInRange(mediaQuery.matches);
  }, [width]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return isInRange;
};

export interface User {
  userId: string;
  email?: string;
  phone?: string;
  firstName: string;
  lastName: string;
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: false,
  isLoggedIn: false,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await api.getUser();
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 0,
  });

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
