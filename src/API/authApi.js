export async function login(email, password) {
  // eslint-disable-next-line no-useless-catch
  try {
    const apiUrl = process.env.VUE_APP_API_URL;

    const response = await fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.status === 401) {
      // Lanza un error si las credenciales son inválidas
      throw new Error("Credenciales inválidas");
    }

    if (!response.ok) {
      // Lanza un error si la respuesta no es exitosa
      throw new Error("Error en el login");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}