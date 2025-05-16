"use client"
import React from 'react'
import Sidebar from '@/app/components/Sidebar'
import Dashboard from '@/app/components/Dashboard';
import { useState } from 'react'

type Props = {}

const DashboardPage = (props: Props) => {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    return (
        <>  
            <Sidebar setSideBarOpen={setSideBarOpen}  />
            <div className='bg-white ml-2 w-[98vw] h-full flex items-start justify-end' >
                <Dashboard sideBarOpen={sideBarOpen} />
            </div>
        </>
    )
}

export default DashboardPage