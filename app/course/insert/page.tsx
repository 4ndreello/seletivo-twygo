"use client";

import { ArrowBackIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Box, Input, Text, Textarea } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <Box p={15}>
      <Box display="grid" gap="2">
        <Box>
          <Input variant="outline" placeholder="Title" />
        </Box>

        <Textarea placeholder="Description" h={200} resize={"none"} />

        <Box>
          <Input variant="outline" placeholder="Video link" />
        </Box>

        <Box>
          <Text>Image</Text>
          <input type="file" />
        </Box>
      </Box>

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
