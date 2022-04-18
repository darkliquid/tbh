<template>
  <v-card-text>
    <template v-if="game.results.length < game.players.length">
      <p>Waiting for results</p>
    </template>
    <template v-else>
      <p class="score text-center">You scored {{ game.roundPoints }} this round</p>
      <v-expansion-panels class="round-results">
        <v-expansion-panel v-for="(results, index) in game.friendlyResults" :key="index">
          <v-expansion-panel-title>
            {{ results.username }}
            <template v-slot:actions="{  }">
              <v-icon :color="results.vote ? 'success' : 'error'" :icon="results.vote ? 'mdi-thumb-up' : 'mdi-thumb-down'"></v-icon>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text v-if="results.guesses.length > 0">
            <v-list density="compact">
              <v-list-item
                v-for="(player, index) in results.guesses"
                :key="index"
                :title="player.name"
                dense>
                <template v-slot:append>
                  <v-list-item-avatar end>
                    <v-icon :color="player.guess ? 'success' : 'error'" :icon="player.guess ? 'mdi-thumb-up' : 'mdi-thumb-down'"></v-icon>
                  </v-list-item-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-card-text>
  <v-divider></v-divider>
  <v-card-actions>
    <v-btn color="primary" @click="nextPhase">Scores</v-btn>
  </v-card-actions>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/store/game'
const game = useGameStore()

function nextPhase() {
  game.updatePoints()
  game.phase = 5
}

onMounted(() =>{
  game.revealResults()
})
</script>

<style>
.round-results .v-expansion-panel-text > div {
  padding: 4px 0 !important;
}

.score {
  margin-bottom: 1em;
}
</style>
