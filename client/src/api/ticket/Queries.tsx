import { useQuery } from "@tanstack/react-query";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { GetAllTickets, GetTicket } from "./ApiFunctions";
// import { TicketColumn } from "@/routes/dashboard";

// Hook to get all tickets
export const UseGetAllTickets = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["UseGetAllTickets"],
    queryFn: () => GetAllTickets(axiosPrivate),
    // select: (data) =>
    //   data?.data?.filter(
    //     (item) =>
    //       item.incCodNam !== 'Sub Total' && item.incCodNam !== 'Grand Total',
    //   ),
  });
};

// Hook to get a ticket
export const UseGetTicket = (ticketId: string | undefined) => {

  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["UseGetTicket", ticketId],
    queryFn: () => GetTicket(ticketId, axiosPrivate),
    enabled: Boolean(ticketId)
  });
};
