"use client"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import React from 'react'
import { useState } from "react";
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation";
export const Form = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState({
        mailError: "",
        passwordError: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        const newError = {
            mailError: "",
            passwordError: ""
        };
        if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newError.mailError = "Valid email required";
        }
        if (name === "password" && !/^(?=.*\S).{8,32}$/.test(value)) {
            newError.passwordError = "Password must be at least 8 characters long";
        }
        if (Object.keys(newError).length > 0) {
            setError((prev) => ({ ...prev, ...newError }));
        }
    };

    const submit = async () => {
        try {
            if (error.mailError !== "" && error.passwordError !== "") {
                return
            }
            const result = await axios.post("/api/signup", {
                email: formData.email,
                password: formData.password
            })
            toast.success(result.data);
            router.push("/")

        } catch (err) {
            console.log(err)
            const errorMessage =
                (axios.isAxiosError(err) && err.response?.data?.error) ||
                "something went Wrong";
            toast.error(errorMessage);
        }
    }
    return (
        <div>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        required
                        onChange={handleChange}
                    />
                    {error && <div className="text-red-500">{error.mailError}</div>}
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input name="password" type="password" required onChange={handleChange} />
                    {error && <div className="text-red-500">{error.passwordError}</div>}
                </div>
                <Button type="submit" className="w-full mt-2" onClick={submit}>
                    SignUp
                </Button>
            </div>
        </div >
    )
}

