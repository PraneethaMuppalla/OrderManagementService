import { useMutation } from '@tanstack/react-query';
import { authService, RegisterRequest, LoginRequest } from '@/services/authService';
import { useAppDispatch } from './redux';
import { login as loginAction } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please sign in.');
      // Optionally auto-login after registration
      // For now, redirect to sign in page
      navigate('/signin');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook for user login
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      // Store auth data in Redux
      dispatch(loginAction({
        user: {
          id: response.user.id.toString(),
          name: response.user.name,
          email: response.user.email,
        },
        token: response.token,
      }));
      
      toast.success(`Welcome back, ${response.user.name}!`);
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    },
  });
};
