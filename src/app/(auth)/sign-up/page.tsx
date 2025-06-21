"use client";

import axios, { AxiosError } from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signup.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { set } from "mongoose";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const debounced = useDebounceCallback(setUsername, 500);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (e) {
                    const axiosError = e as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            "Error checking username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };

        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data
            );
            toast.success(response.data.message);
            router.replace(`/verify/${username}`);
        } catch (e) {
            console.error("error in sign up of user", e);
            const axiosError = e as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome to Incognit0
                    </h1>
                    <p className="mb-4">
                        Sign in to continue your secret conversations
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Moe Lester"
                                            {...field}
                                            onChange={(e) => {
                                                debounced(e.target.value);
                                                field.onChange(e);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${
                                                usernameMessage ===
                                                "Username is unique and available"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="moe_lester@gmail.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Moe Lester"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{" "}
                        <Link
                            href="/sign-in"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;
