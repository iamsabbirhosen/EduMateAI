'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check server-side auth
        const response = await fetch('/api/auth/admin', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Fallback: check localStorage
          const localAuth = localStorage.getItem('admin-authenticated');
          if (localAuth === 'true') {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        // Fallback: check localStorage
        const localAuth = localStorage.getItem('admin-authenticated');
        setIsAuthenticated(localAuth === 'true');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/admin', {
        method: 'DELETE',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin-authenticated');
      localStorage.removeItem('admin-user');
      router.push('/admin/login');
    }
  };

  return { isAuthenticated, isLoading, logout };
}
