import { createRouter, createWebHistory } from 'vue-router';
import AddFlashcard from '@/components/AddFlashcard.vue';
import DashboardView from "@/components/DashboardView.vue";
import FlashcardsView from "@/components/FlashcardsView.vue";


const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/flashcards',
    name: 'Flashcards',
    component: FlashcardsView,
  },
  {
    path: '/add-flashcard',
    name: 'AddFlashcard',
    component: AddFlashcard,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
