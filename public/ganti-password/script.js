const formGantiPassword = document.getElementById("formGantiPassword");
const beforeErr = document.getElementById("beforeErr");
const afterErr = document.getElementById("afterErr");

formGantiPassword.addEventListener("submit", async function (e) {
  e.preventDefault();

  beforeErr.textContent = "";
  afterErr.textContent = "";

  const passwordBefore = formGantiPassword.passwordBefore.value;
  const passwordAfter = formGantiPassword.passwordAfter.value;

  const res = await fetch("/changePassword", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      passwordBefore,
      passwordAfter,
    }),
  });

  if (!res.ok) {
    console.log("Request to server invalid");
  }

  const result = await res.json();
  console.log(result);
  if (result.passwordNotFound) {
    beforeErr.style.color = "red";
    beforeErr.textContent = result.passwordNotFound;
  } else if (result.passwordKurang) {
    afterErr.style.color = "red";
    afterErr.textContent = result.passwordKurang;
  } else if (result.messageErr) {
    alert(result.messageErr);
  } else if (result.ChangedPasswordSuccess) {
    window.location.href = "/";
  }
});
