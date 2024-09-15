const fileimg = document.getElementById("fileimg");
const preview = document.getElementById("preview");

fileimg.onchange = () => {
  const [file] = fileimg.files;
  if (file) {
    preview.classList.add("active");
    preview.src = URL.createObjectURL(file);
  }
};

const formFotoProfile = document.getElementById("formFotoProfile");
formFotoProfile.addEventListener("submit", async function (e) {
  e.preventDefault();

  const file = fileimg.files[0];
  console.log(file);

  const formData = new FormData();
  formData.append("profile", file);

  try {
    const res = await fetch("/uploadsPP", {
      method: "post",
      body: formData,
    });

    if (!res.ok) {
      console.log("Request gagal");
    }

    const result = await res.json();
    console.log(result);
    if (result.success) {
      window.location.href = "/";
    }
  } catch (err) {
    console.log(err);
  }
});
