import { Schema, model, models } from "mongoose"

export interface RegisterSchemaType {
    fullName: string;
    username: string;
    phone: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
    fullName: String,
    username: String,
    phone: String,
    email: String,
    password: String,
})

export const User = models.User || model("User", userSchema)
