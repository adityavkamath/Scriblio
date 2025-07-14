import bcrypt from "bcrypt"

export async function encryptPassword(password: string) {
  const encryptPassword = await bcrypt.hash(password, 10);
  return encryptPassword;
}
export async function verifyPassword(password: string, hashpassword: string) {
  const result = await bcrypt.compare(password, hashpassword);
  return result;
}