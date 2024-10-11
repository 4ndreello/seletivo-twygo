import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const courses = await prisma.course.findMany();
  res.status(200).json({ courses });
}

async function insertVideos(videos: any[], courseId: string) {
  if (!(videos && videos.length > 0)) {
    return;
  }

  await prisma.video.createMany({
    data: videos.map((video: any) => {
      const youtubeId = video.youtubeId.includes("youtube")
        ? video.youtubeId.split("?v=")[1]
        : video.youtubeId;
      return {
        ...video,
        youtubeId,
        courseId,
      };
    }),
  });
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  const { id, title, description, dueDate, image, videos } = req.body;

  if (!id || !title || !description || !dueDate) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const course = await prisma.course.findUnique({
    where: { id },
  });

  console.log(videos);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  await prisma.video.deleteMany({
    where: { courseId: course.id },
  });

  await prisma.course.update({
    where: { id: course.id },
    data: { title, description, image, dueDate: new Date(dueDate) },
  });

  await insertVideos(videos, course.id);

  return res.status(200).json({ course });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, dueDate, image, videos } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ error: "Invalid body" });
  }

  const course = await prisma.course.create({
    data: { title, description, image, dueDate: new Date(dueDate) },
  });

  await insertVideos(videos, course.id);

  return res.status(201).json({ course });
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
    } else if (req.method === "POST") {
      await handlePost(req, res);
    } else {
      res.setHeader("Allow", ["GET", "PATCH", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
}
