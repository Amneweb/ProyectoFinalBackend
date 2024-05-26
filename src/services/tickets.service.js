import { ticketModel } from "./daos/mongo/tickets/tickets.model.js";

class TicketManager {
  createTicket = async (ticket) => {
    console.log("entrando a la funcion de crear tickets");
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
    console.log(email);
    const tickets = await ticketModel.find({ purchaser: email });
    console.log("tickets encontrados", tickets);

    return tickets;
  };
}
export default TicketManager;
