"use client";

import imagePlaceholder from "@app/images/image.png";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { bigText } from "@styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import "@app/global.css";

const MAX_TEXT_DESCRIPTION = 120;

const data: TCourse[] = [
  {
    title: "Course 1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

type TCourse = {
  title: string;
  description: string;
};

export default function Page() {
  const router = useRouter();

  const [current, setCurrent] = useState<TCourse>({
    title: "Empty",
    description: "Empty",
  });

  return (
    <>
      <Box>
        <Text fontSize={bigText} textAlign="center">
          Browse between your courses
        </Text>

        <Box p="5">
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {data.map((course, index) => (
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
                  setCurrent(course);
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
                <Box
                  style={{
                    display: "flex",
                  }}
                >
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
          router.push("/course/insert");
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
