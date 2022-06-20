import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Setup from "../views/Setup.vue";

const routes = [
  {path: '/', component: Home},
  {path: '/setup', component: Setup},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
