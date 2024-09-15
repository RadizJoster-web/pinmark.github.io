// const { compareSync } = require("bcrypt");
// const path = require("path");
// const { json } = require("body-parser");

const gallery = document.querySelector(".gallery");
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/gallery"); // Pastikan endpoint ini mengembalikan JSON yang benar
    if (!res.ok) {
      console.error("Gagal ambil image");
      return;
    }
    const result = await res.json();

    if (result && result.length > 0) {
      const columns = document.querySelectorAll(".column");

      // Pastikan setiap kolom memiliki setidaknya satu gambar
      let imgIndex = 0;
      columns.forEach((column) => {
        if (imgIndex < result.length) {
          const img = document.createElement("img");
          const p = document.createElement("p");
          img.src = result[imgIndex].path;
          p.textContent = result[imgIndex].name;
          column.appendChild(img);
          column.appendChild(p);

          imgIndex++;
        }
      });

      // Distribusikan sisa gambar
      let columnIndex = 0;
      while (imgIndex < result.length) {
        const imgElement = document.createElement("img");
        const pElement = document.createElement("p");
        imgElement.src = result[imgIndex].path;
        pElement.textContent = result[imgIndex].name;

        columns[columnIndex].appendChild(imgElement);
        columns[columnIndex].appendChild(pElement);

        imgIndex++;
        columnIndex = (columnIndex + 1) % columns.length; // Ulangi dari kolom pertama jika sudah mencapai kolom terakhir
      }

      const images = gallery.querySelectorAll("img");
      const zoomImg = document.getElementById("zoomImg");

      images.forEach((image) => {
        image.addEventListener("click", async function () {
          const pathImg = image.src;
          const fixPath = pathImg.replace(window.location.origin, "");

          const res = await fetch("/showimg", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fixPath }),
          });

          if (!res.ok) {
            console.log("Request gagal");
            return;
          }

          const result = await res.json();

          if (result.login) {
            window.location.href = "login";
            return false;
          }

          zoomImg.innerHTML = "";
          zoomImg.classList.add("active");

          const container = document.createElement("div");

          const img = document.createElement("img");
          img.src = pathImg;
          img.alt = "";

          const innerDiv = document.createElement("div");
          innerDiv.classList.add("innerDiv");

          const header = document.createElement("header");

          const span = document.createElement("span");

          if (result.profileUser.length > 0) {
            const imgProfile = document.createElement("img");
            imgProfile.src = result.profileUser;
            span.appendChild(imgProfile);
          } else {
            const iconPerson = document.createElement("i");
            iconPerson.classList.add("bi", "bi-person-circle");
            span.appendChild(iconPerson);
          }

          const h1 = document.createElement("a");
          h1.href = `/profile/${result.username}`;
          h1.textContent = result.username;

          const closeIcon = document.createElement("i");
          closeIcon.classList.add("bi", "bi-x");
          closeIcon.id = "closeButton";
          closeIcon.addEventListener("click", function () {
            zoomImg.classList.remove("active");
          });

          const p = document.createElement("p");
          p.textContent = result.titleImage;

          const ul = document.createElement("ul");

          const li1 = document.createElement("li");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "saveImage";
          checkbox.id = "saveImageCheckbox";
          checkbox.style.display = "none";

          const label = document.createElement("label");
          label.setAttribute("for", "saveImageCheckbox");

          const iconBookmark = document.createElement("i");

          async function updateBookmarkIcon() {
            iconBookmark.className = ""; // Reset kelas ikon
            if (checkbox.checked === false) {
              iconBookmark.classList.add("bi", "bi-bookmark");
              const path = image.src;
              const fixPath = path.replace(window.location.origin, "");

              const res = await fetch("/deleteMark", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fixPath }),
              });
            } else {
              iconBookmark.classList.add("bi", "bi-bookmark-fill");
              const path = image.src;
              const fixPath = path.replace(window.location.origin, "");

              const res = await fetch("/sendMark", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fixPath }),
              });
            }
          }
          checkbox.addEventListener("change", updateBookmarkIcon);
          updateBookmarkIcon();

          label.appendChild(iconBookmark);
          li1.appendChild(checkbox);
          li1.appendChild(label);

          const getNameImg = fixPath.replace("/uploads/", "");
          const li3 = document.createElement("li");
          const a3 = document.createElement("a");
          a3.setAttribute = "download";
          a3.download = getNameImg;
          a3.href = pathImg;
          const iconDownload = document.createElement("i");
          iconDownload.classList.add("bi", "bi-download");
          a3.appendChild(iconDownload);
          li3.appendChild(a3);

          // Susun elemen

          span.appendChild(h1);
          header.appendChild(span);
          header.appendChild(closeIcon);

          ul.appendChild(li1);
          ul.appendChild(li3);

          innerDiv.appendChild(header);
          innerDiv.appendChild(p);
          innerDiv.appendChild(ul);

          container.appendChild(img);
          container.appendChild(innerDiv);

          // Menambahkan ke dalam zoomImg
          zoomImg.appendChild(container);
        });
      });
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
});

const btnAcount = document.getElementById("acount");
btnAcount.addEventListener("click", function () {
  const formAcount = document.getElementById("formAcount");
  formAcount.classList.toggle("active");
});
