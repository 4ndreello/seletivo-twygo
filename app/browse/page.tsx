"use client";

import { Course } from "@/types";
import "@app/global.css";
import { AddIcon, LinkIcon, TimeIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import callServer from "@utils/callServer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TCourse extends Course {
  id: string;
  modules: number;
}

export default function Page() {
  const router = useRouter();
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [filterExpired, setFilterExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const MAX_DESCRIPTION_SIZE = 150;
  const MAX_TITLE_SIZE = 30;

  const formatDuration = (totalDuration: number) => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;

    const format = (value: number) => String(value).padStart(2, "0");

    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  };

  useEffect(() => {
    const query = new URLSearchParams({
      dataFilter: String(!filterExpired),
    });

    callServer(`/api/course?${query}`).then(async (data) => {
      if (!data) {
        return;
      }

      setCourses(data.courses);
      setLoading(false);
    });
  }, [filterExpired]);

  return (
    <>
      <Box bgGradient="linear(to-b, white, gray.100)" minH="100vh" p={5}>
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight={"bold"}
          textAlign="center"
          mb={5}
          textTransform="uppercase"
          color="gray.800"
        >
          Browse through your courses
        </Text>

        <Box textAlign="center" mb={5}>
          <Checkbox
            isChecked={filterExpired}
            onChange={(e) => setFilterExpired(e.target.checked)}
            colorScheme="gray"
          >
            Show expired courses
          </Checkbox>
        </Box>

        <Box p={5}>
          <Grid
            templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
            gap={6}
          >
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <GridItem key={index}>
                    <Skeleton height="350px" borderRadius="15px" />
                  </GridItem>
                ))
              : courses.map((course, index) => (
                  <GridItem
                    borderRadius="15px"
                    bgGradient="linear(to-r, white, gray.200)"
                    color="gray.800"
                    boxShadow="lg"
                    p={6}
                    transition="transform 0.2s ease, background-color 0.3s ease"
                    _hover={{
                      bgGradient: "linear(to-r, white, gray.300)",
                      transform: "scale(1.05)",
                      cursor: "pointer",
                    }}
                    key={index}
                    onClick={() => router.push(`/browse/${course.id}`)}
                    minW="250px"
                    h={{ base: "300px", md: "350px" }}
                    overflow="hidden"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <VStack spacing={4}>
                      <Text
                        textAlign="center"
                        fontWeight="bold"
                        fontSize={{ base: "18px", md: "22px", lg: "28px" }}
                        mb={3}
                      >
                        {course.title.length > MAX_TITLE_SIZE
                          ? `${course.title.substring(0, MAX_TITLE_SIZE)}...`
                          : course.title}
                      </Text>

                      <Box>
                        <Text>
                          {course.description.length > MAX_DESCRIPTION_SIZE
                            ? `${course.description.substring(
                                0,
                                MAX_DESCRIPTION_SIZE
                              )}...`
                            : course.description}
                        </Text>
                      </Box>

                      {course.dueDate &&
                        new Date(course.dueDate) < new Date() && (
                          <HStack justifyContent="center" spacing={1} mt={1}>
                            <Icon as={WarningTwoIcon} color="red.400" />
                            <Text fontSize="sm" color="red.400">
                              Course expired
                            </Text>
                          </HStack>
                        )}
                    </VStack>

                    <HStack justifyContent="center" mt={4} spacing={6}>
                      <HStack>
                        <Tooltip
                          hasArrow
                          label="Total duration"
                          bg="gray.300"
                          color="black"
                          m={1}
                        >
                          <Icon as={TimeIcon} boxSize={5} />
                        </Tooltip>

                        <Text fontSize="sm">
                          {formatDuration(course.totalDuration)}
                        </Text>
                      </HStack>

                      <HStack>
                        <Tooltip
                          hasArrow
                          label="Number of modules"
                          bg="gray.300"
                          color="black"
                          m={1}
                        >
                          <Icon as={LinkIcon} boxSize={5} />
                        </Tooltip>

                        <Text fontSize="sm">{course.modules}</Text>
                      </HStack>
                    </HStack>
                  </GridItem>
                ))}
          </Grid>
        </Box>
      </Box>

      <Flex position="fixed" bottom="0" right="0" p={4} align="center">
        <IconButton
          aria-label="Go Back"
          icon={<AddIcon />}
          size="lg"
          colorScheme="blue"
          borderRadius="full"
          onClick={() => router.push("/course/new")}
        />
      </Flex>
    </>
  );
}
