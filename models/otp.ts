import { Schema, model, models } from "mongoose"

export interface OtpSchemaType {
    email: string;
    code: string;
    expiresAt: Date;
    used: boolean;
}

const otpSchema = new Schema({
    email: String,
    code: String,
    expiresAt: Date,
    used: Boolean,
})

export const OTP = models.OTP || model("OTP", otpSchema)
