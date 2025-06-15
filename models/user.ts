import { Schema, model, models } from "mongoose"

export interface RegisterSchemaType {
    fullName: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
})

export const User = models.User || model("User", userSchema)
