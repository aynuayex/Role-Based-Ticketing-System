/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import toast from "react-hot-toast";
import axios from "@/api/axios";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";

const verifyEmailFormSchema = z.object({
  otp: z.string().length(6, { message: "OTP code must be 6 characters." }),
});

type verifyEmailFormSchemaType = z.infer<typeof verifyEmailFormSchema>;

const VerifyEmail = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const form = useForm<verifyEmailFormSchemaType>({
    resolver: zodResolver(verifyEmailFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    const sendOtp = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`/users/send-otp/${userId}`);
        if (response.status === 200) {
          toast.success("OTP sent! Check your email (including spam folder)");
          setTimer(30); // Start a 30s cooldown
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          toast.error(err.response?.data.message);
        }
        toast.error("Failed to send OTP. Please try again later.");
      }
    };
    sendOtp();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`/users/send-otp/${userId}`);
      if (response.status === 200) {
        toast.success("OTP resend successfully!");
        setTimer(30); // Restart 30s cooldown
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error(err.response?.data.message);
      }
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: verifyEmailFormSchemaType) => {
    try {
      console.log({ data });
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`/users/verify-email`, {
        userId,
        otp: data.otp,
      });
      if (response.status === 200) {
        toast.success("Successfully verified email!");
        setAuth(prevAuth => ({...prevAuth, emailVerified: true}))
        navigate("/dashboard");
      }
      console.log(response);
    } catch (err: any) {
      console.error(err);
      if (!err?.response) {
        toast.error("Server can not be reached, Please Try again later!");
      } else if (err.response?.status === 400) {
        toast.error("Missing OTP Code!");
      } else if (err.response?.status === 401) {
        toast.error(err.response?.data.message);
      } else if (err.response?.status === 404) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Verification Failed, Please Try again later!");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background/40 space-y-8 w-4/5 sm:w-1/3 mt-4 sm:mt-0 flex flex-col justify-center items-center p-2 py-4 rounded-lg shadow"
      >
        <Heading title="Verify Email" />
        <div className="w-full flex flex-col justify-center items-center gap-8">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="w-3/4 ">
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Enter the send OTP code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Verify
        </Button>
        <p className="text-center">
          Have not recieved code?{" "}
          <Button
            variant={"link"}
            className="text-blue-600 underline"
            onClick={handleResendOTP}
            disabled={isResending || timer > 0}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend"}
          </Button>
        </p>
      </form>
    </Form>
  );
};

export default VerifyEmail;
