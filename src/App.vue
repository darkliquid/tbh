<template>
  <v-theme-provider :theme="darkMode ? 'dark' : 'light'">
    <v-app full-height>
      <v-app-bar app>
        <v-app-bar-title><router-link to="/" class="app-title">Unofficial, TBH</router-link></v-app-bar-title>
        <v-spacer></v-spacer>
        <v-switch
          v-model="darkMode"
          color="primary"
          hide-details
          density="compact"
          class="dark-mode-switch"
          :prepend-icon="darkMode ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
        ></v-switch>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
      <v-snackbar
        v-model="hasLeavers"
      >
        {{ game.left.join(', ') }} left the game

        <template v-slot:actions>
          <v-btn
            color="pink"
            variant="text"
            @click="game.left = []"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </v-theme-provider>
</template>

<script setup>
import { inject, ref, computed } from 'vue'
import { useGameStore } from './store/game'
const game = useGameStore()
const hasLeavers = computed(() => game.left.length > 0)
const initialDarkMode = inject('mq')
const darkMode = ref(initialDarkMode.isDark)
</script>

<style>
body {
  background-color:#efb71a;
  background-image: linear-gradient(30deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(150deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(30deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(150deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(60deg, #d75c9d 25%, transparent 25.5%, transparent 75%, #d75c9d 75%, #d75c9d),
  linear-gradient(60deg, #d75c9d 25%, transparent 25.5%, transparent 75%, #d75c9d 75%, #d75c9d);
  background-size:80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
  background-repeat: repeat;
}

#app .v-application {
  background: transparent;
}

#app .v-btn--disabled.v-btn--disabled {
  color: rgba(var(--v-theme-on-surface), 0.26) !important;
}

#app .dark-mode-switch {
  flex: 0 1 auto;
}

#app .dark-mode-switch .mdi-weather-night {
  color: rgb(var(--v-theme-primary));
}

#app .dark-mode-switch .mdi-white-balance-sunny {
  color: rgb(var(--v-theme-warning));
}

#app .app-title {
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
