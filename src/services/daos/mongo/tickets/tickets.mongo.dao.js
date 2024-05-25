import { ticketModel } from "./tickets.model.js";

class TicketDAO {
  #model;
  constructor() {
    this.#model = ticketModel;
  }
  create = async (ticket) => {
    return await this.#model.create(ticket);
  };

  findAll = async () => {
    return await this.#model.find().lean();
  };

  findOne = async (filters) => {
    return await this.#model.findOne(filters);
  };
}
export default TicketDAO;
