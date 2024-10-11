"use client";

import {
  ArrowBackIcon,
  CheckIcon,
  DeleteIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [course, setCourse] = useState<TCourse>({
    title: "",
    description: "",
    dueDate: "01-01-2001      ",
    videos: [],
  });
  const query = useParams<{ id?: string }>();
  const courseId = query?.id ?? "";
  if (!courseId) return null;

  useEffect(() => {
    if (courseId === "new") {
      return;
    }

    fetch(`/api/course/${courseId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setCourse(data);
      });
  }, []);
  const [video, setVideo] = useState<TVideo>({ title: "", youtubeId: "" });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSaveVideo = () => {
    if (video.title && video.youtubeId) {
      setCourse({
        ...course,
        videos: [...course.videos, video],
      });
      setVideo({ title: "", youtubeId: "" });
      onClose();
    }
  };

  const handleRemoveVideo = (indexToRemove: number) => {
    const updatedVideos = course?.videos?.filter?.(
      (_, index) => index !== indexToRemove
    );

    setCourse({
      ...course,
      videos: updatedVideos,
    });
  };

  return (
    <Box p={15}>
      <Box display="grid" gap="2">
        <Box>
          <Input
            variant="outline"
            onChange={(e) =>
              setCourse({
                ...course,
                title: e.target.value,
              })
            }
            value={course?.title}
            placeholder="Title"
          />
        </Box>

        <Textarea
          placeholder="Description"
          h={200}
          onChange={(e) =>
            setCourse({
              ...course,
              description: e.target.value,
            })
          }
          value={course?.description}
          resize={"none"}
        />

        <Box display={"flex"} gap={4}>
          <Box flex={1}>
            <Text>Due date</Text>
            <Input
              id="date"
              value={new Date(course.dueDate).toJSON().split("T")[0]}
              type="date"
              onChange={(e) =>
                setCourse({
                  ...course,
                  dueDate: e.target.value,
                })
              }
            />
          </Box>
          <Box alignContent={"center"}>
            <Text>Image</Text>
            <input type="file" />
          </Box>
        </Box>

        <Box>
          <Text>Videos controller</Text>
          <Box
            borderRadius={6}
            border={"1px"}
            borderColor="var(--chakra-colors-chakra-border-color)"
          >
            <Button onClick={onOpen} borderRadius={0} w={"100%"}>
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
                  onClick={() => {
                    try {
                      var searchParams = new URL(video.youtubeId)?.searchParams;
                    } catch (_) {
                      return;
                    }

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

                    const url = `https://www.youtube.com/oembed?${params.toString()}`;

                    fetch(url)
                      .then((res) => res.json())
                      .then((response) => {
                        setVideo({ ...video, title: response.title });
                        const titleInput = document.getElementById(
                          "title"
                        ) as HTMLInputElement;

                        titleInput.value = response.title;
                      })
                      .catch((error) => {
                        console.error("Error fetching data:", error);
                      });
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
            onClick={() => {
              router.back();
            }}
            boxSize={4}
            w={16}
            h={16}
          />
        </Box>
        <Box>
          <DeleteIcon
            borderRadius={6}
            p={2}
            bg="red"
            color="white"
            onClick={() => {
              fetch(`/api/course/${courseId}`, {
                method: "DELETE",
              }).then(() => {
                router.back();
              });
            }}
            boxSize={4}
            w={16}
            h={16}
          />
        </Box>

        <Box>
          <CheckIcon
            borderRadius={6}
            p={2}
            bg="green"
            color="white"
            boxSize={4}
            w={16}
            h={16}
            onClick={() => {
              const { title, description, dueDate } = course ?? {};

              if (!dueDate) {
                alert("Please, select a due date");
                return;
              }

              console.log("course", course);

              fetch("/api/course", {
                method: courseId !== "new" ? "PATCH" : "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: courseId,
                  title,
                  description,
                  dueDate,
                  videos: course.videos,
                }),
              }).then(() => {
                router.back();
              });
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

interface TVideo {
  title: string;
  youtubeId: string;
}

type TCourse = {
  title: string;
  description: string;
  dueDate: string;
  videos: Array<TVideo>;
};
