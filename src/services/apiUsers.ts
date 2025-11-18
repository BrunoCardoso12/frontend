import api from "./api";

//Buscar todos os usuários
export async function getUsers() {
  const { data } = await api.get("/users");
  return data;
}

//Criar novo usuário (registro)
export async function addUser(user: { username: string; email: string; password: string }) {
  const { data } = await api.post("/users", user);
  return data;
}

// Login
export async function loginUser(email: string, password: string) {
  const { data } = await api.post("/users/login", { email, password });
  return data;
}

//Registro (mesmo endpoint de criação)
export async function registerUser(user: { username: string; email: string; password: string }) {
  // usa o mesmo endpoint de criação de usuário
  const { data } = await api.post("/users", user);
  return data;
}
