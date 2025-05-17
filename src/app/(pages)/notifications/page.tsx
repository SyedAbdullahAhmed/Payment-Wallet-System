"use client"
import React from 'react'
import NotificationList from '@/app/components/NotificationList'
import Sidebar from '@/app/components/Sidebar'
import { useState } from 'react'



const Notification = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  return (
    <>  
        <Sidebar  setSideBarOpen={setSideBarOpen} />
        <div className='bg-white ml-2 w-[98vw] h-screen flex items-start justify-end' >
            <NotificationList sideBarOpen={sideBarOpen} />
        </div>
    </>
  )
}

export default Notification
