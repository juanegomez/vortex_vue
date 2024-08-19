<template>
    <div class="question-details-container" v-if="question">
      <h1>{{ question.title }}</h1>
      <p>{{ question.body }}</p>
  
      <h2>Respuestas</h2>
      <div class="answers-container">
        <div class="answer-item" v-for="answer in question.answers" :key="answer.id">
          <input 
            type="radio" 
            :value="answer.id" 
            v-model.number="selectedAnswer" 
            :id="`answer-${answer.id}`"
          />
          <label :for="`answer-${answer.id}`">{{ answer.body }}</label>
        </div>
      </div>
  
      <button class="submit-button" @click="submitAnswer">Enviar Respuesta</button>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import { getQuestion, validateAnswer } from '../API/questionApi';
  
  export default {
    name: 'QuestionDetails',
    data() {
      return {
        question: null,
        selectedAnswer: null,
      };
    },
    computed: {
      questionId() {
        return Number(this.$route.params.id);
      }
    },
    async mounted() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getQuestion(this.questionId, token);
          
          if (response.status === 200) {
            this.question = response.question;
          } else {
            throw new Error('Error inesperado');
          }
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push('/');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al cargar la pregunta.',
          });
        }
      }
    },
    methods: {
      async submitAnswer() {
        try {
          const token = localStorage.getItem('token');
          if (!token || !this.selectedAnswer) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debes seleccionar una respuesta',
            });
            return;
          }
  
          const answerId = Number(this.selectedAnswer);
          const questionId = Number(this.questionId);
  
          const result = await validateAnswer(questionId, answerId, token);
  
          if (result.status === 200 && result.is_correct) {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: '¡Respuesta correcta!',
            }).then(() => {
              this.$router.push('/home');
            });
          } else if (result.status === 200 && !result.is_correct) {
            Swal.fire({
              icon: 'info',
              title: 'Oops',
              text: 'Respuesta incorrecta.',
            });
          } else {
            throw new Error('Error inesperado');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar tu respuesta.',
          });
        }
      }
    }
  };
  </script>
  
  <style src="./../styles/questionDetails.css"></style>