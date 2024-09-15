const loginForm = document.getElementById("loginForm");
const emailErr = document.getElementById("emailErr");
const pswdErr = document.getElementById("pswdErr");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  pswdErr.textContent = "";
  emailErr.textContent = "";

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const res = await fetch("/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    console.log("Request gagal");
  }

  const result = await res.json();

  if (result.loginSuccess) {
    // Redirect ke halaman lain atau tampilkan pesan sukses
    window.location.href = "/";
  } else if (result.wrongPswd) {
    // Tampilkan pesan kesalahan password
    pswdErr.style.color = "red";
    pswdErr.textContent = result.wrongPswd;
  } else if (result.usernameNotFound) {
    // Tampilkan pesan username tidak ditemukan
    emailErr.style.color = "red";
    emailErr.textContent = result.usernameNotFound;
  } else if (result.masukanPswd) {
    // Tampilkan pesan password kosong
    pswdErr.style.color = "red";
    pswdErr.textContent = result.masukanPswd;
  } else {
    pswdErr.textContent = "";
    emailErr.textContent = "";
  }
});
