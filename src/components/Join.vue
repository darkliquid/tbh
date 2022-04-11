<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Join a Game</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Player Name"
                placeholder="Gamer McGameface"
                variant="outlined"
                v-model="game.username"
              ></v-text-field>
              <v-text-field
                label="Join Code"
                placeholder="fb4ab9dc-fdee-4a99-94f2-bef76b1078a2"
                variant="outlined"
                v-model="joinCode"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="joinGame">Join Game</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useGameStore } from '@/store/game'
import { ref, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
const game = useGameStore()
const joinCode = ref()
const route = useRoute()

const joinGame = () => {
  console.log(`Joining game ${joinCode.value}`)
  game.initiateConnection(joinCode.value)
}

onBeforeRouteUpdate(async (to, from) => {
  // only fetch the user if the id changed as maybe only the query or the hash changed
  if (to.params.id !== from.params.id) {
    joinCode.value = to.params.id
  }
})

onMounted(() => {
  game.createPeer()
  if (route.params.id) {
    joinCode.value = route.params.id
  }
})
</script>
