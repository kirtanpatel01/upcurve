import { model, models, Schema } from 'mongoose'

const habitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true,
  },
  isCompleted : {
    type: Boolean,
    default: false,
  }
}, {timestamps: true})

export const Habit = models.Habit || model("Habit", habitSchema);