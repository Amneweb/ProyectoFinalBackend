import { ticketModel } from "./tickets.model.js";

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
    const ticket = await ticketModel.findOne({ purchaser: email }).lean();
    const result = ticket
      ? { success: true, data: { ...ticket } }
      : {
          success: false,
          message: "no se encontró ningún ticket para ese email",
        };
    return result;
  };
}
export default TicketManager;
