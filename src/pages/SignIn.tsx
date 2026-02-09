import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/redux';
import { login } from '@/store/authSlice';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<SignInFormValues>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
          email: '',
          password: '',
      }
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SignInFormValues) => {
    // Simulate API call
    console.log('Sign In Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Dispatch login action (mock)
    dispatch(login({
      user: { id: '1', name: 'User', email: data.email },
      token: 'mock-token-123',
    }));
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-2xl rounded-2xl border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-black hover:text-gray-800 underline transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                            <Input placeholder="you@example.com" type="email" autoComplete="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input 
                                    placeholder="••••••••" 
                                    type={showPassword ? "text" : "password"} 
                                    autoComplete="current-password" 
                                    {...field} 
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <Button
                type="submit"
                className="w-full mt-2"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            </form>
         </Form>
      </div>
    </div>
  );
}
