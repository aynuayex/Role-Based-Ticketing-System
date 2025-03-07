import toast from "react-hot-toast";
import AlertModal from "../modals/alert-modal";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TicketColumn } from "@/routes/dashboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CellActionProps {
  data: TicketColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axiosPrivate.delete(`/tickets/${data._id}`);
      // Invalidate and refetch the ticket list in order to get the latest data after deleting
      queryClient.invalidateQueries({ queryKey: ["UseGetAllTickets"] });
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
      {auth.role === "user" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-8 h-8 p-0" variant={"ghost"}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/dashboard/ticket/${data._id}`)}
            >
              <Edit className="mr-2 w-4 h-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant={"destructive"} onClick={() => setOpen(true)}>
          <Trash className="mr-2 w-4 h-4" />
          Delete
        </Button>
      )}
    </>
  );
};

export const CellActionStatus: React.FC<CellActionProps> = ({ data }) => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const [status, setStatus] = useState(data.status);

  const handleStatusChange = async (value: string) => {
    try {
      console.log({ value });
      const response = await axiosPrivate.put(`/tickets/status/${data._id}`,{ status: value});
      if(response.status == 200) {
        setStatus(response.data.result.status)
        
      // Invalidate and refetch the ticket list in order to get the latest data after updating
      queryClient.invalidateQueries({ queryKey: ["UseGetAllTickets"] });
      }
      toast.success("Ticket status information updated successfully!");
    } catch {
      toast.error("Something went wrong!,please try again");
    }
  };

  return (
    <>
        <Select onValueChange={handleStatusChange} value={status}>
          <SelectTrigger disabled={auth.role === "admin"? false: true}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="In progress">In Progress</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
    </>
  );
};
