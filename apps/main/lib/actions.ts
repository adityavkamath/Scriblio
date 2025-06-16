import db from "@repo/db/client";
import { CreateUserSchema } from "@repo/common/types";
import { executeAction } from "@/lib/executeAction";
import bcrypt from "bcryptjs";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      if (typeof password !== "string") {
        throw new Error("Password is required and must be a string");
      }
      const validatedData = CreateUserSchema.safeParse({
        name,
        email,
        password,
      });
      if (!validatedData.success) {
        throw new Error("Invalid user data");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.user.create({
        data: {
          name: validatedData.data.name ?? (() => { throw new Error("Name is required"); })(),
          email: validatedData.data.email.toLowerCase(),
          password: hashedPassword,
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };
