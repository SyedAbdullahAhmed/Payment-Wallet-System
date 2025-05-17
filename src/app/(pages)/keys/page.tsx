"use client"
import React from 'react'
import Sidebar from '@/app/components/Sidebar'
import PublicKeysList from '@/app/components/PublicKeysList'
import { useState } from 'react'


const Keys = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return (
    <>  
        <Sidebar setSideBarOpen={setSideBarOpen} />
        <div className='bg-white ml-2 w-[98vw] h-screen flex items-start justify-end' >
            <PublicKeysList sideBarOpen={sideBarOpen} />
        </div>
    </>
  )
}

export default Keys