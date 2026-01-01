"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user:User = session?.user as User


  return (
    <nav className='p-4 md:px-6 md:py-4 shadow-md'>
    <div className='container mx-auto flex justify-between items-center flex-col md:flex-row'>    
    <Link href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</Link> 
    {session ? (
     <>
     <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
     <Button className='w-full md:w-auto cursor-pointer' onClick={()=>signOut()}>Logout</Button>
     </>
     ):(
        <Link href="/sign-in"><Button className='w-full md:w-auto cursor-pointer'>Login</Button></Link>
     )} 
     </div>  
    </nav>
  )
}

export default Navbar