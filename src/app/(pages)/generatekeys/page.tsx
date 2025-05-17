"use client"
import React from 'react'
import Sidebar from '@/app/components/Sidebar'
import GenerateKeys from '@/app/components/GenerateKeys';
import { useState } from 'react'



const GenerateKeysPage = () => {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    return (
        <>  
            <Sidebar setSideBarOpen={setSideBarOpen}  />
            <div className='bg-white ml-2 w-[98vw] h-full flex items-start justify-end' >
                <GenerateKeys sideBarOpen={sideBarOpen} />
            </div>
        </>
    )
}

export default GenerateKeysPage