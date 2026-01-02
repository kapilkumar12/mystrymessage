"use client"
import { Message, User } from '@/model/User';
// import { acceptMessagesSchema } from '@/schemas/acceptMessagesSchema';
// import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { AcceptMessagesData, ApiResponse, MessagesData } from '@/types/ApiResponse';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';

const page = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingLoading, setIsSwitchingLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState("")
  const [acceptMessages, setAcceptMessages] = useState<boolean>(false)

  
  const handleDeleteMessage =  (messageId: string) =>{
    setMessages(messages.filter((message)=> message._id.toString() !== messageId))
  }

  const {data:session, status} = useSession();


  const fetchAcceptMessage = useCallback( async () =>{
  setIsSwitchingLoading(true)
  try {   
   
   const response = await axios.get<ApiResponse<AcceptMessagesData & MessagesData>>('/api/accept-messages') 
   const data = response.data.data;

if (response.data.success && data) {
  setAcceptMessages(data.isAcceptingMessages);
}

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error",{
        description: axiosError.response?.data.message || "Failed to fetch accept messages setting"
      })
      
    } finally{
      setIsSwitchingLoading(false)
    }

  }, [])

  const fetchMessages = useCallback( async (refresh: boolean = false) =>{
    setIsLoading(true)
    // setIsSwitchingLoading(false)
  try {     
   const response = await axios.get<ApiResponse<AcceptMessagesData & MessagesData>>('/api/get-messages')
      console.log("API RESPONSE 👉", response.data)
      const data = response.data.data;

      if (response.data.success && data) {
        setMessages(data.messages);
      }
 
   if(refresh){
    toast("Messages refreshed",{
      description: "Showing latest messages"
    })
   }

    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error",{
        description: axiosError.response?.data.message || "Failed to fetch accept messages setting"
      })
      
    } finally{
      setIsLoading(false)
      setIsSwitchingLoading(false)
    }


  }, [setIsLoading, setMessages])

  useEffect(() => {

    if (!session || !session.user) return;
    // fetchAcceptMessage();
    fetchMessages();

  }, [session, fetchMessages])
  
  // handle accept messages toggle

  const handleSwitchToggle = async (checked: boolean) => {
    try {
      setIsSwitchingLoading(true)
      const response = await axios.post<ApiResponse<AcceptMessagesData>>('/api/accept-messages', {
        acceptMessages: checked   
      })
      console.log("response",response)
     const data = response.data.data;

      if (response.data.success && data) {
        setAcceptMessages(data.isAcceptingMessages);
      }
      toast.success(response.data.message, {
        description: "Accept messages setting updated"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error",{
        description: axiosError.response?.data.message || "Failed to fetch accept messages setting"
      })
    }finally {
    setIsSwitchingLoading(false)
  }
  }

 const username = session?.user?.username;
useEffect(() => {
  setBaseUrl(`${window.location.protocol}//${window.location.host}`)
}, [])
const profileUrl = `${baseUrl}/me/${username}`

const copyToClipboard = () => {
 navigator.clipboard.writeText(profileUrl);
 toast("URL Copied",{
  description: "Profile URL has been copied to clipboard"
 })
}

  if (!session || !session.user) {
    return <div>Please log in to view your dashboard.</div>
  }


  return (

    <div className='my-8 mx-4 md:mx-auto p-6 bg-white rounded max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
    <div className='mb-4'>
      <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>
      <div className='flex items-center'>
        <input
          type="text"
          value={profileUrl}
          readOnly
          className='input input-bordered w-full p-2 border rounded-l'
        />
        <button
          onClick={copyToClipboard}
          className='bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 cursor-pointer'
        >
          Copy
        </button>
      </div>
    </div>

    <div className='mb-4'>
    <Switch     
     checked = {acceptMessages}
     onCheckedChange={handleSwitchToggle}
     disabled={isSwitchingLoading} 
     />
     <span className='ml-2'>
      Accept Message: {acceptMessages ? 'On' : 'Off'}
     </span> 
    </div>
    <Separator />

    <Button className='mt-4 cursor-pointer' variant="outline" onClick={(e)=>{
      e.preventDefault();
      fetchMessages(true)
    }}>

    { isLoading ?(
      <Loader2 className='h-4 w-4 animate-spin' />
    ) : (
      <RefreshCcw className='h-4 w-4' />
    )}
    </Button>

    <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
    {messages.length>0 ?(
      messages.map((message, index)=>(
       <MessageCard key={message._id.toString()} message={message} onMessageDelete={handleDeleteMessage} /> 
      ))
    ) : (
      <p>No Message to display</p>
    ) }  
    </div>

    </div>
  )
}

export default page