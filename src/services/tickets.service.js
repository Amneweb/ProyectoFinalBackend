import { ticketModel } from "./daos/mongo/tickets/tickets.model.js";

class TicketManager {
  createTicket = async (ticket) => {
    let ticketNuevo = await ticketModel.create(ticket);
    return ticketNuevo;
  };

  //obtener ticket
  getTickets = async () => {
    const tickets = await ticketModel.find().lean();

    return tickets;
  };
  //obtener carrito con id determinado
  getTicketByUser = async (email) => {
    const tickets = await ticketModel.find({ purchaser: email });

    return tickets;
  };
}
export default TicketManager;
