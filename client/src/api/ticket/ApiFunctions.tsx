import { type AxiosInstance } from "axios";
import { type TicketColumn } from "@/routes/dashboard";

// function to fetch all tickets
export const GetAllTickets = async (
  axiosPrivate: AxiosInstance
): Promise<TicketColumn[]> => {
  try {
    const response = await axiosPrivate.get<TicketColumn[]>(`/tickets`);
    console.log({ data: response.data });
    return response.data
  } catch (err) {
    console.error(err);
    return [];
  }
};

// function to fetch a ticket
export const GetTicket = async (
    ticketId: string | undefined,
  axiosPrivate: AxiosInstance
): Promise<TicketColumn> => {
    // if (!ticketId) {
    //   //   throw new Error("Ticket Id does not exist");
    //   return {
    //     _id: "",
    //     userId: "",
    //     title: "",
    //     description: "",
    //     status: "open",
    //     createdAt: "",
    //     updatedAt: "",
    //   };
    // }
  try {
    const response = await axiosPrivate.get<TicketColumn>(
      `/tickets/${ticketId}`
    );
    console.log({ data: response.data });
    return response.data;
  } catch (err) {
    console.error(err);
    return {
      _id: "",
      userId: "",
      title: "",
      description: "",
      status: "open",
      createdAt: "",
      updatedAt: "",
    };
  }
};
