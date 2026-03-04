"use client";

import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query"
import { signIn } from "@/lib/api/auth";
import { SighInResponseDto } from "@/app/types/auth";
import { setAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignIn() {
    const { t } = useTranslation(["common", "public/sign-in"]);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const FormSchema = z.object({
        username: z
            .string()
            .trim()
            .min(3, t("public/sign-in:error.username.minLength", { value: 3 }))
            .max(15, t("public/sign-in:error.username.maxLength", { value: 15 })),
        password: z
            .string()
            .trim()
            .min(6, t("public/sign-in:error.password.minLength", { value: 6 }))
            .max(255, t("public/sign-in:error.password.maxLength", { value: 255})),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const signInApi = useMutation({
        mutationKey: ["signIn"],
        mutationFn: signIn,
        onSuccess: (data: SighInResponseDto) => {
            setAccessToken(data.accessToken);
            setIsSubmitting(false);
            router.push("/dashboard");
        },
        onError: (error) => {
            console.log("[signIn]", error);
            setIsSubmitting(false);
            toast.error(t("public/sign-in:error.wrongUsernameOrPassword"), {
                duration: 5000,
                position: "top-center",
            })
        }
    });

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        setIsSubmitting(true);
        signInApi.mutate(values);
    }

    return (
        <div>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FormField 
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("public/sign-in:label.username")}
                                        <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("public/sign-in:label.password")}
                                        <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupInput 
                                                type={showPassword ? "text" : "password"}
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                            <InputGroupAddon 
                                                align="inline-end"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <Eye /> : <EyeClosed />}
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {t("common:button.signIn")}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}