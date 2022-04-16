<template>
  <template v-if="!game.isBoss">
    <v-card-text>
      <v-container class="justify-center">
        <v-row>
          <v-col>
            <p class="text-center"><strong>
              Waiting for {{ game.boss }} to choose a dilemma...
            </strong></p>
          </v-col>
        </v-row>
        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-progress-circular
              :size="70"
              :width="7"
              color="purple"
              indeterminate
            ></v-progress-circular>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </v-card-text>
  </template>
  <template v-else>
    <v-card-text>
      <p class="text-center">You are the dilemma boss. <strong>Choose your dilemma.</strong></p>
      <v-list>
        <v-radio-group v-model="choice">
          <v-list-item v-for="(item, idx) in choices" :key="item" class="dilemma">
            <v-list-item-avatar start>
              <v-radio
                :value="idx"
                hide-details
              ></v-radio>
            </v-list-item-avatar>

            <div>
              <p class="prompt">{{ item.prompt }}</p>
              <p class="question">{{ item.question }}</p>
            </div>
          </v-list-item>
        </v-radio-group>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="primary" @click="startRound">Start Round</v-btn>
    </v-card-actions>
  </template>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/store/game'
const game = useGameStore()

const choices = game.dilemmas.slice(0, 2)
const choice = ref(0)

function startRound() {
  game.updateChoice(choice.value)
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

.dilemma:first-child {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.dilemma {
  padding: 2em 0 !important;
}
</style>
