import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { UseGetAllTickets } from "@/api/ticket/Queries";
import useAuth from "@/hooks/useAuth";
import { CellAction, CellActionStatus } from "@/components/table/cell-action";

export type TicketColumn = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: "open" | "In progress" | "closed";
  createdAt: string;
  updatedAt: string;
};

const DashboardPage: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { data: ticketsData, isSuccess, isLoading, isError } = UseGetAllTickets();

  const columns: ColumnDef<TicketColumn>[] = [
    ...(auth.role === "admin" ? [{
      accessorKey: "userId",
      header: "Full Name",
    }] : []),
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <CellActionStatus data={row.original} />
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => format(row.original.createdAt, "MMMM do, yyyy (h:mm a)"),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => format(row.original.updatedAt, "MMMM do, yyyy (h:mm a)"),
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-1">
        <div className="flex items-center justify-between">
          <Heading
            title={`Tickets List ${
              isSuccess ? `(${ticketsData?.length || 0}) ` : ``
            }`}
            description="Manage tickets information"
          />
          {auth.role === "user" && (
            <Button onClick={() => navigate(`/dashboard/ticket`)}>
              <Plus className="mr-2 w-4 h-4" />
              Add New
            </Button>
          )}
        </div>
        <Separator />
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin w-6 h-6 " />
            <span className="ml-2 ">Loading tickets...</span>
          </div>
        )}

        {isError && (
          <div className="flex justify-center items-center py-8 text-red-500">
            <AlertTriangle className="w-6 h-6" />
            <span className="ml-2">Failed to load tickets. Please try again.</span>
          </div>
        )}
        {isSuccess && ticketsData && (
          <DataTable columns={columns} data={ticketsData} searchKey="title" />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;


