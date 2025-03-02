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
import { Checkbox } from "@/components/ui/checkbox";
import axios from "@/api/axios";

const signInFormSchema = z.object({
  email: z.string().email({ message: "Not a valid Email Address." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
  persist: z.boolean(),
});

type SignInFormSchemaType = z.infer<typeof signInFormSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const { setAuth, setPersist } = useAuth();
  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      persist: JSON.parse(localStorage.getItem("persist") || "false"),
    },
  });

  const onSubmit = async (data: SignInFormSchemaType) => {
    try {
      setPersist(data.persist);
      localStorage.setItem("persist", JSON.stringify(data.persist));
      console.log({ data });
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/users/login`,
        {email: data.email, password: data.password}
      );
      if (response.status === 200) {
        const { message, id, email, fullName, role, accessToken } =
          response.data;
        console.log({ message, id, email, fullName, role, accessToken });
        toast.success(message);
        setAuth({ id, email, fullName, role, accessToken });

        // updateAbility(role.permissions);

        // navigate(from, { state: { pizza } });
        navigate("/dashboard");
      }
      console.log(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      if (!err?.response) {
        toast.error("Server can not be reached, Please Try again later!");
      } else if (err.response?.status === 400) {
        toast.error("Missing Email or Password!");
      } else if (err.response?.status === 401) {
        toast.error("Unauthorized, Your Email and/or Password is not correct!");
      } else if (err.response?.status === 403) {
        toast.error("Forbidden,Your account is not approved by Admin!");
      } else {
        toast.error("Login Failed, Please Try again later!");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white space-y-8 w-1/3 flex flex-col justify-center items-center p-2 py-4 rounded-lg shadow"
      >
        <Heading title="Log In" />
        <div className="w-full flex flex-col justify-center items-center gap-8">
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
            name="persist"
            render={({ field }) => (
              <FormItem className="w-3/4 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
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
            Sign In
          </Button>
        </div>
        <p className="text-center ">
          Have not an account?{" "}
          <Link className="text-blue-600 underline" to="/sign-up">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignIn;
