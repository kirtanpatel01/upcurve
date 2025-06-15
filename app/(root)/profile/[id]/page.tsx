import React from 'react'

function page({ params } : { params: { id: string } }) {
  const userId = params.id
  return (
    <div>Profile - {userId}</div>
  )
}

export default page