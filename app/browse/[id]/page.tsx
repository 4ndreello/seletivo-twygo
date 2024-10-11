"use client";

import YoutubePlayer from "@/components/YoutubePlayer";
import { bigText } from "@/styles";
import {
  ArrowBackIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const query = useParams<{ id: string }>();
  if (!query?.id) return null;

  const [course, setCourse] = useState<TCourse>({
    id: "",
    title: "",
    description: "",
    image: "",
    videos: [],
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`/api/course/${query?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.message) {
          console.log(data);
          setCourse(data);
        }
      });
  }, []);

  if (!course) {
    return <h1>Loading...</h1>;
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

  return (
    <>
      <Box textAlign={"center"}>
        <Text fontSize={bigText}>{course.title}</Text>
        <p>{course.description}</p>
      </Box>

      <Box textAlign="center" my={4}>
        {!!course.videos.length && (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Episódio {currentSlide + 1} de {course.videos.length}:{" "}
              {course.videos[currentSlide]?.title}
            </Text>

            <Box position="relative" width="100%" maxW="800px" mx="auto">
              <Box>
                {course.videos.map((video: TVideo, index: number) => (
                  <Box
                    key={video.id}
                    display={index === currentSlide ? "block" : "none"}
                  >
                    <YoutubePlayer url={video.youtubeId} />
                  </Box>
                ))}
              </Box>

              <IconButton
                aria-label="Previous Slide"
                icon={<ChevronLeftIcon />}
                position="absolute"
                top="50%"
                left="0"
                transform="translateY(-50%)"
                onClick={prevSlide}
              />
              <IconButton
                aria-label="Next Slide"
                icon={<ChevronRightIcon />}
                position="absolute"
                top="50%"
                right="0"
                transform="translateY(-50%)"
                onClick={nextSlide}
              />
            </Box>
          </>
        )}
      </Box>

      <Box
        position="fixed"
        right="0"
        bottom="0"
        color="white"
        gap={3}
        p={5}
        display="flex"
        flex={1}
        css={`
          &:hover {
            cursor: pointer;
          }
        `}
      >
        <Box>
          <ArrowBackIcon
            borderRadius={6}
            p={2}
            bg="yellow.500"
            color="white"
            boxSize={4}
            onClick={() => {
              router.back();
            }}
            w={16}
            h={16}
          />
        </Box>
        <Box>
          <EditIcon
            borderRadius={6}
            p={2}
            bg="blue.500"
            color="white"
            boxSize={4}
            onClick={() => {
              router.push(`/course/${query.id}`);
            }}
            w={16}
            h={16}
          />
        </Box>
      </Box>
    </>
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
