# TBH

An implementation of the TBH card game using WebRTC and googlesheets.

## How the game works

 1. One player becomes the Dilemma Boss
 2. Dilemma boss chooses draws two prompts and discards one.
 3. Players discuss the dilemma, the Boss answers clarifying question
    however they want.
 4. All players select their own answers to the dilemma (yes/no)
 5. Each player has 4 guesses, 2 yes, 2 no. They play them on other
    players answers (up to 4 guesses played on each player).
 6. Answers and guesses are revealed, everyone who matched a guess to a
    players answer gets points equal to 5 - the number of total guesses
    played made for that players answer.

## Data ownership

Each player owns the following state:

 * who made guesses against their answer (but not what the guesses were)
 * their answers
 * their username
 * what guesses they have made against other answers

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
