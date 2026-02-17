<template>
  <div class="container">
    <h1>Testownik Web</h1>

    <!-- EKRAN STARTOWY -->
    <div v-if="questions.length === 0" class="upload-box">
      <h2>Wczytaj bazę</h2>
      <p>Zaznacz wszystkie pliki .txt z folderu z pytaniami.</p>
      
      <input 
        type="file" 
        multiple 
        @change="handleFiles" 
        accept=".txt"
        id="fileInput"
      />
      <label for="fileInput" class="btn">Wybierz pliki</label>
      
      <p v-if="loading">Przetwarzanie...</p>
    </div>

    <!-- EKRAN TESTU (PODGLĄD) -->
    <div v-else class="quiz-box">
      <div class="header">
        <span>Pytań: {{ questions.length }}</span>
        <button @click="questions = []">Zmień bazę</button>
      </div>

      <div class="question-preview">
        <h3>Pytanie #1 (Podgląd):</h3>
        <!-- Wyświetlamy treść pierwszego pytania -->
        <div v-if="questions[0].contentType === 'text'">
          {{ questions[0].content }}
        </div>
        <div v-else>
           [Obrazek: {{ questions[0].content }}]
        </div>

        <ul>
          <li v-for="ans in questions[0].answers" :key="ans.id" 
              :class="{ correct: ans.isCorrect }">
            {{ ans.content }} 
            <span v-if="ans.isCorrect">(Poprawna)</span>
          </li>
        </ul>
      </div>
      
      <p style="margin-top: 20px; color: #666;">
        To jest tylko podgląd, aby potwierdzić, że parser działa. 
        Teraz trzeba dorobić logikę "klikania" :)
      </p>
    </div>
  </div>
</template>

<script setup>
import Titlebar from './components/titlebar/Titlebar.vue'
import SettingsModal from './components/shared/modals/SettingsModal.vue'
import InfoModal from './components/shared/modals/InfoModal.vue'
import WhatsNewModal from './components/shared/modals/WhatsNewModal.vue'
import { ref } from 'vue';
// Importujemy nasz nowy parser
import webquestionsReader from "./renderer/services/webquestionsReader.js";

const questions = ref([]);
const loading = ref(false);

const handleFiles = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  loading.value = true;
  try {
    // Używamy naszej nowej funkcji
    const parsed = await webquestionsReader.parseUploadedFiles(files);
    
    if (parsed.length === 0) {
      alert("Nie znaleziono poprawnych pytań w wybranych plikach.");
    } else {
      questions.value = parsed;
      console.log("Załadowane pytania:", parsed);
    }
  } catch (e) {
    console.error(e);
    alert("Błąd podczas wczytywania plików.");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss">
@import "./renderer/style/_colors.scss";
$primary-color: #39b54a;

#app {
  --green-color: #39b54a;
  --yellow-color: rgb(255, 219, 58);
  --red-color: rgb(241, 81, 81);

  --primary-color: #{$primary-color};
  --primary-color-lighter: #{lighten($primary-color, 2)};
  --primary-color-lightest: #{lighten($primary-color, 5)};
}
 
#app[theme=light] {
  --primary-text: rgba(0,0,0,.75);
  --secondary-text: rgba(0,0,0,.4);
  --distant-text: rgba(0,0,0,.2);

  --background: #eee;
  --background-2: #fafafa;
  --background-3: #fff;

  --max-color: 255, 255, 255;
  --contrast-color: 0, 0, 0;

  // specific
  --main-window-background: var(--background-2);
  --sidebar-background: var(--background);
  --answer-single-type-background: var(--background-3);
  --answer-single-type-checked-border-color: rgba(0, 0, 0, 0.25);

  --drag-border-color: rgba(0,0,0,.1);
  --drag-background: rgba(0, 0, 0, 0.02);
  --drag-over-background: rgba(0, 0, 0, 0.05);

  --modal-background: var(--background-2);
  --modal-mask: var(--background);

  --v-select-list-background: var(--background-3);
  --v-select-list-hover: rgba(0,0,0,.05);
}
#app[theme=dark] {
  $background: #21252b;

  --primary-text: rgba(255,255,255,.75);
  --secondary-text: rgba(255,255,255,.4);
  --distant-text: rgba(255,255,255,.2);

  --background: #{$background};
  --background-2: #{darken($background, 2)};
  --background-3: #{darken($background, 3)};

  --max-color: 0, 0, 0;
  --contrast-color: 255, 255, 255;

  // specific
  --main-window-background: var(--background);
  --sidebar-background: var(--background-3);
  --answer-single-type-background: var(--background-2);
  --answer-single-type-checked-border-color: rgba(255, 255, 255, 0.15);

  --drag-border-color: rgba(255,255,255,.1);
  --drag-background: rgba(255,255,255,.02);
  --drag-over-background: rgba(255,255,255,.04);

  --modal-background: var(--background);
  --modal-mask: var(--background-3);

  --v-select-list-background: var(--background-2);
  --v-select-list-hover: var(--background-3);
}
#app[theme=legacy] {
  --green-color: rgb(0,255,0);
  --yellow-color: rgb(255, 255, 0);
  --red-color: rgb(255, 0, 0);

  --primary-color: #00ff00;
  --primary-color-lighter: #{lighten(#00ff00, 2)};
  --primary-color-lightest: #{lighten(#00ff00, 5)};

  --primary-text: rgba(255,255,255,1);
  --secondary-text: rgba(255,255,255,.6);
  --distant-text: rgba(255,255,255,.4);

  --background: #075098;
  --background-2: #{mix(#075098, #06488a)};
  --background-3: #06488a;

  --max-color: 0, 0, 0;
  --contrast-color: 255, 255, 255;

  // specific
  --main-window-background: var(--background);
  --sidebar-background: var(--background-3);
  --answer-single-type-background: #ffffff;
  --answer-single-type-checked-border-color: rgba(255, 255, 255, 0.15);

  --drag-border-color: rgba(255,255,255,.1);
  --drag-background: rgba(255,255,255,.02);
  --drag-over-background: rgba(255,255,255,.04);

  --modal-background: var(--background);
  --modal-mask: var(--background-3);

  --v-select-list-background: var(--background-2);
  --v-select-list-hover: var(--background-3);
}
.answer-single-type-theme {
  background: var(--answer-single-type-background);
}
</style>

<style lang="scss">
@import "./renderer/style/_colors.scss";
@import "./renderer/style/ui_elements.scss";
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

button {
  outline: none;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Open Sans', sans-serif;
  overflow-y: hidden;
}

#app {
  background: var(--main-window-background);
  overflow-y: hidden;
  &, span {
    color: var(--primary-text);
  }
}

.page-component-fade-enter-active {
  transition: all 0.2s ease-out;
}
.page-component-fade-leave-active {
  transition: all 0.2s ease-in;
}
.page-component-fade-enter,
.page-component-fade-leave-to {
  opacity: 0;
}
.page-component-fade-enter {
  transform: translateX(32px);
}
.page-component-fade-leave-to {
  transform: translateX(-32px);
}
</style>
