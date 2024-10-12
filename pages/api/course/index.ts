import { Course, Video } from "@/types";
import { PrismaClient } from "@prisma/client";
import extractYoutubeId from "@utils/extractYoutubeId";
import insertVideosGetTotalDuration from "@utils/insertVideos";
import requiredParams from "@utils/requiredParams";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  let { dataFilter } = req.query;

  if (typeof dataFilter === "string") {
    dataFilter = JSON.parse(dataFilter);
  }

  let object = {};
  if (dataFilter) {
    object = {
      where: {
        dueDate: {
          gte: new Date(),
        },
      },
    };
  }

  const courses = await prisma.course.findMany(object);

  res.status(200).json({ courses });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, dueDate, videos } = req.body as Course;

  if (!requiredParams(res, { title, description, dueDate })) {
    return;
  }

  const course = await prisma.$transaction(async (prisma) => {
    const createdCourse = await prisma.course.create({
      data: { title, description, dueDate: new Date(dueDate) },
    });

    const totalDuration = await insertVideosGetTotalDuration(
      prisma,
      createdCourse.id,
      videos
    );

    await prisma.course.update({
      where: { id: createdCourse.id },
      data: { totalDuration },
    });

    return createdCourse;
  });

  return res.status(201).json({ course });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      await handleGet(req, res);
    } else if (req.method === "POST") {
      await handlePost(req, res);
    } else {
      res.setHeader("Allow", ["GET", "PATCH", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  } finally {
    await prisma.$disconnect();
  }
  insertVideosGetTotalDuration;
}
