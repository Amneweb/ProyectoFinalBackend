import { fakerES as faker } from "@faker-js/faker";

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    code: faker.string.alphanumeric({ length: { min: 5, max: 10 } }),
    price: faker.commerce.price(),
    stock: Math.floor(Math.random() * 100),
    _id: faker.database.mongodbObjectId(),
    thumb: faker.helpers.multiple(faker.system.fileName, { min: 0, max: 4 }),
    category: faker.helpers.arrayElements(
      ["EDNA", "camión", "JAOS", "auto", "MATEO"],
      { min: 1, max: 4 }
    ),
    st: faker.datatype.boolean(0.9),
    description: faker.lorem.paragraph({ min: 1, max: 3 }),
  };
};
