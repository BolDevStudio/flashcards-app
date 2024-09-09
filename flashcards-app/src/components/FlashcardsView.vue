<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Flashcards by Category</h1>
    <div v-if="!selectedCard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(cards, category) in categorizedFlashcards" :key="category" class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">{{ category }}</h2>
        <div v-for="card in cards" :key="card.id" class="flashcard mb-3" @click="selectCard(card)">
          <div class="p-4 flex items-center justify-center h-full">
            <p class="text-gray-800 font-medium text-center">{{ card.question }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedCard" class="fixed inset-0 flex items-center justify-center z-50 ">
      <div class="relative w-80 h-48 bg-white rounded-lg shadow-lg">
        <button @click="deselectCard" class="absolute top-4 left-4 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 z-10">
          ×
        </button>
        <button @click="prevCard" v-if="hasPrevCard" class="absolute top-4 right-16 text-white bg-gray-700 hover:bg-gray-800 rounded-full p-2 z-10">
          ←
        </button>
        <button @click="nextCard" v-if="hasNextCard" class="absolute top-4 right-4 text-white bg-gray-700 hover:bg-gray-800 rounded-full p-2 z-10">
          →
        </button>
        <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div v-if="selectedCard" class="flashcard-preview">
            <div class="flashcard-inner" :class="{ 'is-flipped': isFlipped }">
              <div class="flashcard-front flex items-center justify-center flex-col">
                <p class="text-gray-800 font-medium text-center">{{ selectedCard.question }}</p>
                <button @click="flipCard" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Show Answer</button>
              </div>
              <div class="flashcard-back flex items-center justify-center">
                <p class="text-gray-600 text-center">{{ selectedCard.answer }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Progress Bar Below Flashcard -->
    <div v-if="selectedCard" class="fixed bottom-0 left-0 w-full bg-gray-100 p-4 flex items-center justify-center">
      <div class="relative w-full max-w-md bg-gray-200 h-4 rounded-full overflow-hidden">
        <div :style="{ width: progressWidth }" class="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-500">
          <span class="absolute inset-0 flex items-center justify-center text-white font-semibold">{{ progressPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardsView',
  data() {
    return {
      selectedCard: null,
      isFlipped: false,
      currentIndex: null,
      categorizedFlashcards: {
        "Grammar": [
          { id: 1, question: 'What is a verb?', answer: 'A word that represents an action or state.' },
          { id: 2, question: 'What is a noun?', answer: 'A word that represents a person, place, thing, or idea.' },
        ],
        "Vocabulary": [
          { id: 3, question: 'What is "Haus"?', answer: 'House in German.' },
          { id: 4, question: 'What is "Apfel"?', answer: 'Apple in German.' },
          { id: 4, question: 'What is "Apfel"?', answer: 'Apple in German.' },
          { id: 4, question: 'What is "Apfel"?', answer: 'Apple in German.' },
          { id: 4, question: 'What is "Apfel"?', answer: 'Apple in German.' },

        ],
      },
    };
  },
  computed: {
    hasPrevCard() {
      return this.currentIndex > 0;
    },
    hasNextCard() {
      return this.currentIndex < this.getAllCards().length - 1;
    },
    progressWidth() {
      const totalCards = this.getAllCards().length;
      const progress = ((this.currentIndex + 1) / totalCards) * 100;
      return `${progress}%`;
    },
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.getAllCards().length) * 100);
    },
  },
  methods: {
    selectCard(card) {
      this.selectedCard = card;
      this.isFlipped = false;
      this.currentIndex = this.getAllCards().findIndex(c => c.id === card.id);
    },
    deselectCard() {
      this.selectedCard = null;
    },
    flipCard() {
      this.isFlipped = !this.isFlipped;
    },
    nextCard() {
      if (this.hasNextCard) {
        this.currentIndex++;
        this.selectedCard = this.getAllCards()[this.currentIndex];
        this.isFlipped = false;
      }
    },
    prevCard() {
      if (this.hasPrevCard) {
        this.currentIndex--;
        this.selectedCard = this.getAllCards()[this.currentIndex];
        this.isFlipped = false;
      }
    },
    getAllCards() {
      return Object.values(this.categorizedFlashcards).flat();
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
    },
    enter(el, done) {
      el.offsetHeight; // trigger reflow
      el.style.transition = 'opacity 0.5s, transform 0.5s';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
      done();
    },
    leave(el, done) {
      el.style.transition = 'opacity 0.5s, transform 0.5s';
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      done();
    },
  },
};
</script>

<style scoped>
.flashcard {
  cursor: pointer;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flashcard-preview {
  width: 100%;
  max-width: 320px;
  height: 200px;
  perspective: 1000px;
}

.flashcard-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}

.flashcard-front, .flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.flashcard-front {
  background: #fff;
}

.flashcard-back {
  background: #f8f9fa;
  transform: rotateY(180deg);
}

.flashcard-inner.is-flipped {
  transform: rotateY(180deg);
}

button {
  border: none;
  outline: none;
  cursor: pointer;
}

.flashcard-preview {
  transition: all 0.6s ease;
}

.flashcard-preview .flashcard-inner {
  transition: transform 0.6s ease;
}

.progress-bar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f1f1f1;
  padding: 10px;
  opacity: 1; /* Ensure full opacity */
}

.progress-bar {
  width: 100%;
  background: #e0e0e0;
  border-radius: 5px;
  position: relative;
  height: 4px;
}

.progress-bar-fill {
  height: 100%;
  background: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-bar-text {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
}
</style>
