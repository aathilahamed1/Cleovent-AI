
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const FormSchema = z
  .object({
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (isClient && !isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router, isClient]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
    } catch (error: any) {
        let description = 'An unknown error occurred. Please try again.';
        if (error.code === 'auth/identity-toolkit-api-has-not-been-used-before-or-it-is-disabled') {
            description = 'Authentication service is not enabled. Please enable the Identity Toolkit API in your Google Cloud project.';
        } else if (error.code === 'auth/email-already-in-use') {
            description = 'This email address is already in use. Please try signing in.';
        } else if (error.code === 'auth/operation-not-allowed') {
            description = 'Email/Password sign-up is not enabled. Please enable it in your Firebase project settings.';
        } else if (error.message) {
            description = error.message;
        }

        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: description,
        });
        setIsSubmitting(false);
    }
  };

  if (!isClient || isUserLoading || user) {
    return null; // Render nothing until client is mounted and auth state is known
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="mx-auto">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="planner@example.com"
                          {...field}
                        />
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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
