'use client';

import SubmitBtn from '@/components/submit-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

function ResetPageContent() {
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post('/api/verify-token', { token });
        setEmail(res.data.email);
      } catch (error) {
        console.log(error);
        toast.error('Invalid or expired link');
        router.push('/auth/login');
      }
    };

    if (token) verifyToken();
    else router.push('/auth/login');
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const newPassword = formData.get('newPassword')?.toString();
      const confirmPassword = formData.get('confirmPassword')?.toString();

      if (!newPassword || !confirmPassword) {
        toast.error('Both password fields required!');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match!');
        setLoading(false);
        return;
      }
      await axios.post('/api/reset-password', { email, newPassword });
      toast.success('Password reset successfully');
      setSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        console.log("Unknown error:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
      {!success ? (
        <Card className='w-full max-w-96'>
          <CardHeader className='text-center'>
            <CardTitle>Reset Your Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <Input placeholder='New Password...' name='newPassword' />
              <Input placeholder='Re-Enter Password...' name='confirmPassword' />
              <SubmitBtn text='Save' loadingText='Saving...' isLoading={isLoading} />
            </form>
          </CardContent>
        </Card>
      ) : (
        <div>
          <span>Your password has changed!</span>
          <Link href='/auth/login'>
            <Button variant={'link'} className='cursor-pointer'>
              Back to Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPageContent />
    </Suspense>
  );
}
