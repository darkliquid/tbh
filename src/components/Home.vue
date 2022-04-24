<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Unofficial, TBH</v-card-title>
          <v-card-text>
            <p>
              <strong>Unofficial, TBH</strong> is a game about discussing absurd dilemmas,
              and then predicting how the other players will react to them.
            </p>

            <p>
              Points are awarded for guessing the other players' responses correctly.
              Game play continues until somebody gets 25 points or you run out of dilemmas.
            </p>

            <p>
              This is an unofficial implementation by <a class="text-primary" href="http://twitter.com/darkliquid">@darkliquid</a>
              of the <a class="text-primary" href="https://buy.cut.com/en-gb/products/tbh-the-game-of-honest-answers-to-outrageous-questions">awesome TBH party game by Cut</a>
              (which you should definitely buy) and comes
              with <strong>no</strong> official dilemmas. Instead, if you are hosting a game,
              provide the ID of a publicly published google spreadsheet full of dilemmas
              to use those for your game. By default, the game will use the dilemmas listed
              <a class="text-primary" href="https://docs.google.com/spreadsheets/d/1a-CQwdJhlCPDl2MVbIpfELS0Phcf7acVFA5-iXXIW1Y/edit#gid=0">here</a>.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/host">Host a game</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" to="/join">Join a game</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>

</script>

<style scoped>
p {
  margin-bottom: 1em;
}
</style>
