<template>
  <v-app full-height>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>

</script>

<style>
html, body, #app, #app .v-application {
  height: 100%;
}

#app .v-application {
  background-color:#efb71a;
  background-image: linear-gradient(30deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(150deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(30deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(150deg, #019fc7 12%, transparent 12.5%, transparent 87%, #019fc7 87.5%, #019fc7),
  linear-gradient(60deg, #d75c9d 25%, transparent 25.5%, transparent 75%, #d75c9d 75%, #d75c9d),
  linear-gradient(60deg, #d75c9d 25%, transparent 25.5%, transparent 75%, #d75c9d 75%, #d75c9d);
  background-size:80px 140px;
  background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
}

#app .v-btn--disabled.v-btn--disabled {
  color: rgba(var(--v-theme-on-surface), 0.26) !important;
}
</style>
