const formGantiNama = document.getElementById("formGantiNama");
const beforeErr = document.getElementById("beforeErr");
const afterErr = document.getElementById("afterErr");

formGantiNama.addEventListener("submit", async function (e) {
  e.preventDefault();

  beforeErr.textContent = "";
  afterErr.textContent = "";

  const usernameBefore = formGantiNama.usernameBefore.value;
  const usernameAfter = formGantiNama.usernameAfter.value;

  const res = await fetch("/changeName", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usernameBefore,
      usernameAfter,
    }),
  });

  if (!res.ok) {
    console.log("Request to server invalid");
  }

  const result = await res.json();
  console.log(result);
  if (result.UsernameNotFound) {
    beforeErr.style.color = "red";
    beforeErr.textContent = result.UsernameNotFound;
  } else if (result.NameInUse) {
    afterErr.style.color = "red";
    afterErr.textContent = result.NameInUse;
  } else if (result.messageErr) {
    alert(result.messageErr);
  } else if (result.ChangedNameSuccess) {
    window.location.href = "/";
  }
});
