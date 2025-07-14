"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.signInSchema = void 0;
const zod_1 = require("zod");
exports.signInSchema = (0, zod_1.object)({
    email: (0, zod_1.string)({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: (0, zod_1.string)({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});
exports.CreateRoomSchema = (0, zod_1.object)({
    name: (0, zod_1.string)().min(3, { message: "name must be atleast 3 character long" }),
});
