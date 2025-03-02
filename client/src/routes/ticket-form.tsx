import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useNavigate } from "react-router";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AlertModal from "@/components/modals/alert-modal";
import { TicketColumn } from "./dashboard";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type TicketFormValues = z.infer<typeof formSchema>;

const TicketForm: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const initialData = useLoaderData() as TicketColumn | null;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData
    ? "Edit ticket information"
    : "Create ticket information";
  const description = initialData
    ? "Edit a ticket information"
    : "Add a new ticket information";
  const toastMessage = initialData
    ? "ticket information updated."
    : "ticket information created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: TicketFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axiosPrivate.put(
          `${import.meta.env.VITE_BASE_API}/tickets/${initialData._id}`,
          data
        );
      } else {
        await axiosPrivate.post(
          `${import.meta.env.VITE_BASE_API}/tickets`,
          data
        );
      }
      navigate(`/dashboard`);
      toast.success(toastMessage);
    } catch {
      toast.error("Something went wrong!,please try again");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosPrivate.delete(
        `${import.meta.env.VITE_BASE_API}/tickets/${initialData?._id}`
      );
      navigate("/dashboard");
      toast.success("Ticket information deleted successfully!");
    } catch {
      toast.error("Something went wrong!,please try again");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="This is your description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-8">
            <Button onClick={() => navigate("/dashboard")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TicketForm;
