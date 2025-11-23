export async function getRegisterBook() {
    const response = await fetch('http://localhost:8080/api/register-books');
    if (!response.ok) {
        throw new Error(`Erro ao buscar livros: ${response.statusText}`);
    }
    return response.json();
}

export async function addRegisterBook(book: { title: string; author: string; isbn: string; description: string; }) {
    const response = await fetch('http://localhost:8080/api/register-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
    });

    if (!response.ok) {
        throw new Error(`Erro ao adicionar livro: ${response.statusText}`);
    }

    return response.json();
}

export async function deleteBook(bookId: string | number) {
    const response = await fetch(`http://localhost:8080/api/register-books/${bookId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Erro ao deletar livro: ${response.statusText}`);
    }

    return response.json();
}

export async function updateBook(bookId: string | number, updatedBook: { title?: string; author?: string; isbn?: string; description?: string; }) {
    const response = await fetch(`http://localhost:8080/api/register-books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
        throw new Error(`Erro ao atualizar livro: ${response.statusText}`);
    }

    return response.json();
}
