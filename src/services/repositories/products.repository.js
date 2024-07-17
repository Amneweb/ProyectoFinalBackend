import { productDAO } from "../factory.js";
class ProductRepository {
  constructor() {}
  updateFullProduct = async (id, nuevo) => {
    const result = await productDAO.replace(id, nuevo);

    return result;
  };
  updatePartial = async (id, filters) => {
    const result = await productDAO.update(id, filters);
    return result;
  };
  findByCate = async (options, cate) => {
    const conditions = {
      category: { $in: [cate] },
    };
    const products = await productDAO.find(options, conditions);

    return products;
  };
  findAll = async (options) => {
    const conditions = {};
    const products = await productDAO.find(options, conditions);

    return products;
  };
}
export default ProductRepository;
