import z from "zod";
import mongoose from "mongoose";
import pc from "picocolors";

const productValidatorSchema = z.object({
  title: z.string({
    invalid_type_error: "El nombre debe ser texto",
    required_error: "El nombre es requerido",
  }),
  price: z
    .number({ invalid_type_error: "El precio debe ser un valor numérico" })
    .positive({
      invalid_type_error: "El precio debe ser un número mayor o igual a 0",
    }),
  category: z.array(
    z
      .string({
        invalid_type_error: "La categoria debe ser texto",
        required_error: "La categoría es requerida",
      })
      .default("General")
  ),
  description: z
    .string({
      required_error: "La descripcion es requerida.",
    })
    .default(""),
  code: z.string({
    invalid_type_error: "El código SKU debe ser una cadena de texto",
    required_error: "El SKU es requerido",
  }),
  stock: z
    .number({
      required_error: "El stock es requerido.",
      invalid_type_error: "El stock debe ser un valor numérico",
    })
    .min(0, { message: "El stock no puede ser negativo" })
    .default(0),
  st: z
    .boolean({ required_error: "El status es un valor requerido" })
    .default(true),
  thumb: z
    .array(
      z.string({
        invalid_type_error: "La ruta debe ser texto",
      })
    )
    .default([]),
});

export function validateProduct(object) {
  const resultadoValidacion = productValidatorSchema.safeParse(object);

  return resultadoValidacion;
}
export function validatePartialProduct(object) {
  const resultadoValidacionParcial = productValidatorSchema
    .partial()
    .safeParse(object);

  return resultadoValidacionParcial;
}
