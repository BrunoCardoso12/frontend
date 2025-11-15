export async function getTopicsByBookId(bookId: number) {
  const response = await fetch(`http://localhost:8080/api/topics/book/${bookId}`);
  return response.json();
}
