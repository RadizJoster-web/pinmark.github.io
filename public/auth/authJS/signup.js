const signupForm = document.getElementById("signupForm");
const emailErr = document.getElementById("emailErr");
const pswdErr = document.getElementById("pswdErr");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  emailErr.textContent = "";
  pswdErr.textContent = "";

  const name = signupForm.username.value;
  const password = signupForm.password.value;

  const res = await fetch("/signup", {
    method: "post",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify({ name, password }),
  });

  if (!res.ok) {
    console.log("Gagal request http");
  }

  const result = await res.json();

  if (result.duplikat) {
    emailErr.style.color = "red";
    emailErr.textContent = result.duplikat;
  } else if (result.pswInvalid) {
    pswdErr.style.color = "red";
    pswdErr.textContent = result.pswInvalid;
  } else if (result.success) {
    window.location.href = "/";
  }
});
