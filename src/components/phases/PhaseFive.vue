<template>
  <v-card-text>
    <template v-if="!allPoints">
      <p class="text-center">Waiting for points...</p>
    </template>
    <template v-else>
      <p class="winners text-center text-primary" v-if="winners.length > 0">
        {{ winners }} wins!
      </p>
      <v-list density="compact">
        <v-list-item
          v-for="(player, index) in game.friendlyPoints"
          :key="index"
          :title="player.name"
          dense>
          <template v-slot:append>
            <v-list-item-avatar end>
              <v-icon v-if="player.points >= winningPoints" color="amber">mdi-trophy</v-icon>
              {{ player.points }}
            </v-list-item-avatar>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions>
    <v-btn :disabled="!allPoints" v-if="winners.length === 0" color="primary" @click="nextRound">Next Round</v-btn>
    <v-btn :disabled="!allPoints" v-if="winners.length > 0" color="primary" to="/">New Game</v-btn>
  </v-card-actions>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/store/game'
const game = useGameStore()
const allPoints = computed(() => game.friendlyPoints.length === game.players.length && game.playerStates.every(state => state.scored))
const winningPoints = computed(() => {
  var winPoints = 25
  if (game.dilemmas.length === 0) {
    winPoints = game.friendlyPoints[0].points
  }
  return winPoints
})

const winners = computed(() => {
  var wins = game.friendlyPoints.filter(p => p.points >= winningPoints.value)
  if (wins.length > 1) {
    wins = wins.filter(p => p.points === wins[0].points)
  }

  switch (wins.length) {
    case 0:
      return ''
    case 1:
      return wins[0].name
    default:
      var arr = wins.map(p => p.name)
      return arr.slice(0, arr.length - 1).join(', ') + ", and " + arr.slice(-1)
  }
})

function nextRound() {
  game.nextRound()
}
</script>

<style>
.winners {
  margin-bottom: 1em;
  font-size: 2em;
  font-weight: bold;
}
</style>
