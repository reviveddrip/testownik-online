<template>
  <div id="app-container">
    <!-- Jeśli nie ma pytań, pokaż ekran startowy -->
    <LandingPage 
      v-if="questions.length === 0" 
      @quiz-loaded="startQuiz" 
    />

    <!-- Jeśli są pytania, tu będzie (kiedyś) Quiz.vue -->
    <div v-else class="temp-quiz-view">
      <h1>Quiz trwa!</h1>
      <p>Załadowano: {{ questions.length }} pytań.</p>
      <button @click="questions = []">Wróć do menu</button>
      <!-- Docelowo tutaj wstawimy: <Quiz :questions="questions" /> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LandingPage from '@/components/LandingPage.vue';

const questions = ref([]);

const startQuiz = (loadedQuestions) => {
  questions.value = loadedQuestions;
};
</script>

<style>
/* Reset stylów dla całej strony */
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden; /* Żeby paski przewijania nie psuły layoutu */
}

/* Zmienne kolorystyczne z oryginału (jeśli import w SCSS zawiedzie) */
:root {
  --main-window-background: #f9f9f9;
  --drag-background: #ffffff;
  --drag-border-color: #e0e0e0;
  --primary-color: #41b883;
  --secondary-text: #606266;
  --distant-text: #c0c4cc;
}
</style>