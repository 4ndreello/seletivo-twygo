import { Course } from "@/types";
import { PrismaClient } from "@prisma/client";
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
    switch (req.method) {
      case "GET":
        await handleGet(req, res);
        break;
      case "POST":
        await handlePost(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    const message =
      (error as { message?: string }).message || "Internal Server Error";
    res.status(400).json({ success: false, message });
  } finally {
    await prisma.$disconnect();
  }
}
