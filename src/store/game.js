import {
  defineStore
} from 'pinia'

import Peer from 'peerjs'
import { markRaw } from 'vue'

export const useGameStore = defineStore('game', {
  state: () => ({
    boss: '',
    promptIdx: 0,
    spreadsheetID: '1a-CQwdJhlCPDl2MVbIpfELS0Phcf7acVFA5-iXXIW1Y',
    answers: {}, // { peerID: true|false }
    guesses: {}, // { peerID: [{ peerID: true|false }]}
    points: {}, // { peerID: 0 }
    dilemmas: [],
    isHost: true,
    peer: null,
    peers: [],
    connections: {},
    username: '',
    usernames: {},
    gameStarted: false,
  }),
  actions: {
    // we keep track of connections ourselves as suggested in peerjs's documentation
    addConnection(conn) {
      this.connections[conn.peer] = conn;
      this.updatepeers();
    },
    removeConnection(conn) {
      delete this.connections[conn.peer];
      this.updatepeers();
    },
    updatepeers() {
      this.peers = Object.keys(this.connections);
    },
    disconnectPeer() {
      this.peer.disconnect();
    },

    // called to properly configure connection's client listeners
    configureConnection(conn) {
      conn.on("data", data => {
        // if data is about connections (the list of peers sent when connected)
        if (data.type === "connections") {
          data.peers.forEach(peerId => {
            if (!this.connections[peerId]) {
              this.initiateConnection(peerId);
            }
          });
        } else {
          console.log(data)
        }
        // please note here that if data.type is undefined, this endpoint won't do anything!
      });
      conn.on("close", () => this.removeConnection(conn));
      conn.on("error", () => this.removeConnection(conn));

      // if the caller joins have a call, we merge calls
      conn.metadata.peers.forEach(peerId => {
        if (!this.connections[peerId]) {
          this.initiateConnection(peerId);
        }
      });
    },
    // called to initiate a connection (by the caller)
    initiateConnection(peerId) {
      if (!this.peers.includes(peerId) && peerId !== this.peer.id) {
        this.loading = true;
        this.peerError = "";

        const options = {
          metadata: {
            // if the caller has peers, we send them to merge calls
            peers: this.peers
          }
        };
        const conn = this.peer.connect(peerId, options);
        this.configureConnection(conn);

        conn.on("open", () => {
          this.addConnection(conn);
          this.loading = false;
        });
      }
    },
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
          this.configureConnection(conn);

          conn.on("open", () => {
            this.addConnection(conn);

            // send every connection previously established to connect everyone (merge chat rooms)
            conn.send({
              type: "connections",
              peers: this.peers
            });
          });
        }
      });
    }
  }
})
