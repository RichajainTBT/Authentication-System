let passwordBtns = document.querySelectorAll(".hideShowPassword");
let registerLink = document.querySelectorAll(".register-link")
let forgotLink = document.querySelectorAll(".forgot-link")
let loginLink = document.querySelectorAll(".login-link")
let loginSec = document.querySelector("#login-sec")
let registerSec = document.querySelector("#register-sec")
let forgotSec = document.querySelector("#forgot-sec");
let regNewPass = document.querySelector("#reg_new_password");
let regCPass = document.querySelector("#reg_confirm_password");
let forgotNewPass = document.querySelector("#for_new_password");
let forgotCPass = document.querySelector("#for_confirm_password");


// section conditionally renderning
registerLink.forEach((register) => {
    register.addEventListener("click", (e) => {
        registerSec.style.display = "block";
        loginSec.style.display = "none";
        forgotSec.style.display = "none";
    })
})
loginLink.forEach((login) => {
    login.addEventListener("click", (e) => {
        registerSec.style.display = "none";
        loginSec.style.display = "block";
        forgotSec.style.display = "none";
    })
})
forgotLink.forEach((forgot) => {
    forgot.addEventListener("click", (e) => {
        registerSec.style.display = "none";
        loginSec.style.display = "none";
        forgotSec.style.display = "block";
    })
})
// section conditionally renderning

// show hide password 
passwordBtns.forEach((passwordBtn) => {
    passwordBtn.addEventListener("click", (e) => {
        let btn = e.target.closest(".hideShowPassword");
        let icon = btn.querySelector("i");
        let input = btn.parentElement.querySelector("input");

        if (input.type == "password") {
            input.type = "text";
            icon.classList.add("bi-eye")
            icon.classList.remove("bi-eye-slash");
            btn.setAttribute("aria-label", "Show password");
        } else {
            input.type = "password";
            icon.classList.add("bi-eye-slash")
            icon.classList.remove("bi-eye")
            btn.setAttribute("aria-label", "Hide password");
        }
    })
})
// show hide password 

// toast
function showToast(bgClass, msg) {
    let toastWrapper = document.querySelector("#toast-container")
    toastWrapper.style.display = "block";
    let toastEl = document.querySelector("#toast");
    toastEl.classList.remove(
        'bg-success', 'bg-danger', 'bg-primary', 'bg-warning', 'bg-info'
    )
    toastEl.classList.add(bgClass, 'text-white');
    toastEl.querySelector(".toast-body").innerHTML = msg
    let toast = new bootstrap.Toast(toastEl);
    toast.show();

    setTimeout(() => {
        toastWrapper.style.display = "none";
    }, 3000)
}
// toast

// form validation
document.addEventListener("input", (e) => {
    let target = e.target;
    if (!target.offsetParent) return;

    if (target.matches('input[type="email"]')) {
        validateEmail(target)
    }
    if (target.matches('input[type="password"]')) {
        validatePassword(target)
    }
})

document.addEventListener("blur", (e) => {
    let target = e.target;
    if (!target.offsetParent) return;

    if (target.matches('input[type="email"]')) {
        validateEmail(target)
    }
    if (target.matches('input[type="password"]')) {
        validatePassword(target)
    }
}, true)

// email validation
function validateEmail(input) {
    let value = input.value.trim();
    let error = input.nextElementSibling;
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (value === "") {
        error.innerText = "Email is required";
        input.style.borderColor = "red";
        return false;
    } else if (!pattern.test(value)) {
        error.innerText = "Invalid email";
        input.style.borderColor = "red"
        return false;
    } else {
        error.innerText = "";
        input.style.borderColor = "#198754"
        return true;
    }
}

// password validation
function validatePassword(input) {
    let value = input.value.trim();
    let error = input.nextElementSibling;

    if (value === "") {
        error.innerText = "password is required";
        input.style.borderColor = "red";
        return false;
    } else if (value.length < 6) {
        error.innerText = "Minimun 6 characters required";
        input.style.borderColor = "red";
        return false;
    } else {
        error.innerText = "";
        input.style.borderColor = "#198754";
        return true;
    }
}

// new and confirm password validation
regCPass.addEventListener("blur", () => {
    checkPassword(regNewPass, regCPass)
})
regCPass.addEventListener("input", () => {
    checkPassword(regNewPass, regCPass)
})
forgotCPass.addEventListener("blur", () => {
    checkPassword(forgotNewPass, forgotCPass)
})
forgotCPass.addEventListener("input", () => {
    checkPassword(forgotNewPass, forgotCPass)
})

function checkPassword(newPass, cofirmPass) {
    let error = cofirmPass.nextElementSibling;

    if (cofirmPass.value.trim() === "") {
        error.innerText = "Confirm password is required";
        cofirmPass.style.borderColor = "red";
        return false;
    }

    if (newPass.value !== cofirmPass.value) {
        newPass.style.borderColor = "red";
        cofirmPass.style.borderColor = "red";
        error.innerText = "New and confirm Password do not match";
        return false;
    } else {
        newPass.style.borderColor = "#198754"
        cofirmPass.style.borderColor = "#198754"
        error.innerText = ""
        return true;
    }

}
// form validation


// user functionality
let registerForm = document.forms['register'];

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    let name = registerForm.name.value.trim();
    let email = registerForm.email.value.trim();
    let password = registerForm.password.value.trim();
    let confirmPassword = registerForm.confirm_password.value.trim();

    isValid = validateEmail(registerForm.email) &&
        validatePassword(registerForm.password) &&
        checkPassword(registerForm.password, registerForm.confirm_password) &&
        name !== ""
        ;
    if (!isValid) return;
    let newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        showToast("bg-danger", "This email is already registered");
        return;
    } else {
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users))
        showToast("bg-success", "User register Successfully");
        registerForm.reset();
        registerSec.style.display = "none";
        loginSec.style.display = "block";
    }
})
// user functionality

// login functionality
let loginForm = document.forms['login'];

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = loginForm.email.value.trim();
    let password = loginForm.password.value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        showToast("bg-danger", "Email not Registered");
        return;
    }
    if (user.password !== password) {
        showToast("bg-danger", "Wrong Password");
        return;
    }
    let currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showToast("bg-success", "Login Successfully");
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 2000)


})

// login functionality

// forgot password functionality
let forgotForm = document.forms['forgot'];
let changePasswordSec = document.querySelector("#update-password");

forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = forgotForm.email.value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (changePasswordSec.style.display === "none" || changePasswordSec.style.display === "") {
        let user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            showToast("bg-danger", "This email not exist");
            return;
        }
        changePasswordSec.style.display = "block";
        forgotForm.email.disabled = true;
        showToast("bg-success", "Email verified. Please enter new password");
        return;
    }

    let password = forgotForm.password.value.trim();
    // let confirm_password = forgotForm.confirm_password.value.trim();

    if (
        !validatePassword(forgotForm.password) ||
        !checkPassword(forgotForm.password, forgotForm.confirm_password)
    ) return;

    let user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
        showToast("bg-danger", "Something went wrong");
        return;
    }
    user.password = password
    localStorage.setItem("users", JSON.stringify(users));
    showToast("bg-success", "Password Updated Successfully");
    forgotForm.reset();
    forgotForm.email.disabled = false;
    changePasswordSec.style.display = "none";
    setTimeout(() => {
        loginSec.style.display = "block";
        forgotSec.style.display = "none";
    }, 1000);

})
// forgot password functionality