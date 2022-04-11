<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Host a Game</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Player Name"
                placeholder="Gamer McGameface"
                variant="outlined"
                v-model="game.username"
              ></v-text-field>
              <v-text-field
                v-model="game.spreadsheetID"
                label="Dilemma Spreadsheet"
                placeholder="Google Spreadsheet ID"
                variant="outlined"
                clearable
                :loading="loadingGameData"
                @keydown.enter.prevent="loadGameData"
                :messages="dilemmaInfo"
                @click:clear="game.dilemmas = []"
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
                <v-list-item v-for="peer in game.peers" :key="peer">{{ peer }}</v-list-item>
              </v-list>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :to="gameLink" :disabled="!gameLink">Start Game</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!game.peer" @click="copyShareLink">Share Join Link</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useGameStore } from '@/store/game'
import { computed, ref, onMounted, inject } from 'vue'
const loadingGameData = ref(false)
const game = useGameStore()
const waiting = ref(true)

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

function loadGameData() {
  if (loadingGameData.value) {
    return
  }
  loadingGameData.value = true
  fetch(`https://opensheet.elk.sh/${game.spreadsheetID}/1`)
    .then((res) => res.json())
    .then((data) => {
      game.dilemmas = data
    })
    .then(() => {
      loadingGameData.value = false
    });
}

const copyShareLink = () => {
  if (game.peer && game.peer.id) {
    const pathPrefix = import.meta.env.BASE_URL;
    navigator.clipboard.writeText(`${window.origin}${pathPrefix}join/${game.peer.id}`)
  }
}

onMounted(() => {
  game.createPeer()

  loadGameData()
})
</script>
