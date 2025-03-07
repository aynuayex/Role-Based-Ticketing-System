/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";

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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { UseGetTicket } from "@/api/ticket/Queries";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

type TicketFormTypes = z.infer<typeof formSchema>;

const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { data: initialData, isSuccess, isLoading } = UseGetTicket(ticketId);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = ticketId
    ? "Edit ticket information"
    : "Create ticket information";
  const description = ticketId
    ? "Edit a ticket information"
    : "Add a new ticket information";
  const toastMessage = ticketId
    ? "ticket information updated."
    : "ticket information created.";
  const action = ticketId ? "Save changes" : "Create";

  const form = useForm<TicketFormTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Use `useEffect` to update form values when data is available
  useEffect(() => {
    if (isSuccess && initialData) {
      // form.reset({
      //   title: initialData.title,
      //   description: initialData.description,
      // });
      form.setValue("title", initialData.title);
      form.setValue("description", initialData.description);
    }
  }, [initialData, isSuccess, form]);

  const onSubmit = async (data: TicketFormTypes) => {
    try {
      setLoading(true);
      if (ticketId) {
        await axiosPrivate.put(`/tickets/${ticketId}`, data);
      } else {
        await axiosPrivate.post(`/tickets`, data);
      }
      navigate(`/dashboard`);
      toast.success(toastMessage);
    } catch (err: any) {
      if (!err?.response) {
        toast.error("Server can not be reached, Please Try again later!");
      }
      toast.error("Something went wrong!,please try again");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosPrivate.delete(`/tickets/${ticketId}`);
      navigate("/dashboard");
      toast.success("Ticket information deleted successfully!");
    } catch (err: any) {
      if (!err?.response) {
        toast.error("Server can not be reached, Please Try again later!");
      }
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
        loading={loading || isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {ticketId && (
          <Button
            disabled={loading || isLoading}
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
                    <Input
                      disabled={loading || isLoading}
                      placeholder="title"
                      {...field}
                    />
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
                      disabled={loading || isLoading}
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
            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading || isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || isLoading}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TicketForm;
