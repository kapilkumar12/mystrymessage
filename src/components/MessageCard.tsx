"use client"
import React from 'react'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { toast } from 'sonner'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps={
    message:Message;
    onMessageDelete: (messageId: string)=> void
}


const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

const handleDeleteConfirm = async () => {
const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
toast(response.data.message)

onMessageDelete(message._id.toString())
}

  return (
  <Card className="w-full max-w-sm relative">
    <CardHeader className='absolute right-8'>

    <AlertDialog>
      <AlertDialogTrigger asChild>
       <Button size="icon" variant="destructive">
              <X className="w-4 h-4" />
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </CardHeader>
      <CardContent className='pr-16'>
        <p className="text-gray-800 whitespace-pre-wrap text-2xl font-semibold">
          {message.content}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pr-16">
        {new Date(message.createdAt).toLocaleString()}
      </CardFooter>
    </Card>
  )
}

export default MessageCard