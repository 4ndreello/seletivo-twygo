import { Course } from "@/types";
import { PrismaClient } from "@prisma/client";
import insertVideosGetTotalDuration from "@utils/insertVideos";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { title, description, dueDate, videos } = req.body as Course;

  if (typeof id !== "string" || !id || !title || !description || !dueDate) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.video.deleteMany({
      where: { courseId: course.id },
    });

    const totalDuration = await insertVideosGetTotalDuration(
      prisma,
      course.id,
      videos
    );

    await prisma.course.update({
      where: { id: course.id },
      data: { title, description, dueDate: new Date(dueDate), totalDuration },
    });
  });

  return res.status(200).json({ course });
}

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
    } else if (req.method === "PATCH") {
      await handlePatch(req, res);
    } else if (req.method === "DELETE") {
      await handleDelete(req, res);
    } else {
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error, success: false });
  } finally {
    await prisma.$disconnect();
  }
}
