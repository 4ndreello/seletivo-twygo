import { Spinner } from "@chakra-ui/react";

export default async function callServer(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error fetching data");
  }

  return response.json();
}
