<template>
    <div class="login-container">
      <div class="login-form">
        <h2>Login</h2>
        <form @submit.prevent="submitLogin">
          <div class="input-group">
            <label for="email">Email</label>
            <input
              type="email"
              v-model="email"
              id="email"
              placeholder="Ingrese su correo electrónico"
              required
            />
          </div>
          <div class="input-group">
            <label for="password">Password</label>
            <input
              type="password"
              v-model="password"
              id="password"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <button type="submit" class="login-btn">Ingresar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from 'sweetalert2';
  import { login } from '../API/authApi'; // endponit para login
  
  export default {
    name: 'UserLogin',
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async submitLogin() {
        try {
          const data = await login(this.email, this.password);
          localStorage.setItem('token', data.token);
          this.$router.push('/home');
  
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: error.message || 'Hubo un error al intentar iniciar sesión.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    }
  }
  </script>
  
  <style src="./../styles/userLogin.css"></style>  