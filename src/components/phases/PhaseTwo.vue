<template>
  <v-card-text>
    <p class="prompt text-center">
      {{ game.dilemma.prompt }}
    </p>
    <p class="question text-center">
      {{ game.dilemma.question }}
    </p>
    <p class="waiting text-center">Waiting for votes...</p>
    <v-list>
      <v-list-item
        v-for="state in game.playerStates"
        :key="state.peerID"
        :title="state.username"
        density="compact">
        <template v-slot:append>
          <v-list-item-avatar end>
            <v-progress-circular
              v-if="!state.voted"
              size="24"
              color="purple"
              indeterminate></v-progress-circular>
            <v-icon v-else color="green">mdi-check-circle</v-icon>
          </v-list-item-avatar>
        </template>
      </v-list-item>
    </v-list>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions>
    <template v-if="!voted">
      <v-btn color="success" @click="chooseYes">Yes</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="chooseNo">No</v-btn>
    </template>
    <template v-else>
      <p class="waiting text-center">Waiting for votes...</p>
    </template>
  </v-card-actions>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useGameStore } from '@/store/game'
const game = useGameStore()
const voted = computed(() => (game.playerStates[game.peerID] && game.playerStates[game.peerID].voted))

function chooseYes() {
  game.vote(true)
}

function chooseNo() {
  game.vote(false)
}

function allVoted() {
  return game.playerStates.every(state => state.voted)
}

watch(allVoted, async (newstate, oldstate) => {
  if (newstate) {
    game.phase = 3
  }
})
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
.waiting {
  font-size: 0.8rem;
  margin-top: 2em;
  width: 100%;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

</style>
