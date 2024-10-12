import { NextApiResponse } from "next";

export default function requiredParams(
  res: NextApiResponse,
  data: { [key: string]: any }
): boolean {
  for (const key of Object.keys(data)) {
    if (!data[key]) {
      res.status(400).json({ message: `Invalid body !${key}` });
      return false;
    }
  }

  return true;
}
