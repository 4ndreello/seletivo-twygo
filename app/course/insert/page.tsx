"use client";

import { ArrowBackIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const videos: { title: string; link: string }[] = [
  {
    title: "Desenvolvimento humano e especializado do gmg",
    link: "https://www.youtube.com/watch?v=Usnop2ISIbg",
  },
  { title: "GMG", link: "https://www.youtube.com/watch?v=Usnop2ISIbg" },
];

export default function Page() {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box p={15}>
      <Box display="grid" gap="2">
        <Box>
          <Input variant="outline" placeholder="Title" />
        </Box>

        <Textarea placeholder="Description" h={200} resize={"none"} />

        <Box>
          <p>{"Title"}</p>
          <Text>Videos controller</Text>
          <Box
            borderRadius={6}
            border={"1px"}
            borderColor="var(--chakra-colors-chakra-border-color)"
          >
            <Button
              onClick={() => {
                onOpen();
              }}
              borderRadius={0}
              w={"100%"}
            >
              +
            </Button>

            <Box maxHeight={"28vh"} overflow={"auto"}>
              {videos.map((video, index) => {
                return (
                  <Box key={index} display="flex" p={2}>
                    <Box display={"flex"} alignItems={"center"}>
                      <Text>{video.title}</Text>
                    </Box>

                    <Box marginLeft="auto">
                      <Button>X</Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{"Adding a video"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Input variant="outline" placeholder="Title" />
            </Box>

            <br />

            <Box>
              <Input variant="outline" placeholder="Youtube link" />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant={"outline"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        position="fixed"
        right="0"
        bottom="0"
        color="white"
        onClick={() => {
          router.back();
        }}
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
            bg="red"
            color="white"
            boxSize={4}
            w={16}
            h={16}
          />
        </Box>
        <Box>
          <PlusSquareIcon
            borderRadius={6}
            p={2}
            bg="green"
            color="white"
            boxSize={4}
            w={16}
            h={16}
          />
        </Box>
      </Box>
    </Box>
  );
}
