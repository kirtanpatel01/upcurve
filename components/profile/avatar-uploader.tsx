'use client'

import React from 'react'
import Image from 'next/image'
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { upload } from '@imagekit/next'
import { toast } from 'sonner'
import { UseFormReturn } from 'react-hook-form'
import { ProfileFormValues } from '@/types/next-auth-d'

function AvatarUploader({
  form,
  isAuthenticated,
}: {
  form: UseFormReturn<ProfileFormValues>,
  isAuthenticated: boolean
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const res = await fetch("/api/upload-auth")
      const { signature, expire, token, publicKey } = await res.json()

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
      })

      form.setValue("avatar", uploadResponse.url ?? "")
      toast.success("Avatar updated!")
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Failed to upload avatar.")
    }
  }

  return (
    <FormField
      control={form.control}
      name='avatar'
      render={() => (
        <FormItem className='flex flex-col items-center'>
          <Image
            src={form.watch('avatar') || 'profle.svg'}
            alt='avatar'
            height={100}
            width={100}
            className='rounded-full size-32 cursor-pointer object-cover'
            onClick={() => fileInputRef.current?.click()}
            unoptimized
          />
          <FormControl>
            <input
              type='file'
              accept='image/*'
              hidden
              ref={fileInputRef}
              className='hidden'
              onChange={handleUpload}
              disabled={!isAuthenticated}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default AvatarUploader
