import { createRouter, createWebHistory } from "vue-router";
// import Home from "../views/Home.vue";
import Login from "../views/UserLogin.vue";
import Home from "../views/HomePage.vue";
import answerQuestion from "../views/QuestionDetails.vue";
import saveQuestion from "../views/CreateQuestion.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/question/:id",
    name: "answerQuestion",
    component: answerQuestion,
  },
  {
    path: "/create-question",
    name: "saveQuestion",
    component: saveQuestion,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
