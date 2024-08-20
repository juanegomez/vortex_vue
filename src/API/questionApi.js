const apiUrl = process.env.VUE_APP_API_URL;

export async function getQuestions(token, page = 1) {
  try {
    const response = await fetch(
      `${apiUrl}/api/questions?per_page=15&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      // Lanza un error si las credenciales son inválidas
      throw new Error("Credenciales inválidas");
    }

    if (!response.ok) {
      // Lanza un error si la respuesta no es exitosa
      throw new Error("Error al obtener las preguntas");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getQuestions:", error);
    return {
      questions: [],
      pagination: { current_page: 1, per_page: 15, total: 0, last_page: 1 },
    };
  }
}

export async function createQuestion(token, question) {
  try {
    const response = await fetch(`${apiUrl}/api/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(question),
    });

    // Devuelve la respuesta completa
    return response;
  } catch (error) {
    console.error("Error al enviar la pregunta:", error);
    throw error;
  }
}

export async function getQuestion(questionId, token) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${apiUrl}/api/questions/${questionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function validateAnswer(questionId, answerId, token) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(`${apiUrl}/api/questions/validate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question_id: questionId,
        answer_id: answerId,
      }),
    });

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function exportQuestionsToExcel(token) {
  try {
    const response = await fetch(`${apiUrl}/api/questions/export`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error en la exportación");
    }

    return response;
  } catch (error) {
    console.error("Error al iniciar la exportación:", error);
    throw error;
  }
}
