import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  await prisma.video.deleteMany({
    where: { courseId: course.id },
  });

  await prisma.course.delete({
    where: { id },
  });

  return res.status(204).end();
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id" });
  }

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const videos = await prisma.video.findMany({
    where: {
      courseId: course.id,
    },
  });

  res.status(200).json({ ...course, videos });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      await handleGet(req, res);
    } else if (req.method === "DELETE") {
      await handleDelete(req, res);
    } else {
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
