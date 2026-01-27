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

export function checkUserAuth() {
    let user = localStorage.getItem("user-data");
    if (!user) {
        return false;
    }
    return true;
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

export async function getMoviesOrTvShow(link) {
    try {
        const response = await axios.get(link, {
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

export async function getGenre(link) {
    try {
        const response = await axios.get(link, {
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

export async function getMoviesOrTvShowById(imdbId) {
    imdbId = String(imdbId);
    const link = `https://api.themoviedb.org/3/movie/${imdbId}`;
    try {
        const response = await axios.get(link, {
            params: {
                external_source: "imdb_id",
                language: "en-US"
            },
            headers: {
                accept: "application/json",
                Authorization: process.env.VUE_APP_TMDB_ACCESS_TOKEN
            }
        });


        if (response.status === 200) {
            return response.data; // only movie results
        } else {
            return null;
        }


    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getWatchListByUserId(userId) {
    let watchList = null

    try {
        const res = await axios.get(
            `${process.env.VUE_APP_API_BASE_URL}/watch_lists`,
            {
                params: {
                    user_id: userId
                }
            }
        )
        watchList = res.data[0]
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const createRes = await axios.post(
                `${process.env.VUE_APP_API_BASE_URL}/watch_lists`,
                {
                    user_id: userId,
                    movie_id: []
                }
            )

            watchList = createRes.data
        } else {
            throw err
        }
    }
    return watchList;
}

export async function addWatchListByUserId(userId, movieId) {
    const getRes = await axios.get(

        `${process.env.VUE_APP_API_BASE_URL}/watch_lists`,
        {
            params: { user_id: String(userId) }
        }
    )

    const watchList = getRes.data[0]
    const movies = watchList.movie_id || []
    if (movies.includes(movieId)) {
        return
    }
    const updatedMovies = [...movies, movieId]


    await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/watch_lists/${watchList.id}`,
        {
            user_id: watchList.user_id,
            movie_id: updatedMovies,
            createdAt: watchList.createdAt
        }
    )
}
// Vue method
export async function  removeFromWatchList(movieId) {
    alert('Removing movie from watchlist!');
    await removeWatchListByUserId(this.userId, movieId);
    this.watchList = await getWatchListByUserId(this.userId);
    this.watchListMovies = this.watchList.movie_id || [];
}

// API helper
export async function removeWatchListByUserId(userId, movieId) {
    const getRes = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/watch_lists`,
        { params: { user_id: String(userId) } }
    );

    const watchList = getRes.data[0];
    const movies = watchList.movie_id || [];

    // Remove movieId if it exists
    const updatedMovies = movies.filter(id => id !== movieId);

    await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/watch_lists/${watchList.id}`,
        {
            user_id: watchList.user_id,
            movie_id: updatedMovies,
            createdAt: watchList.createdAt
        }
    );
}



