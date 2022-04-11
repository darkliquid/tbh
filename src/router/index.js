import {
    createRouter,
    createWebHistory
} from 'vue-router'

const Home = () => import('../components/Home.vue')
const Host = () => import('../components/Host.vue')
const Join = () => import('../components/Join.vue')
const Game = () => import('../components/Game.vue')

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/host',
        component: Host
    },
    {
        path: '/join/:id?',
        component: Join
    },
    {
        path: '/game/:id',
        component: Game
    }
]

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})
