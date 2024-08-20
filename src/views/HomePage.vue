<template>
  <div class="home-container">
    <div class="header">
      <h1 class="title">Lista de Preguntas</h1>
      <button class="create-question-button" @click="exportQuestionsToExcelButton">Exportar a Excel</button>
      <button class="create-question-button" @click="createQuestion">Crear Pregunta</button>
    </div>
    <table v-if="questions.length" class="questions-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Titulo</th>
          <th>Pregunta</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.id }}</td>
          <td>{{ question.title }}</td>
          <td>{{ question.body }}</td>
          <td>
            <button @click="viewQuestion(question.id)">Responder pregunta</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay preguntas disponibles</p>

    <!-- Paginación -->
    <div class="pagination" v-if="pagination.total > 0">
      <button
        class="pagination-button prev-button"
        v-if="pagination.current_page > 1"
        @click="fetchQuestions(pagination.current_page - 1)"
      >
        Anterior
      </button>
      <span class="pagination-info">Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
      <button
        class="pagination-button next-button"
        v-if="pagination.current_page < pagination.last_page"
        @click="fetchQuestions(pagination.current_page + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>
  
<script>
import { getQuestions, exportQuestionsToExcel } from '../API/questionApi';

export default {
  name: 'HomePage',
  data() {
    return {
      questions: [],
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1
      }
    };
  },
  async mounted() {
    await this.fetchQuestions();
  },
  methods: {
    async fetchQuestions(page = 1) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await getQuestions(token, page);
          if (data && data.questions) {
            this.questions = data.questions;
            this.pagination = {
              current_page: data.pagination.current_page || 1,
              per_page: data.pagination.per_page || 15,
              total: data.pagination.total || 0,
              last_page: data.pagination.last_page || 1
            };
          } else {
            this.questions = [];
            this.pagination = {
              current_page: 1,
              per_page: 15,
              total: 0,
              last_page: 1
            };
          }
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        this.questions = [];
        this.pagination = {
          current_page: 1,
          per_page: 15,
          total: 0,
          last_page: 1
        };
      }
    },
    async exportQuestionsToExcelButton() {
      const token = localStorage.getItem('token');
      try {
        await exportQuestionsToExcel(token);
      } catch (error) {
        console.error('Error al iniciar la exportación:', error);
      }
    },
    viewQuestion(id) {
      this.$router.push({ name: 'answerQuestion', params: { id } });
    },
    createQuestion() {
      this.$router.push('/create-question');
    }
  }
}
</script>
  
<style src="./../styles/homePage.css"></style>