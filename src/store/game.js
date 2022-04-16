import {
  defineStore
} from 'pinia'

import Peer from 'peerjs'
import { markRaw } from 'vue'
import { Random, MersenneTwister19937, createEntropy } from 'random-js'

export const useGameStore = defineStore('game', {
  state: () => ({
    bossIdx: 0, // index in the players array of the boss
    spreadsheetID: '1a-CQwdJhlCPDl2MVbIpfELS0Phcf7acVFA5-iXXIW1Y',
    answers: {}, // { peerID: true|false }
    guesses: {}, // { peerID: [{ peerID: true|false }]}
    points: {}, // { peerID: 0 }
    dilemma: null, // { prompt: '', question:'' }
    dilemmas: [], // [{ prompt: '', question:'' }]
    isHost: true, // whether or not the user is the host
    peer: null, // the peer object used for webrtc connections
    peerID: '', // the peerID of the user
    peers: [], // the peerids of all other connected users
    connections: {}, // webrtc connections { peerID: connection }
    username: '', // current username
    usernames: {}, // usernames for each peerid
    gameStarted: false, // whether or not the game has started
    seed: [], // the seed used for the random number generator
    players: [], // the players in the game, in play order
    phase: 0, // the current phase of the game
  }),
  getters: {
    isBoss() {
      return this.peerID === this.players[this.bossIdx]
    },
    boss() {
      return this.usernames[this.players[this.bossIdx]] || 'boss'
    }
  },
  actions: {
    // Commands
    updateName() {
      Object.values(this.connections).forEach(conn => {
        this._updateName(conn)
      })
    },

    updateChoice(choiceIdx) {
      this.dilemma = this.dilemmas[choiceIdx]
      // remove the chosen item and move the remaining items to the end
      this.dilemmas = this.dilemmas.filter((_, i) => i !== choiceIdx)
      this.dilemmas.push(this.dilemmas.shift())

      // Inform peers of the choice
      Object.values(this.connections).forEach(conn => {
        this._updateChoice(conn, choiceIdx)
      })

      this.phase = 2
    },

    startGame() {
      this.players = [this.peerID, ...this.peers]
      Object.values(this.connections).forEach(conn => {
        this._startGame(conn)
      })
    },

    loadDilemmas() {
      return fetch(`https://opensheet.elk.sh/${this.spreadsheetID}/1`)
      .then((res) => res.json())
      .then((data) => {
        this.dilemmas = data
        this.seed = createEntropy()
        new Random(MersenneTwister19937.seedWithArray(this.seed)).shuffle(this.dilemmas)
      })
    },

    // connect to another peer
    connect(peerId) {
      if (!this.peers.includes(peerId) && peerId !== this.peerID) {
        this.loading = true;
        this.peerError = "";

        const options = {
          metadata: {
            // if the caller has peers, we send them to merge calls
            peers: this.peers,
            username: this.username
          }
        };
        const conn = this.peer.connect(peerId, options);
        this._configureConnection(conn);

        conn.on("open", () => {
          this._addConnection(conn);
          this.loading = false;
          this._updateName(conn)
        });
      }
    },

    // create our peerjs instance
    createPeer() {
      if (this.peer) {
        return this.peer;
      }
      this.peer = markRaw(new Peer());

      // when peer is connected to signaling server
      this.peer.on("open", (id) => {
        this.loading = false;
        this.peerError = "";
        this.peerID = id;
      });
      // error listener
      this.peer.on("error", error => {
        if (error.type === "peer-unavailable") { // if connection with new peer can't be established
          this.loading = false;
          this.peerError = 'peer unreachable!'; // custom error message
        } else this.peerError = error; // default error message
      });

      // when peer receives a connection
      this.peer.on('connection', conn => {
        if (!this.peers.includes(conn.peer)) {
          this._configureConnection(conn);

          conn.on("open", () => {
            this._addConnection(conn);

            // send every connection previously established to connect everyone (merge chat rooms)
            conn.send({
              type: "connections",
              peers: this.peers,
              username: this.username
            });
          });
        }
      });
    },

    // ----- Internal connection methods -----

    // handle commands coming over the data connection
    _handleData(peerId, data) {
      console.log(peerId)
      console.log(data)

      switch (data.type) {
        case "connections":
          this.usernames[peerId] = data.username;
          data.peers.forEach(peerId => {
            if (!this.connections[peerId]) {
              this.connect(peerId);
            }
          });
          break;

        case "updateName":
          this.usernames[peerId] = data.username;
          break;

        case "updateChoice":
          this.dilemma = this.dilemmas[data.choiceIdx]
          // remove the chosen item and move the remaining items to the end
          this.dilemmas = this.dilemmas.filter((_, i) => i !== data.choiceIdx)
          this.dilemmas.push(this.dilemmas.shift())
          this.phase = 2
          break;

        case "startGame":
          this.seed = data.seed;
          this.spreadsheetID = data.spreadsheetID;
          this.players = data.players;
          this.loadDilemmas().then(() => {
            this.phase = 1
            this.gameStarted = true;
          })
          break;

        default:
          console.log(data)
          break;
      }
    },

    _updateName(conn) {
      conn.send({
        type: 'updateName',
        username: this.username
      })
    },

    _updateChoice(conn, choiceIdx) {
      conn.send({
        type: 'updateChoice',
        choiceIdx: choiceIdx
      })
    },

    _startGame(conn) {
      conn.send({
        type: 'startGame',
        seed: this.seed,
        spreadsheetID: this.spreadsheetID,
        players: this.players
      })
    },

    // we keep track of connections ourselves as suggested in peerjs's documentation
    _addConnection(conn) {
      this.connections[conn.peer] = conn;
      this._updatepeers();
    },
    _removeConnection(conn) {
      delete this.connections[conn.peer];
      this._updatepeers();
    },
    _updatepeers() {
      this.peers = Object.keys(this.connections);
    },
    _disconnectPeer() {
      this.peer.disconnect();
    },

    // called to properly configure connection's client listeners
    _configureConnection(conn) {
      conn.on("data", data => {
        this._handleData(conn.peer, data)
      });
      conn.on("close", () => this._removeConnection(conn));
      conn.on("error", () => this._removeConnection(conn));

      // if the caller joins have a call, we merge calls
      conn.metadata.peers.forEach(peerId => {
        if (!this.connections[peerId]) {
          this.connect(peerId);
        }
      });
    },
  }
})
