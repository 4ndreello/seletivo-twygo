"use client";

import imagePlaceholder from "@app/images/image.png";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { bigText } from "@styles";
import Image from "next/image";

const data = [
  { title: "Course 1", description: "Description 1" },
  { title: "Course 2", description: "Description 2" },
  { title: "Course 3", description: "Description 3" },
];

export default function Page() {
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
              >
                <Box
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <Image
                    src={imagePlaceholder}
                    width={300}
                    height={300}
                    alt="Picture of course.title"
                  />
                </Box>

                <Box>
                  <Text
                    textAlign="center"
                    fontSize={{ base: "15px", md: "20px", lg: "26px" }}
                  >
                    {course.title}
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
        css={`
          &:hover {
            background-color: red;
            cursor: pointer;
          }
        `}
      >
        <AddIcon boxSize={4} />
      </Box>
    </>
  );
}
