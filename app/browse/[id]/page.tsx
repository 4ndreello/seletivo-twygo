"use client";

import YoutubePlayer from "@/components/YoutubePlayer";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import callServer from "@utils/callServer";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DESCRIPTION_CUT_SIZE = 250;

export default function Page() {
  const router = useRouter();
  const query = useParams<{ id: string }>();

  const [course, setCourse] = useState<TCourse>({
    id: "",
    title: "",
    description: "",
    image: "",
    videos: [],
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query?.id) {
      callServer(`/api/course/${query.id}`).then((data) => {
        if (!data) {
          router.back();
          return;
        }
        if (!data.message) {
          setCourse(data);
          setIsLoading(false);
        }
      });
    }
  }, [query?.id, router]);

  if (isLoading) {
    return (
      <VStack
        bgGradient="linear(to-b, gray.50, gray.200)"
        h="100vh"
        p={6}
        spacing={12}
        align="center"
      >
        <Skeleton height="30vh" borderRadius="lg" width="100%" />
        <Skeleton height="70vh" borderRadius="lg" width="100%" />
      </VStack>
    );
  }

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? course.videos.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === course.videos.length - 1 ? 0 : prev + 1
    );
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <VStack
      bgGradient="linear(to-b, gray.50, gray.200)"
      minH="100vh"
      p={5}
      spacing={5}
      align="center"
    >
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        maxW="900px"
        w="100%"
      >
        <Text
          fontWeight="bold"
          color="gray.700"
          fontSize={{ base: "lg", md: "2xl" }}
        >
          {course.title}
        </Text>

        <Collapse in={showFullDescription} animateOpacity>
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            mt={3}
            color="gray.500"
            whiteSpace="pre-wrap"
          >
            {course.description}
          </Text>
        </Collapse>

        {!showFullDescription && (
          <Text
            fontSize={{ base: "sm", md: "lg" }}
            mt={3}
            color="gray.500"
            whiteSpace="pre-wrap"
          >
            {course.description.length > DESCRIPTION_CUT_SIZE
              ? `${course.description.slice(0, DESCRIPTION_CUT_SIZE)}...`
              : course.description}
          </Text>
        )}

        {course.description.length > DESCRIPTION_CUT_SIZE && (
          <Button
            size="sm"
            mt={2}
            onClick={toggleDescription}
            variant="link"
            colorScheme="blue"
          >
            {showFullDescription ? "See less" : "See more..."}
          </Button>
        )}
      </Box>

      <Box textAlign="center" my={4} width="100%" maxW="900px">
        {!!course.videos.length && (
          <Box
            position="relative"
            mt={3}
            borderRadius="lg"
            border="2px solid"
            borderColor="gray.300"
            p={4}
            maxW="100%"
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color="gray.700"
            >
              Episode {currentSlide + 1} of {course.videos.length}:{" "}
              {course.videos[currentSlide]?.title}
            </Text>

            {course.videos.map((video: TVideo, index: number) => (
              <Box
                key={video.id}
                display={index === currentSlide ? "block" : "none"}
                borderRadius="lg"
                overflow="hidden"
                p={5}
              >
                <YoutubePlayer url={video.youtubeId} />
              </Box>
            ))}

            <HStack justify="space-between" mt={4}>
              <Button
                onClick={prevSlide}
                size="sm"
                colorScheme="gray"
                variant="solid"
              >
                Previous
              </Button>
              <Button
                onClick={nextSlide}
                size="sm"
                colorScheme="gray"
                variant="solid"
              >
                Next
              </Button>
            </HStack>
          </Box>
        )}
      </Box>

      <Flex position="fixed" bottom="0" right="0" p={4} align="center">
        <HStack spacing={1}>
          <IconButton
            aria-label="Go Back"
            icon={<ArrowBackIcon />}
            size={"lg"}
            colorScheme="yellow"
            borderRadius="full"
            onClick={() => router.back()}
          />
          <IconButton
            aria-label="Edit Course"
            icon={<EditIcon />}
            size={"lg"}
            colorScheme="blue"
            borderRadius="full"
            onClick={() => router.push(`/course/${query?.id ?? ""}`)}
          />
        </HStack>
      </Flex>
    </VStack>
  );
}

type TCourse = {
  id: string;
  title: string;
  description: string;
  image: string;
  videos: Array<TVideo>;
};

type TVideo = {
  id: string;
  title: string;
  youtubeId: string;
};
