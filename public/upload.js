// const { json } = require("body-parser");

const fileimg = document.getElementById("fileimg");
const preview = document.getElementById("preview");
fileimg.onchange = () => {
  const [file] = fileimg.files;
  if (file) {
    preview.src = URL.createObjectURL(file);
  }
};

const formUpload = document.getElementById("formUpload");
formUpload.addEventListener("submit", async function (e) {
  e.preventDefault();

  const fileimg = document.getElementById("fileimg");
  const nameimg = document.getElementById("nameimg");
  const file = fileimg.files[0];
  const name = nameimg.value;

  const formData = new FormData();
  formData.append("fileimg", file);
  formData.append("nameimg", name);

  try {
    const res = await fetch("/upload", {
      method: "post",
      body: formData,
    });

    if (!res.ok) {
      console.log("invalid request");
    }

    const result = await res.json();

    if (result.success) {
      window.location.href = "/";
    }
  } catch (err) {
    console.log(err);
  }
});
