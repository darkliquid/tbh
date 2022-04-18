<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            {{ game.username }}
            <v-spacer></v-spacer>
            <v-avatar
              color="primary"
              size="24"
              v-text="game.points[game.peerID] || 0"
            ></v-avatar>
          </v-card-title>
          <v-window v-model="game.phase">
            <v-window-item :value="1">
              <phase-one></phase-one>
            </v-window-item>
            <v-window-item :value="2">
              <phase-two></phase-two>
            </v-window-item>
            <v-window-item :value="3">
              <phase-three></phase-three>
            </v-window-item>
            <v-window-item :value="4">
              <phase-four></phase-four>
            </v-window-item>
            <v-window-item :value="5">
              <phase-five></phase-five>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/*

  This is the game component. It is responsible for the game logic.
  It is also responsible for the game UI.

  On startup, the game will:
   * lock in the players and mark the game as started
   * shuffle the players randomly and then distribute the list to all connections
   * pick the first player in the list as the dilemma boss
   * put game into Phase 1

  Phase 1: choosing a dilemma
   * the boss will pick the next two dilemmas from the dilemma list.
   * the non-bosses will see a waiting for boss message
   * the boss selects one of the two dilemmas. the selected dilemma is sent to all players and triggers
     phase 2. the unchosen dilemma is moved to the end of the dilemma list.

  Phase 2: discussing a dilemma
   * all players (including boss) see the dilemma
   * all players (including boss) can choose their answer to the dilemma (yes/no)
   * when all players (including boss) have chosen, phase 3 starts.

  Phase 3: guessing choices
   * each player can place a yes guess or a no guess on another player. the guess is sent as a message
     to the other player and if that player has already received too many guesses, the guess is rejected.
     when a guess is received successfully, a message is sent back to the sender to confirm the guess.
   * when all guesses have been made, phase 4 starts.

  Phase 4: revealing the results
   * all players reveal their choices and the guesses made against them
   * players take turns discussing why they made the choice and why they guessed
     what their choice would be
   * when all players have finished discussing, the points are calculated and awarded
     to players based on their guesses

  Phase 5: round summary
   * show players points in descending order
   * if a player has greater than the winning number of points, they win and game ends.
   * otherwise the next boss is chosen and the game resets to phase 1.

*/

import PhaseOne from './phases/PhaseOne.vue'
import PhaseTwo from './phases/PhaseTwo.vue'
import PhaseThree from './phases/PhaseThree.vue'
import PhaseFour from './phases/PhaseFour.vue'
import PhaseFive from './phases/PhaseFive.vue'

import { useGameStore } from '@/store/game'
const game = useGameStore()

</script>
