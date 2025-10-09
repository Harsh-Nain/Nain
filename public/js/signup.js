let inputs = document.querySelectorAll(".signup-inputs")
let create = document.getElementById("create")
let fullname = document.getElementById("fullname")
let email = document.getElementById("email")
let number = document.getElementById("number")
let appname = document.getElementById("appname")
let password = document.getElementById("password")
let cpassword = document.getElementById("cpassword")
let overlay=document.getElementById("overlay")
let otp;
create.addEventListener("click", async() => {
    for (const input of inputs) {
        input.classList.remove("border-red-500", "worngAnimation")
        if (input.value.trim() == "") {
            input.classList.add("border-red-500", "worngAnimation")
            return
        }
    }
    const emailValue = email.value.trim();
    // Basic email validation
    if (!emailValue.includes("@") ||emailValue.split("@").length !== 2 ||!/\.[a-z]{2,}$/.test(emailValue)) {
        email.classList.add("border-red-500", "worngAnimation");
        return;
    }

    const numberValue=number.value
 
    if(String(numberValue).length != 10){
        
        number.classList.add("border-red-500", "worngAnimation");
        return;
    }

    const passwordValue=password.value.trim()
    const cpasswordValue=cpassword.value.trim()

    if(passwordValue!==cpasswordValue){
        password.classList.add("border-red-500", "worngAnimation");
        cpassword.classList.add("border-red-500", "worngAnimation");
        return;
    }
overlay.classList.remove("hidden")
overlay.classList.add("flex")
    let response=await fetch("/signup",{
        method:"POST",
        headers:{
            "Content-type":"application/json",
        },
        body:JSON.stringify({fullname:fullname.value,passwordValue,emailValue,appname:appname.value,numberValue})
    })
    let apidata=await response.json()
    otp=apidata.otp
    console.log(otp)
    inputs.forEach(input=>input.value='')
    overlay.classList.add("hidden")
    overlay.classList.remove("flex")



})
