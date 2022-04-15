<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Host a Game</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                label="Player Name"
                placeholder="Gamer McGameface"
                variant="outlined"
                v-model="game.username"
                required
                @blur="updateName"
                @input="updateName"
                :rules="[ v => !!v || 'Player name is required' ]"
              ></v-text-field>
              <v-text-field
                v-model="game.spreadsheetID"
                label="Dilemma Spreadsheet"
                placeholder="Google Spreadsheet ID"
                variant="outlined"
                clearable
                :loading="loadingGameData"
                @blur="loadGameData"
                @keydown.enter.prevent="loadGameData"
                :messages="dilemmaInfo"
                @click:clear="game.dilemmas = []"
                required
                :rules="[ v => (v && v.length > 0) || 'You need at least 1 dilemma']"
              ></v-text-field>
              <v-list>
                <v-list-item v-if="waiting">
                  Waiting for more players to join
                  <v-spacer></v-spacer>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-list-item>
                <v-list-item v-for="peer in game.peers" :key="peer">{{ game.usernames[peer] || peer }}</v-list-item>
              </v-list>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="gameLink" :disabled="!valid || !peerID()">Start Game</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!valid || !peerID()" @click="copyShareLink">Share Join Link</v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar
          v-model="copied"
        >
          Join link copied to clipboard

          <template v-slot:actions>
            <v-btn
              color="pink"
              variant="text"
              @click="copied = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useGameStore } from '@/store/game'
import { computed, ref, onMounted } from 'vue'
import { Random, MersenneTwister19937, createEntropy } from 'random-js'
const loadingGameData = ref(false)
const game = useGameStore()
const waiting = ref(true)
const valid = ref(false)
const copied = ref(false)
const form = ref(null)

const dilemmaInfo = computed(() => {
  if (!game.spreadsheetID || loadingGameData.value) return
  return [
    `${game.dilemmas.length} dilemmas loaded`
  ]
})

const gameLink = computed(() => {
  if (game.peer && game.peer.id) {
    return `/game/${game.peer.id}`
  }
  return null
})

function peerID() {
  if (game.peer && game.peer.id) {
    return game.peer.id
  }
  return null
}

function loadGameData() {
  if (loadingGameData.value) {
    return
  }
  loadingGameData.value = true
  fetch(`https://opensheet.elk.sh/${game.spreadsheetID}/1`)
    .then((res) => res.json())
    .then((data) => {
      game.dilemmas = data
      game.seed = createEntropy()
      new Random(MersenneTwister19937.seedWithArray(game.seed)).shuffle(game.dilemmas)
    })
    .then(() => {
      loadingGameData.value = false
      if (form.value) {
        form.value.validate()
      }
    });
}

const copyShareLink = () => {
  if (game.peer && game.peer.id) {
    const pathPrefix = import.meta.env.BASE_URL;
    navigator.clipboard.writeText(`${window.origin}${pathPrefix}join/${game.peer.id}`)
    copied.value = true
  }
}

function updateName() {
  if (form.value) {
    form.value.validate()
  }
  if (game.username) {
    game.updateName()
  }
}

onMounted(() => {
  game.createPeer()

  loadGameData()
})
</script>
