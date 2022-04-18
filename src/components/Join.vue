<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Join a Game</v-card-title>
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
                :rules="[v => !!v || 'Player name is required']"
              ></v-text-field>
              <v-text-field
                label="Join Code"
                placeholder="fb4ab9dc-fdee-4a99-94f2-bef76b1078a2"
                variant="outlined"
                v-model="joinCode"
                :disabled="game.peers.length > 0"
                required
                :rules="[v => !!v || 'Join code is required']"
              ></v-text-field>
              <v-list v-if="game.peers.length > 0">
                <v-list-item>
                  Waiting for game to start
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
            <v-btn color="primary" @click="joinGame" :disabled="!valid || game.peers.length > 0">Join Game</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useGameStore } from '@/store/game'
import { ref, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
const game = useGameStore()
const joinCode = ref()
const route = useRoute()
const router = useRouter()
const valid = ref(false)
const form = ref(null)

const joinGame = () => {

  game.connect(joinCode.value)
}

onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  if (to.params.id !== from.params.id) {
    joinCode.value = to.params.id
  }
})

function updateName() {
  if (form.value) {
    form.value.validate()
  }
  if (game.username) {
    game.updateName()
  }
}

function isGameStarted() {
  return game.gameStarted
}

watch(isGameStarted, async (newstate, oldstate) => {
  if (newstate) {
    router.push(`/game/${joinCode.value}`)
  }
})

onMounted(() => {
  game.createPeer()
  if (route.params.id) {
    joinCode.value = route.params.id
  }
})


</script>
