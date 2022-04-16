<template>
  <v-card-text>
    <p class="prompt text-center">
      {{ game.dilemma.prompt }}
    </p>
    <p class="question text-center">
      {{ game.dilemma.question }}
    </p>
    <v-list>

    </v-list>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions>
    <v-btn color="success" @click="chooseYes">Yes</v-btn>
    <v-spacer></v-spacer>
    <v-btn color="error" @click="chooseNo">No</v-btn>
  </v-card-actions>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/store/game'
const game = useGameStore()

function chooseYes() {

}

function chooseNo() {

}
</script>

<style scoped>
.prompt {
  font-size: 1.2rem;
  margin-bottom: 1em;
}
.question {
  font-size: 1.2rem;
  font-weight: bold;
}

</style>
