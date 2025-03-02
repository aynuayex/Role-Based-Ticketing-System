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
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import axios from "@/api/axios";

const signUpFormSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Full Name must be at least 3 characters." }),
    email: z.string().email({ message: "Not a valid Email Address." }),
    password: z
      .string()
      .min(4, { message: "Password must be at least 4 characters." }),
    confirmPassword: z
      .string()
      .min(4, { message: "Password must be at least 4 characters." }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "password and confirm password must match",
        path: ["confirmPassword"],
      });
    }

    // if(!termsAndConditions) {
    //     ctx.addIssue({
    //         code: z.ZodIssueCode.custom,
    //         message: "You must accept terms and conditions",
    //         path: ["termsAndConditions"]
    //     })
    // }
  });

type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;

const SignUp = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const form = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormSchemaType) => {
    try {
      console.log({ data });
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/users/register`,
        data
      );
      if (response.status === 201) {
        const { message, id, email, fullName, role, accessToken } =
          response.data;
        console.log({ message, id, email, fullName, role, accessToken });
        toast.success(message);
        setAuth({ id, email, fullName, role, accessToken });

        // updateAbility(role.permissions);

        // navigate(from, { state: { pizza } });
        navigate("/sign-in");
      }
      console.log(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (!err?.response) {
        toast.error("Server can not be reached, Please Try again later!");
      } else if (err.response?.status === 400) {
        toast.error("Missing One of the Fields, Please fill All!");
      } else if (err.response?.status === 409) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("Registration Failed, Please Try again later!");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white space-y-8 w-1/3 flex flex-col justify-center items-center p-2 py-4 rounded-lg shadow"
      >
        <Heading title="Register" />
        <div className="w-full flex flex-col justify-center items-center gap-8">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="w-3/4 ">
                <FormLabel className="">Full Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Enter your Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-3/4 ">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled={form.formState.isSubmitting}
                    placeholder="Enter your Email"
                    {...field}
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
              <FormItem className="w-3/4 ">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={form.formState.isSubmitting}
                    placeholder="Enter your Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-3/4 ">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    disabled={form.formState.isSubmitting}
                    placeholder="Enter your Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-8">
          <Button
            onClick={() => navigate("/")}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Sign Up
          </Button>
        </div>
        <p className="text-center ">
          Already have an account?{" "}
          <Link className="text-blue-600 underline" to="/sign-in">
            LogIn
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUp;
