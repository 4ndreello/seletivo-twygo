export default async function callServer(url: string, options?: RequestInit) {
  try {
    var response = await fetch(url, options);
  } catch (error: any) {
    alert("An error occurred while fetching the data\n\n" + error.message);
    return false;
  }

  if (!response.ok) {
    const errorMessage = (await response.json())?.message ?? "";
    alert("An error occurred while fetching the data\n\n" + errorMessage);
    return false;
  }

  if (response.status === 204) {
    return true;
  }

  return response.json();
}
