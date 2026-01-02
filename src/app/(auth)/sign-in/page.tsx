"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import axios, {AxiosError} from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
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
import { signIn } from "next-auth/react"

const page = () => {

const router = useRouter()

// zod implementation

const form = useForm<z.infer<typeof signInSchema>>({
  resolver: zodResolver(signInSchema),
  defaultValues: {
    identifier: '',
    password: ''
  }
})


const onSubmit = async (data: z.infer<typeof signInSchema>) => {
const result = await signIn('credentials', { 
  redirect: false,
  identifier: data.identifier,
  password: data.password,
})
if (result?.error) {
  toast.error("Sign-in failed", {
    description: "Invalid credentials",
  })
} 

if (result?.url) {
  router.replace('/dashboard')
}
}

  return (
    <div className="flex justify-center p-4">
        <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl font-bold"><h1 className="text-center">Join Mystry Message</h1></CardTitle>
        <CardDescription className="text-center">
        Sign in to start your anonymous adventure
        </CardDescription>
      </CardHeader>
      <CardContent>

     <Form {...form}>  
      <form onSubmit={form.handleSubmit(onSubmit)}>


<FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                  Username/Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Username/Email"
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
        <Button type="submit" className="w-fit! px-7 cursor-pointer">Sign in</Button>

        </div>

      </form>
     </Form>

     
    </CardContent>
      <CardFooter className="block">

        <Field className="w-full">
    <div className="text-center mt-4">
     <p>Don’t have an account?
       <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign up</Link>
       </p>
     </div>
     </Field>
      </CardFooter>
    </Card>
    </div>
  )
}

export default page