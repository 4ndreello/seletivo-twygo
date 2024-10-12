"use client";

import YoutubePlayer from "@/components/YoutubePlayer";
import { Course, Video } from "@/types";
import {
  ArrowBackIcon,
  CheckIcon,
  DeleteIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import callServer from "@utils/callServer";
import extractYoutubeId from "@utils/extractYoutubeId";
import useOnceCall from "@utils/useOnceCall";
import validateYouTubeUrl from "@utils/validateYoutubeUrl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const [course, setCourse] = useState<Course>({
    title: "",
    description: "",
    dueDate: "",
    videos: [],
  });
  const query = useParams<{ id?: string }>();
  const courseId = query?.id ?? "";
  const [isLoading, setIsLoading] = useState(true);
  const [lastVideo, setLastVideo] = useState<{
    id: string;
    duration?: number;
  } | null>(null);
  const [loadingLastVideo, setLoadingLastVideo] = useState(false);

  if (!courseId) return null;

  const [video, setVideo] = useState<Video>({
    title: "",
    youtubeId: "",
    duration: 0,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useOnceCall(() => {
    if (courseId === "new") {
      setIsLoading(false);
      return;
    }

    callServer(`/api/course/${courseId}`).then((data) => {
      if (!data) {
        router.back();
        return;
      }

      setCourse(data);
      setIsLoading(false);
    });
  });

  const changeVideoTime = (videoId: string, durationToSet: number) => {
    setCourse((prev) => ({
      ...prev,
      videos: prev.videos.map((video) => {
        let { duration } = video;

        if (extractYoutubeId(video.youtubeId) === videoId) {
          duration = durationToSet;
        }

        return {
          ...video,
          duration,
        };
      }),
    }));
  };

  const extractVideoInformation = async (url: string) => {
    const searchParams = new URL(url)?.searchParams;
    const urlParams = new URLSearchParams(searchParams);
    if (!urlParams) {
      return;
    }

    const videoId = urlParams.get("v");
    if (!videoId) {
      return;
    }

    const params = new URLSearchParams({
      format: "json",
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });

    const response = await callServer(
      `https://www.youtube.com/oembed?${params.toString()}`
    );

    return response;
  };

  const handleSaveVideo = () => {
    if (!video.title || !video.youtubeId) {
      alert("Please, fill the title and youtube link");
      return;
    }

    if (!validateYouTubeUrl(video.youtubeId)) {
      alert("Please, fill a valid youtube link");
      return;
    }

    for (const currentVideo of course.videos) {
      if (
        extractYoutubeId(currentVideo.youtubeId) ===
        extractYoutubeId(video.youtubeId)
      ) {
        alert("This video is already added");
        return;
      }
    }

    const setLoader =
      !lastVideo || lastVideo.id !== extractYoutubeId(video.youtubeId);

    if (setLoader) {
      setLoadingLastVideo(true);
      setLastVideo({
        id: extractYoutubeId(video.youtubeId),
      });
    }

    setYoutubeLink(extractYoutubeId(video.youtubeId));

    setCourse((prev) => ({
      ...prev,
      videos: [...course.videos, video],
    }));

    if (!setLoader) {
      changeVideoTime(
        extractYoutubeId(video.youtubeId),
        lastVideo?.duration ?? 0
      );
    }

    setVideo({ title: "", youtubeId: "", duration: 0 });
    onClose();
  };

  const [youtubeLink, setYoutubeLink] = useState("");

  const handleRemoveVideo = (indexToRemove: number) => {
    const updatedVideos = course?.videos?.filter?.(
      (_, index) => index !== indexToRemove
    );

    setCourse((prev) => ({
      ...prev,
      videos: updatedVideos,
    }));
  };

  return (
    <Box p={15}>
      {isLoading ? (
        <>
          <Skeleton height="40px" mb={4} />
          <Skeleton height="200px" mb={4} />
          <Skeleton height="40px" mb={4} />
          <Skeleton height="40px" mb={4} />
          <Skeleton height="40px" mb={4} />
        </>
      ) : (
        <Box display="grid" gap="2">
          <Box>
            <Input
              variant="outline"
              onChange={(e) =>
                setCourse((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              value={course?.title}
              placeholder="Title"
            />
          </Box>

          <Textarea
            placeholder="Description"
            h={200}
            onChange={(e) =>
              setCourse((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            value={course?.description}
            resize={"none"}
          />

          <Box display={"flex"} gap={4}>
            <Box flex={1}>
              <Text>Due date</Text>
              <Input
                id="date"
                value={
                  course?.dueDate
                    ? new Date(course.dueDate).toJSON().split("T")[0]
                    : ""
                }
                type="date"
                onChange={(e) =>
                  setCourse((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
              />
            </Box>
          </Box>

          <Box>
            <Text>Videos controller</Text>
            <Box
              borderRadius={6}
              border={"1px"}
              borderColor="var(--chakra-colors-chakra-border-color)"
            >
              <Button
                onClick={() => {
                  if (loadingLastVideo) {
                    alert(
                      "Please, wait until the last informed video is ready"
                    );
                    return;
                  }

                  onOpen();
                }}
                borderRadius={0}
                w={"100%"}
              >
                +
              </Button>

              <Box maxHeight={"28vh"} overflow={"auto"}>
                {!!course.videos.length &&
                  course.videos.map((video, index) => (
                    <Box key={index} display="flex" p={2}>
                      <Box display={"flex"} alignItems={"center"}>
                        <Text>{video.title}</Text>
                      </Box>

                      <Box marginLeft="auto">
                        <Button onClick={() => handleRemoveVideo(index)}>
                          X
                        </Button>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{"Adding a video"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display={"flex"}
              alignContent={"center"}
              alignItems={"center"}
              gap={4}
            >
              <Input
                variant="outline"
                id="title"
                onBlur={(e) => setVideo({ ...video, title: e.target.value })}
                placeholder="Title"
              />
              <Tooltip
                hasArrow
                label="Get the title from the video link"
                bg="gray.300"
                color="black"
                m={1}
              >
                <SearchIcon
                  _hover={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (!validateYouTubeUrl(video.youtubeId)) {
                      alert("Please, fill a valid youtube link");
                      return;
                    }

                    extractVideoInformation(video.youtubeId).then(
                      (response) => {
                        if (!response) {
                          return;
                        }

                        setVideo({
                          ...video,
                          title: response.title,
                        });

                        const titleInput = document.getElementById(
                          "title"
                        ) as HTMLInputElement;

                        titleInput.value = response.title;
                      }
                    );
                  }}
                />
              </Tooltip>
            </Box>

            <br />

            <Box>
              <Input
                variant="outline"
                onBlur={(e) =>
                  setVideo({ ...video, youtubeId: e.target.value })
                }
                placeholder="Youtube link"
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant={"outline"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={handleSaveVideo}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        position="fixed"
        right="0"
        bottom="0"
        color="white"
        gap={3}
        p={5}
        display="flex"
        flex={1}
        _hover={{
          cursor: "pointer",
        }}
      >
        <Flex position="fixed" bottom="0" right="0" p={4} align="center">
          <HStack spacing={1}>
            <IconButton
              aria-label="Go back"
              icon={<ArrowBackIcon />}
              size="lg"
              colorScheme="yellow"
              borderRadius="full"
              onClick={() => {
                router.back();
              }}
            />

            {courseId !== "new" && (
              <IconButton
                aria-label="Delete Course"
                icon={<DeleteIcon />}
                size="lg"
                colorScheme="red"
                borderRadius="full"
                onClick={() => {
                  callServer(`/api/course/${courseId}`, {
                    method: "DELETE",
                  }).then((response) => {
                    if (!response) {
                      return;
                    }

                    router.replace("/");
                  });
                }}
              />
            )}

            <IconButton
              aria-label="Save"
              icon={<CheckIcon />}
              size="lg"
              colorScheme="green"
              borderRadius="full"
              onClick={async () => {
                const { title, description, dueDate, videos } = course ?? {};

                if (!dueDate) {
                  alert("Please, select a due date");
                  return;
                }

                if (!title) {
                  alert("Please, fill the title");
                  return;
                }

                if (!description) {
                  alert("Please, fill the description");
                  return;
                }

                if (loadingLastVideo) {
                  alert("Please, wait until the last informed video is ready");
                  return;
                }

                const method = courseId !== "new" ? "PATCH" : "POST";
                const url =
                  courseId !== "new"
                    ? `/api/course/${courseId}`
                    : "/api/course";

                const response = await callServer(url, {
                  method,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    title,
                    description,
                    dueDate,
                    videos,
                  }),
                });
                if (!response) {
                  return;
                }

                router.back();
              }}
            />
          </HStack>
        </Flex>

        {loadingLastVideo && (
          <Box
            bg="rgba(0, 0, 0, 0.5)"
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            top="0"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner color="white" size="lg" />
          </Box>
        )}
      </Box>

      <Box display={"none"}>
        {!!youtubeLink && (
          <YoutubePlayer
            onReady={(target) => {
              target.pauseVideo();

              const { videoId } = target.options;
              const duration = target.getDuration();

              setLastVideo((prev) => {
                if (!prev) {
                  return null;
                }

                return {
                  ...prev,
                  duration,
                };
              });

              changeVideoTime(videoId, duration);

              if (loadingLastVideo) {
                setLoadingLastVideo(false);
              }
            }}
            url={youtubeLink}
            mute
          />
        )}
      </Box>
    </Box>
  );
}
