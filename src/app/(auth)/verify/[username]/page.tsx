'use client'
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { Button } from '@/components/ui/button';


const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{username: string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
    })

    const onSubmit = async(data:z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verifyCode`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: "Success",
                description: response.data.message,
            })
            router.replace('/signin')
        } catch (error) {
            console.log("Error in verifying", error);
            
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })
        }
    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Account</h1>
                <p className='mb-4'>Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="verification code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className='mt-2' type='submit'>Verify</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default VerifyAccount