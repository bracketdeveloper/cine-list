import axios from "axios";
import bcrypt from "bcryptjs";


export function menuToggleFunction() {
    var toggleOpen = document.getElementById('toggleOpen');
    var toggleClose = document.getElementById('toggleClose');
    var collapseMenu = document.getElementById('collapseMenu');

    function handleClick() {
        if (collapseMenu.style.display === 'block') {
            collapseMenu.style.display = 'none';
        } else {
            collapseMenu.style.display = 'block';
        }
    }

    toggleOpen.addEventListener('click', handleClick);
    toggleClose.addEventListener('click', handleClick);
}

export function checkUserAuth(vm) {
    let user = localStorage.getItem("user-data");
    if (!user) {
        vm.$router.push("/login");
    }
}

function checkEmpty(vm, val, inputName, inputRef) {
    if (val === "") {
        alert("Enter " + inputName)
        vm.$refs[inputRef].focus();
        return false;
    }
    return true;

}

export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function checkUserByExistingEmail(email) {
    var userExists = false

    try {
        const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/users`, {
            params: {email}
        })

        userExists = res.data.length > 0
    } catch (err) {
        if (err.response && err.response.status === 404) {
            userExists = false
        } else {
            throw err
        }
    }
    return userExists
}

export async function getUserByEmail(email) {
    let userExists = false;

    try {
        const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/users`, {
            params: {email}
        })

        userExists = res.data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            userExists = false
        } else {
            throw err
        }
    }
    return userExists
}

export async function register(vm) {
    if (!checkEmpty(vm, vm.name, "Name", 'name')) return
    if (!checkEmpty(vm, vm.email, "Email", 'email')) return
    if (!validateEmail(vm.email)) {
        alert("Enter a valid Email")
        vm.$refs.email.focus()
        return
    }
    if (await checkUserByExistingEmail(vm.email)) {
        alert("Email already exists")
        vm.$refs.email.focus()
        return
    }
    if (!checkEmpty(vm, vm.password, "Password", 'password')) return
    if (vm.password.length < 6) {
        alert("Password must be at least 6 characters long")
        vm.$refs.password.focus()
        return;
    }
    if (!checkEmpty(vm, vm.confirmPassword, "Confirm Password", 'confirm-password')) return
    if (vm.password !== vm.confirmPassword) {
        alert("Passwords do not match")
        vm.$refs['confirm-password'].focus()
        return
    }
    if (!vm.checkBox) {
        alert("Please accept our terms and conditions")
        return;
    }

    const hashedPassword = await hashPassword(vm.password);

    return await axios.post(process.env.VUE_APP_API_BASE_URL + "/users", {
        "name": vm.name,
        "password": hashedPassword,
        "email": vm.email,
    });
}

export async function login(vm) {
    if (!checkEmpty(vm, vm.email, "Email", 'email')) return
    if (!validateEmail(vm.email)) {
        alert("Enter a valid Email")
        vm.$refs.email.focus()
        return
    }
    if (!checkEmpty(vm, vm.password, "Password", 'password')) return
    let user = await getUserByEmail(vm.email);
    if (!user) {
        alert("No user found for this email");
        vm.$refs.email.focus()
        return
    }
    let storedHash = user[0].password;
    let checkPassword = await bcrypt.compare(vm.password, storedHash);
    if (checkPassword) {
        alert("Welcome to Your Account")
        localStorage.setItem("user-data", JSON.stringify(user))
        await vm.$router.push("/")
    } else {
        alert("Invalid Credentials")
        vm.$refs.password.focus()
    }

}

export async function getPopularMovies() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                language: 'en-US',
                page: 1
            },
            headers: {
                accept: 'application/json',
                Authorization: process.env.VUE_APP_TMDB_ACCESS_TOKEN
            }
        });


        if (response.status === 200) {
            return response.data.results;
        } else {
            return null;
        }


    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getUpcomingMovies() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
            params: {
                language: 'en-US',
                page: 1
            },
            headers: {
                accept: 'application/json',
                Authorization: process.env.VUE_APP_TMDB_ACCESS_TOKEN
            }
        });


        if (response.status === 200) {
            return response.data.results;
        } else {
            return null;
        }


    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getTopRatedMovies() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/top_rated', {
            params: {
                language: 'en-US',
                page: 1
            },
            headers: {
                accept: 'application/json',
                Authorization: process.env.VUE_APP_TMDB_ACCESS_TOKEN
            }
        });


        if (response.status === 200) {
            return response.data.results;
        } else {
            return null;
        }


    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getNowPlayingMovies() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            params: {
                language: 'en-US',
                page: 1
            },
            headers: {
                accept: 'application/json',
                Authorization: process.env.VUE_APP_TMDB_ACCESS_TOKEN
            }
        });


        if (response.status === 200) {
            return response.data.results;
        } else {
            return null;
        }


    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getMoviesGenre() {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
                language: 'en-US',
                page: 1
            },
            headers: {
                accept: 'application/json',
                Authorization: process.env.VUE_APP_TMDB_ACCESS_TOKEN
            }
        });
        if (response.status === 200) {
            return response.data.genres;
        } else {
            return [];
        }
    } catch (err) {
        console.error(err);
        return [];
    }
}


