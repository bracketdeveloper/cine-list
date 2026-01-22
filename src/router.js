import {createWebHistory, createRouter} from "vue-router";
import HomeComponent from "./components/HomeComponent.vue"
import MoviesComponent from "./components/MoviesComponent.vue"
import WatchlistComponent from "./components/WatchlistComponent.vue"
import LoginComponent from "./components/LoginComponent.vue"
import RegisterComponent from "./components/RegisterComponent.vue"
import NotFoundComponent from "./components/NotFoundComponent.vue"
import ContactComponent from "@/components/ContactComponent.vue";
import AboutComponent from "@/components/AboutComponent.vue";
import TermAndConditionComponent from "@/components/TermAndConditionComponent.vue";
import PrivacyComponent from "@/components/PrivacyComponent.vue";

const routes = [
    {
        path: "/",
        name: "HomeComponent",
        component: HomeComponent,
    },
    {
        path: "/movies",
        name: "MoviesComponent",
        component: MoviesComponent,
    },
    {
        path: "/watchlist",
        name: "WatchlistComponent",
        component: WatchlistComponent,
    },
    {
        path: "/login",
        name: "LoginComponent",
        component: LoginComponent,
    },
    {
        path: "/register",
        name: "RegisterComponent",
        component: RegisterComponent,
    },
    {
        path: "/contact",
        name: "ContactComponent",
        component: ContactComponent,
    },
    {
        path: "/about",
        name: "AboutComponent",
        component: AboutComponent,
    },
    {
        path: "/privacy-policy",
        name: "PrivacyComponent",
        component: PrivacyComponent,
    },
    {
        path: "/terms-and-conditions",
        name: "TermsAndConditionComponent",
        component: TermAndConditionComponent
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFoundComponent',
        component: NotFoundComponent
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router;