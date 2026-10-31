import { status } from "../lib/claude.js";

export default function handler(req, res) {
  res.status(200).json(status());
}
