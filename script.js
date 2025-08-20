document.getElementById("togglePassword").addEventListener("click", function () {
    const pwd = document.getElementById("password");
    if (pwd.type === "password") {
        pwd.type = "text";
        this.textContent = "🙈";
    } else {
        pwd.type = "password";
        this.textContent = "👁️";
    }
});

document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Đăng nhập thành công! (Sau này sẽ vào hộp quà 🎁)");
});