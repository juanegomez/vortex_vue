<template>
    <div class="create-question-container">
      <h1>Crear Pregunta</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="title">Título:</label>
          <input type="text" id="title" v-model="question.title" required />
        </div>
        <div class="form-group">
          <label for="body">Pregunta:</label>
          <textarea id="body" v-model="question.body" rows="4" required></textarea>
        </div>
        <div v-for="(answer, index) in question.answers" :key="index" class="form-group">
          <label :for="'answer-' + index">Respuesta {{ index + 1 }}:</label>
          <input type="text" :id="'answer-' + index" v-model="answer.body" required />
          <label>
            <input type="radio" :value="index" v-model="correctAnswerIndex" />
            Correcta
          </label>
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  </template>  
  
  <script>
  import Swal from 'sweetalert2';
  import { createQuestion } from '../API/questionApi';
  
  export default {
    name: 'QuestionDetails',
    data() {
      return {
        question: {
          title: '',
          body: '',
          answers: [
            { body: '', is_correct: false },
            { body: '', is_correct: false },
            { body: '', is_correct: false }
          ]
        },
        correctAnswerIndex: null
      };
    },
    methods: {
      async submitForm() {
        if (this.correctAnswerIndex === null) {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, seleccione la respuesta correcta.'
          });
          return;
        }
  
        // Marcar la respuesta correcta
        this.question.answers.forEach((answer, index) => {
          answer.is_correct = (index === this.correctAnswerIndex);
        });
  
        try {
          const token = localStorage.getItem('token');
          const response = await createQuestion(token, this.question);
  
          // Verificar el estado de la respuesta
          if (response.status === 401) {
            // Redirigir al login si el status code es 401 (Unauthorized)
            this.$router.push('/');
            return;
          }
  
          const data = await response.json();
  
          if (response.status !== 201) {
            // Mostrar un mensaje de error con SweetAlert si la respuesta no es ok
            await Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.message || 'Hubo un problema al crear la pregunta.'
            });
          } else {
            // Mostrar un mensaje de éxito y redirigir a /home si la creación es exitosa
            await Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Pregunta creada exitosamente.'
            });
            this.$router.push('/home');
          }
        } catch (error) {
          console.error('Error al enviar la pregunta:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar la pregunta.'
          });
        }
  
        // Resetear el formulario
        this.resetForm();
      },
      resetForm() {
        this.question = {
          title: '',
          body: '',
          answers: [
            { body: '', is_correct: false },
            { body: '', is_correct: false },
            { body: '', is_correct: false }
          ]
        };
        this.correctAnswerIndex = null;
      }
    }
  }
  </script>  
  
  <style src="./../styles/createQuestion.css"></style>
  