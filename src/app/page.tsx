"use client"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
export default function Home() {
  const router = useRouter()
// dorega4333@ethsms.com
  useEffect(() => {
    router.push("/signin")
  }, [])
  return (
    <></>
  );
}
