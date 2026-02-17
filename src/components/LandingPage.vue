<template>
  <div id="wrapper">
    <!-- Lewa kolumna z przyciskami -->
    <div class="left-column">
      <div class="left-column-content">
        <h1>Testownik <small>Web</small></h1>
        
        <!-- Obszar Drop Zone / Wybór pliku -->
        <div 
          id="drag" 
          :class="{'drag-over': isDragOver}"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <!-- Oryginalna ikona SVG z kodu -->
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 412" style="enable-background:new 0 0 412 412;">
            <path d="M334,140h-64c-4.4,0-8,3.6-8,8c0,4.4,3.6,8,8,8h64c13.2,0,24,10.8,24,24v192c0,13.2-10.8,24-24,24H78c-13.2,0-24-10.8-24-24V180c0-13.2,10.8-24,24-24h72c4.4,0,8-3.6,8-8c0-4.4-3.6-8-8-8H78c-22,0-40,18-40,40v192c0,22,18,40,40,40h256c22,0,40-18,40-40V180C374,158,356,140,334,140z"/>
            <path d="M206,28c4.4,0,8-3.6,8-8V8c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8v12C198,24.4,201.6,28,206,28z"/>
            <path d="M129.6,211.6c-3.2,3.2-3.2,8,0,11.2l70.8,70.8c1.6,1.6,3.6,2.4,5.6,2.4s4-0.8,5.6-2.4l70.8-70.8c3.2-3.2,3.2-8,0-11.2s-8-3.2-11.2,0L214,268.8V56c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8v212.8l-57.2-57.2C137.6,208.4,132.8,208.4,129.6,211.6z"/>
          </svg>
          
          <a><b>Wybierz pliki bazy</b> (lub upuść tutaj)</a>
          <p v-if="loading" style="color: var(--primary-color)">Wczytywanie...</p>
          
          <!-- Ukryty input file -->
          <input 
            type="file" 
            ref="fileInput" 
            multiple 
            accept=".txt" 
            style="display: none" 
            @change="handleFileSelect"
          />
        </div>

        <div class="buttons">
          <button class="default-button">
            <font-awesome-icon :icon="['fas', 'info']" style="margin-right: 10px; opacity: 0.5;" />
            Informacje
          </button>
          <button class="default-button">
            <font-awesome-icon :icon="['fas', 'cog']" style="margin-right: 10px; opacity: 0.5;" />
            Ustawienia
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faInfo } from '@fortawesome/free-solid-svg-icons';
import webQuestionsReader from '@/services/webquestionsReader'; // Upewnij się co do ścieżki!

// Rejestracja ikon
library.add(faCog, faInfo);

// Emitujemy zdarzenie do App.vue, gdy baza zostanie załadowana
const emit = defineEmits(['quiz-loaded']);

const isDragOver = ref(false);
const loading = ref(false);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const processFiles = async (files) => {
  loading.value = true;
  try {
    const questions = await webQuestionsReader.parseUploadedFiles(files);
    if (questions.length > 0) {
      console.log("Załadowano pytań:", questions.length);
      // Wysyłamy pytania w górę do App.vue
      emit('quiz-loaded', questions);
    } else {
      alert("Nie znaleziono poprawnych pytań w wybranych plikach.");
    }
  } catch (e) {
    console.error(e);
    alert("Błąd wczytywania plików");
  } finally {
    loading.value = false;
    isDragOver.value = false;
  }
};

const handleFileSelect = (e) => {
  if (e.target.files.length) processFiles(e.target.files);
};

const handleDrop = (e) => {
  isDragOver.value = false;
  if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
};
</script>

<style lang="scss" scoped>
// Importujemy oryginalne kolory (ścieżka musi być poprawna!)
@import '@/style/_colors.scss';

h1 {
  font-size: 3em;
  font-weight: 200;
  color: #333; // Fallback
  color: var(--primary-text);
  
  small {
    font-size: 0.5em;
    opacity: 0.5;
  }
}

#wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  transition: background .2s ease;
  text-align: center;
  background: #f4f4f4; // Fallback
  background: var(--main-window-background);

  #drag {
    border-color: #ccc; // Fallback
    border-color: var(--drag-border-color);
    background: #fff; // Fallback
    background: var(--drag-background);
    color: #666;
    color: var(--secondary-text);
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border-width: 2px;
    border-style: dashed;
    text-align: center;
    max-width: 512px;
    height: 196px;
    margin: 32px auto;
    transition: background .2s ease, transform .1s;
    cursor: pointer;
    
    &.drag-over {
      background: #e6f7ff;
      border-color: #1890ff;
      transform: scale(1.02);
    }

    svg {
      height: 64px;
      margin-bottom: 16px;
      fill: #999;
      fill: var(--distant-text);
      transition: all .2s ease;
    }
    
    a {
      pointer-events: none; // Klikamy w diva, nie w link
    }
  }

  .left-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .left-column-content {
      margin-top: 32px;
      padding: 32px;
      
      .buttons {
        margin-top: 20px;
        .default-button {
          margin: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 48px;
          cursor: pointer;
          background: none;
          transition: all .2s ease;
          color: #666;
          font-size: 1rem;
          
          &:hover {
            color: #333;
            background: rgba(0,0,0,0.05);
          }
        }
      }
    }
  }
}
</style>