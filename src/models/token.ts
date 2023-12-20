import mongoose from "mongoose";

export type Token = {
  token: string,
}

const tokenSchema = new mongoose.Schema<Token>({
  token: String,
});

export default mongoose.model("Token", tokenSchema);
