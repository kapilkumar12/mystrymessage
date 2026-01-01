"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios, { AxiosError } from "axios"
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from "@/types/ApiResponse"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { Form } from "@/components/ui/form"
import { useParams } from "next/navigation"
import {
  Field,
//   FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from '@/components/ui/textarea'

const page = () => {
const params = useParams()
const username = params.username as string
const [isSubmitting, setIsSubmitting] = useState(false)
const [questions, setQuestions] = useState("");
const [loading, setLoading] = useState(false);
 const [acceptMessages, setAcceptMessages] = useState(true)

const form = useForm<z.infer<typeof messageSchema>>({
  resolver: zodResolver(messageSchema),
  defaultValues: {
    content: ''
  }
})

 const { setValue } = form

  // Fetch Accept Messages status on load
  useEffect(() => {
    const fetchAcceptStatus = async () => {
      try {
        const res = await fetch(`/api/accept-messages-status?username=${username}`)
        const data = await res.json()
        setAcceptMessages(data.acceptMessages)
      } catch {
        setAcceptMessages(true) // default allow
      }
    }
    fetchAcceptStatus()
  }, [username])

const onSubmit = async (data: z.infer<typeof messageSchema>) => {
  if (!acceptMessages) {
      toast.error("This user is not accepting messages right now")
      return
    }
  setIsSubmitting(true)
  try {

    const response = await axios.post<ApiResponse>('/api/send-message', {
      username,
      content:data.content
    })

    toast.success("Success", {
     description: response.data.message,
    })

    form.reset()

  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>

      toast.error("Message send failed", {
        description:
          axiosError.response?.data.message ||
          "Error during message send",
      })
    } finally {
      setIsSubmitting(false)
    }
}

const suggestMessages = async () => {
  setLoading(true);
  setQuestions("");
  try {
    const res = await fetch("/api/suggest-message", { method: "POST" });
    const data = await res.json();

    if (data.success && data.questions) {
      setQuestions(data.questions);
    } else {
      console.error("AI returned error:", data.error || "Empty response");
      toast.error(data.error?.message || "AI returned empty response");
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
    toast.error("Failed to fetch questions");
  } finally {
    setLoading(false);
  }
};


const handleQuestionClick = (q: string) => {
  setValue("content", q);
};

const questionList = questions
  ? questions.split("||").map(q => q.trim()).filter(Boolean)
  : [];



  return (
  
    <div className='my-6 mx-4 md:mx-auto p-6 bg-white rounded max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Public Profile Link</h1>
    <div className='mb-4'>
 
     <Form {...form}>  
      <form onSubmit={form.handleSubmit(onSubmit)}>

      <FieldGroup>

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                  Send Anonymous Message to @{username}
                  </FieldLabel>
                  <Textarea
                    {...field}
                    placeholder={
                      acceptMessages
                        ? "Write your message here..."
                        : "This user is not accepting messages"
                    }
                    disabled={!acceptMessages}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
                  
          </FieldGroup>

        <div className="flex [flex-direction:inherit!] justify-center! mt-4">
        <Button type="submit" disabled={isSubmitting} className="w-fit! px-7 cursor-pointer">{isSubmitting ? "Sending..." : "Send it"}</Button>

        </div>

      </form>
     </Form>


      <div>
        <div className='mt-4 mb-4'>
        <Button 
        onClick={suggestMessages}
        disabled={loading}
          className='w-full md:w-auto cursor-pointer'
        >
        {loading ? "Generating..." : "Generate Suggest Messages"}
        </Button>
        <div className="mt-4 whitespace-pre-wrap">
        {questionList.map((q, i) => (
          <div key={i} className="p-3 border rounded bg-gray-50 mb-2 cursor-pointer" onClick={() => handleQuestionClick(q)}>
            {q}
          </div>
        ))}
      </div>
        </div>

      </div>
    </div>


    </div>


  )
}

export default page