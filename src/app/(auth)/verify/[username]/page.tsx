"use client"
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useForm, Controller } from "react-hook-form"
import { verifySchema } from '@/schemas/verifySchema'
import * as z  from "zod"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import {
  Field,
//   FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from 'react'

const page = () => {

const router = useRouter()
const params = useParams<{username: string}>()
  const [value, setValue] = useState("")

const form = useForm<z.infer<typeof verifySchema>>({
  resolver: zodResolver(verifySchema),
//   defaultValues: {
//     identifier: '',
//     password: ''
//   }
})

const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
       const response = await axios.post("/api/verify-code", {
            username: params.username,
            code: data.code
        })

         toast.success("Success", {
          description: response.data.message,
         })
        
         router.replace('/sign-in')


    } catch (error) {

        console.error("Error during sign-up:", error)
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error("Sign-up failed", {
          description: axiosError.response?.data.message || 'Error during sign-up'
         })
        
    }
}

  return (
        <div className="flex justify-center p-4">
        <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold"><h1 className="text-center">Verify Your Account</h1></CardTitle>
        <CardDescription className="text-center">
        Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>

     <Form {...form}>  
      <form onSubmit={form.handleSubmit(onSubmit)}>


<FieldGroup>

            <Controller 
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='flex [flex-direction:inherit!] justify-center!'>
                  <FieldLabel htmlFor="form-rhf-demo-title" className='text-center justify-center!'>
                   Verification Code
                  </FieldLabel>
                  {/* <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Code"
                    autoComplete="off"
                  /> */}
                  <div className='flex [flex-direction:inherit!] justify-center!'>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange} 
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  </div>
                </Field>
              )}
            />

                  
          </FieldGroup>

        <div className="flex [flex-direction:inherit!] justify-center! mt-4">
        <Button type="submit" className="w-fit! px-7 cursor-pointer">Verify Code</Button>
        </div>

      </form>
     </Form>

     
    </CardContent>
      <CardFooter className="block">

        <Field className="w-full">
    <div className="text-center mt-4">
     <p>Already a member?
       <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
       </p>
     </div>
     </Field>
      </CardFooter>
    </Card>
    </div>
  )
}

export default page
