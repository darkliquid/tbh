<template>
  <v-card-text>
    <p class="guesses-left text-center" v-if="game.totalGuesses > 1">
      Remaining guesses<br>
      No: {{ game.maxGuesses - game.noGuesses.length }}<br>
      Yes: {{ game.maxGuesses - game.yesGuesses.length }}
    </p>
    <v-list>
      <v-list-item
        v-for="state in game.playerStates.filter(state => (state.peerID !== game.peerID))"
        :key="state.peerID"
        :title="state.username"
      >
        <template v-slot:prepend>
          <v-list-item-avatar start>
            <v-btn :disabled="!canGuess(state.peerID, true)" density="compact" @click="game.guess(state.peerID, true)">
              <v-icon :color="guessColor(state.peerID, true)">{{ guessIcon(state.peerID, true) }}</v-icon>
            </v-btn>
          </v-list-item-avatar>
        </template>
        <template v-slot:append>
          <v-list-item-avatar end>
            <v-btn :disabled="!canGuess(state.peerID, false)" density="compact" @click="game.guess(state.peerID, false)">
              <v-icon :color="guessColor(state.peerID, false)">{{ guessIcon(state.peerID, false) }}</v-icon>
            </v-btn>
          </v-list-item-avatar>
        </template>
      </v-list-item>
    </v-list>
    <template v-if="waiting">
      <p class="waiting text-center">Waiting for guesses...</p>
      <v-list>
        <v-list-item
          v-for="state in game.playerStates"
          :key="state.peerID"
          :title="state.username"
          density="compact">
          <template v-slot:append>
            <v-list-item-avatar end>
              <v-progress-circular
                v-if="!state.guessed"
                size="24"
                color="purple"
                indeterminate></v-progress-circular>
              <v-icon v-else color="green">mdi-check-circle</v-icon>
            </v-list-item-avatar>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions>
    <v-btn color="primary" @click="updateGuessed" :disabled="game.remainingGuesses > 0 || waiting">Guess</v-btn>
  </v-card-actions>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGameStore } from '@/store/game'

const game = useGameStore()
const waiting = ref(false)

function canGuess(peerID, guess) {
  if (waiting.value) return false

  // can toggle off guesses
  if ((guess && game.yesGuesses.includes(peerID)) || (!guess && game.noGuesses.includes(peerID))) {
    return true
  }

  // if we've reached the max guesses for this type of guess, then no
  if ((guess ? game.yesGuesses.length : game.noGuesses.length) >= game.maxGuesses) {
    return false
  }

  // can't toggle on guesses if no more remain
  if (game.remainingGuesses <= 0) {
    return false
  }

  return true
}

function guessColor(peerID, guess) {
  if (game.yesGuesses.includes(peerID) || game.noGuesses.includes(peerID)) {
    if (guess) {
      return 'success'
    }

    return 'error'
  }

  if ((guess ? game.yesGuesses.length : game.noGuesses.length) >= game.maxGuesses) {
    return 'grey'
  }

  if (game.remainingGuesses <= 0) {
    return 'grey'
  }

  if (guess) {
    return 'success'
  }

  return 'error'
}

function guessIcon(peerID, guess) {
  var icon = 'mdi-thumb-'

  if (guess) {
    icon += 'up'
    if (!game.yesGuesses.includes(peerID)) {
      icon += '-outline'
    }
  } else {
    icon += 'down'
    if (!game.noGuesses.includes(peerID)) {
      icon += '-outline'
    }
  }

  return icon
}

function updateGuessed() {
  waiting.value = true
  game.updateGuessed()
}

function allGuessed() {
  return game.playerStates.every(state => state.guessed)
}

watch(allGuessed, async (newstate, oldstate) => {
  if (newstate) {
    game.revealResults()
    game.phase = 4
    waiting.value = false
  }
})

</script>
