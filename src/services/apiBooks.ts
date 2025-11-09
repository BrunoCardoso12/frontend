export async function getBook() {
    const responseBook = await fetch('http://localhost:8080/api/books');
    return responseBook.json();
}

export async function addBook(book: { title: string; author: string; description: string; coverImageUrl: string; community: string; available: Boolean; }) {
    const responseBook = await fetch('http://localhost:8080/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });
    return responseBook.json();
}
