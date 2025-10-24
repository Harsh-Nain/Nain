let inputs = document.querySelectorAll(".signup-inputs");
let create = document.getElementById("create");
let fullname = document.getElementById("fullname");
let email = document.getElementById("email");
let img = document.getElementById("img");
let image = document.getElementById("image");
let number = document.getElementById("number");
let appname = document.getElementById("appname");
let password = document.getElementById("password");
let cpassword = document.getElementById("cpassword");
let overlay = document.getElementById("overlay");

let file
img.addEventListener('change', (e) => {
    file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        image.src = url;
    }
});

create.addEventListener("click", async () => {
    console.log(img.value);

    for (const input of inputs) {
        input.classList.remove("border-red-500", "worngAnimation");
        if (input.value.trim() == "") {
            input.classList.add("border-red-500", "worngAnimation");
            return;
        }
    }

    const emailValue = email.value.trim();
    if (!emailValue.includes("@") || !/\.[a-z]{2,}$/.test(emailValue)) {
        email.classList.add("border-red-500", "worngAnimation");
        return;
    }

    if (number.value.trim().length !== 10) {
        number.classList.add("border-red-500", "worngAnimation");
        return;
    }

    if (password.value.trim() !== cpassword.value.trim()) {
        password.classList.add("border-red-500", "worngAnimation");
        cpassword.classList.add("border-red-500", "worngAnimation");
        return;
    }

    overlay.classList.remove("hidden");
    overlay.classList.add("flex");

    const dta = new FormData();
    dta.append("image", file);
    dta.append("fullname", fullname.value);
    dta.append("email", emailValue);
    dta.append("number", number.value);
    dta.append("password", password.value);
    dta.append("appname", appname.value);

    const response = await fetch("/Auth/signup", {
        method: "POST",
        body: dta,
    });

    const data = await response.json();

    overlay.classList.add("hidden");
    overlay.classList.remove("flex");

    if (data.success) {
        window.location.href = data.redirect;
    } else {
        alert(data.message || "Something went wrong.");
    }
});