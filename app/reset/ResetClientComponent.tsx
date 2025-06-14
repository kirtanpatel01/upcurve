'use client';

import SubmitBtn from '@/components/submit-btn';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { account } from '@/lib/appwrite';

export default function ResetClientComponenet() {
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!userId || !secret) {
      toast.error('Missing token or user ID in URL');
      setLoading(false);
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error('Both password fields are required');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await account.updateRecovery(userId, secret, newPassword);
      toast.success('Password reset successfully');
      setSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error('Reset failed. Link might be expired or invalid.');
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
            <form className='space-y-4' onSubmit={handleReset}>
              <Input
                placeholder='New Password...'
                name='newPassword'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                placeholder='Re-Enter Password...'
                name='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <SubmitBtn text='Save' loadingText='Saving...' isLoading={isLoading} />
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className='text-center space-y-4'>
          <span>Your password has been changed!</span>
          <Link href='/auth/login'>
            <Button variant='link' className='cursor-pointer'>
              Back to Login
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}