export async function getUsers() {
  const response = await fetch('http://localhost:8080/api/users');
  return response.json();
}

export async function addUser(user: { name: string; email: string; password: string }) {
  const response = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return response.json();
}
