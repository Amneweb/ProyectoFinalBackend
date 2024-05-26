import z from "zod";

const userValidatorSchema = z.object({
  userName: z.string({
    required_error: "El nombre es requerido",
  }),
  userLastName: z.string({
    required_error: "El apellido es requerido",
  }),
  userAge: z
    .number({
      invalid_type_error: "Age must be a number",
    })
    .int()
    .lt(100),
  email: z
    .string()
    .email({
      invalid_type_error: "El dato no corresponde a una casilla de correo",
    }),
  password: z
    .string({
      required_error: "El password es requerido",
    })
    .min(5, { message: "El password debe contener al menos 5 caracteres" }),
});

export function validateUser(object) {
  const resultadoValidacion = userValidatorSchema.safeParse(object);

  return resultadoValidacion;
}
