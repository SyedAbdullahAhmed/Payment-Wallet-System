"use client"
import React from 'react'
import SendPaymentForm from '@/app/components/SendPaymentForm'

type Props = {}

const Keys = (props: Props) => {
  return (
    <>  
        <div className='bg-slate-100 ml-2 h-full w-[98vw]  flex items-start justify-end' >
            <SendPaymentForm/>
        </div>
    </>
  )
}

export default Keys