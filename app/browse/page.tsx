"use client";

import imagePlaceholder from "@app/images/image.png";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { bigText } from "@styles";
import Image from "next/image";
import { useRouter } from "next/navigation";

import "@app/global.css";
import { useEffect, useState } from "react";
import { isMobileDevice } from "@/utils/isMobile";

const MAX_TEXT_DESCRIPTION = 120;

export default function Page() {
  const router = useRouter();
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/course`)
      .then((res) => res.json())
      .then(async (data) => {
        setIsMobile(await isMobileDevice());
        setCourses(data.courses);
      });
  }, []);

  return (
    <>
      <Box>
        <Text fontSize={bigText} textAlign="center">
          Browse between your courses
        </Text>

        <Box p="5">
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {courses.map((course, index) => (
              <GridItem
                bg="blue.500"
                p="5"
                css={`
                  &:hover {
                    background-color: red;
                    cursor: pointer;
                  }
                `}
                key={index}
                onClick={() => {
                  router.push(`/browse/${course.id}`);
                }}
              >
                <Box>
                  <Text
                    textAlign="center"
                    fontSize={{ base: "15px", md: "20px", lg: "26px" }}
                  >
                    {course.title}
                  </Text>
                </Box>

                <Box {...(!isMobile ? { display: "flex" } : {})}>
                  <Image
                    src={imagePlaceholder}
                    width={300}
                    height={300}
                    alt="Picture of course.title"
                  />
                  <Text p="2">
                    {course.description.length > MAX_TEXT_DESCRIPTION
                      ? `${course.description.substring(
                          0,
                          MAX_TEXT_DESCRIPTION
                        )}...`
                      : course.description}
                  </Text>
                </Box>
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Box>

      <Box
        position="fixed"
        right="0"
        bottom="0"
        p="5"
        m="5"
        bg="blue.500"
        color="white"
        borderRadius="5px"
        onClick={() => {
          router.push("/course/new");
        }}
        css={`
          &:hover {
            background-color: red;
            cursor: pointer;
          }
        `}
      >
        <AddIcon boxSize={4} w={5} h={5} />
      </Box>
    </>
  );
}

interface TCourse {
  title: string;
  description: string;
  id: string;
}
