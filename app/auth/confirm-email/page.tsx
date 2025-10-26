import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='p-24 bg-base-300/50 border border-base-100 flex flex-col items-center'>
        <p>Please confirm your email to sign up, go to your email!</p>
        <div className='flex items-center gap-1'>
          <span>Are you using Gmail ?</span>
          <Link href="https://mail.google.com/"><button className='btn btn-link capitalize'>Open my gmail inbox</button></Link>
        </div>
      </div>
    </div>
  )
}

export default page