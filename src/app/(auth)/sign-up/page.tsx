"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import axios, {AxiosError} from "axios"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


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

const page = () => {

const [username, setUsername] = useState('')
const [usernameMessage, setUsernameMessage] = useState('')
const [isCheckingUsername, setIsCheckingUsername] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
const debounced = useDebounceCallback(setUsername, 300)
const router = useRouter()

// zod implementation

const form = useForm<z.infer<typeof signUpSchema>>({
  resolver: zodResolver(signUpSchema),
  defaultValues: {
    username: '',
    email: '',
    password: ''
  }
})

useEffect(() => {
const CheckUsernameUnique = async () => {
  if (username) {
    setIsCheckingUsername(true)
    setUsernameMessage('')
    try {

      const response = await axios.get(`/api/check-username-unique?username=${username}`)
      console.log(response.data.message)
      setUsernameMessage(response.data.message)  

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(axiosError.response?.data.message || 'Error checking username')
    } finally {
      setIsCheckingUsername(false)
    }
  }
}
CheckUsernameUnique()
}, [username])

const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
  setIsSubmitting(true)
  try {

    const response = await axios.post<ApiResponse>('/api/sign-up', data)

    toast.success("Success", {
     description: response.data.message,
    })
    
    router.replace(`/verify/${data.username}`)

    setIsSubmitting(false)

  } catch (error) {
    console.error("Error during sign-up:", error)
     const axiosError = error as AxiosError<ApiResponse>;
     let errorMessage = axiosError.response?.data.message || 'Error during sign-up'
     toast.error("Sign-up failed", {
      description: errorMessage,
     })
     setIsSubmitting(false)
  }
}

  return (
    <div className="flex justify-center p-4">
        <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold"><h1 className="text-center">Join Mystry Message</h1></CardTitle>
        <CardDescription className="text-center">
        Sign up to start your anonymous adventure
        </CardDescription>
      </CardHeader>
      <CardContent>

     <Form {...form}>  
      <form onSubmit={form.handleSubmit(onSubmit)}>


<FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                  Username
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="off"
                    onChange={(e)=>{
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                  />
                  {
                    isCheckingUsername && <Loader2 className="animate-spin h-4 w-4 mr-2"/>
                  }
                  <p className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                  Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                  Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off" type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
                  
          </FieldGroup>

        <div className="flex [flex-direction:inherit!] justify-center! mt-4">
        <Button type="submit" disabled={isSubmitting} className="w-fit! px-7 cursor-pointer">
  {isSubmitting ? (
    <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
    </>

  ) : ('Sign Up')}
</Button>

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
