import { Metadata } from 'next';
import React from 'react'
import ClientPage from './client-page';

export const metadata: Metadata = {
    title: "Kiton - Forgot Password",
    description: "Enter your email to reset your account password",
};

export default function page() {
  return (
    <div>
        <ClientPage />
    </div>
  )
}