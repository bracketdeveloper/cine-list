import axios from "axios";
import bcrypt from "bcryptjs";

const mockApi = process.env.VUE_APP_API_BASE_URL

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
        const res = await axios.get(`${mockApi}/users`, {
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
        const res = await axios.get(`${mockApi}/users`, {
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
    if(await checkUserByExistingEmail(vm.email)){
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

    return await axios.post(mockApi + "/users", {
        "name": vm.name,
        "password": hashedPassword,
        "email": vm.email,
    });
}
export async function login(vm) {
    if (!checkEmpty(vm, vm.email, "Email", 'email')) return
    if(!validateEmail(vm.email)) {
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
