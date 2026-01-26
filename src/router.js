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
import TvShowsComponent from "@/components/TvShowsComponent.vue";

const routes = [
    {
        path: "/",
        name: "HomeComponent",
        component: HomeComponent,
        meta:{
            title:"Cine List | Home"
        }
    },
    {
        path: "/movies",
        name: "MoviesComponent",
        component: MoviesComponent,
        meta:{
            title:"Cine List | Movies"
        }
    },
    {
        path: "/tv-shows",
        name: "TVShowsComponent",
        component: TvShowsComponent,
        meta:{
            title:"Cine List | TV Shows"
        }
    },
    {
        path: "/watchlist",
        name: "WatchlistComponent",
        component: WatchlistComponent,
        meta:{
            title:"Cine List | Watch List"
        }
    },
    {
        path: "/login",
        name: "LoginComponent",
        component: LoginComponent,
        meta:{
            title:"Cine List | Login"
        }
    },
    {
        path: "/register",
        name: "RegisterComponent",
        component: RegisterComponent,
        meta:{
            title:"Cine List | Register"
        }
    },
    {
        path: "/contact",
        name: "ContactComponent",
        component: ContactComponent,
        meta:{
            title:"Cine List | Contact"
        }
    },
    {
        path: "/about",
        name: "AboutComponent",
        component: AboutComponent,
        meta:{
            title:"Cine List | About"
        }
    },
    {
        path: "/privacy-policy",
        name: "PrivacyComponent",
        component: PrivacyComponent,
        meta:{
            title:"Cine List | Privacy Policy"
        }
    },
    {
        path: "/terms-and-conditions",
        name: "TermsAndConditionComponent",
        component: TermAndConditionComponent,
        meta:{
            title:"Cine List | Terms And Condition"
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFoundComponent',
        component: NotFoundComponent,
        meta:{
            title:"Cine List | 404 Not Found"
        }
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    next();
})
export default router;