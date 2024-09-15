const express = require("express");
const multer = require("multer");
const path = require("path"); // Tambahkan ini untuk menggunakan modul 'path'
const jwt = require("jsonwebtoken");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const saltRounds = 10;

const {
  borkmark,
  myGallery,
  sendProfile,
  getDataImg,
  passwordChanged,
  nameChanged,
  getIdByName,
  getDataById,
  cekPassword,
  sendFile,
  getAllImg,
  sendAccount,
  cekLastId,
  cekDuplikat,
  getImgById,
  sendBorkmark,
  deleteMark,
  deleteImg,
} = require("./database/mysql");
const { captureRejectionSymbol } = require("events");
// const { decode } = require("punycode");
// const { kMaxLength } = require("buffer");
// const { addAbortListener } = require("events");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

app.set("view engine", "ejs");

// Bikin token JWT untuk client
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secret", {
    expiresIn: maxAge,
  });
};

// Cek user sudah login belum
const cekUser1 = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    next();
  }

  jwt.verify(token, "secret", async (err, decodedToken) => {
    if (err) {
      res.locals.user = null;
    } else {
      const user = await getDataById(decodedToken.id);
      res.locals.user = user;
      next();
    }
  });
};

const cekUser2 = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.json({ login: "login" });
  }

  jwt.verify(token, "secret", async (err, decodedToken) => {
    if (err) {
      res.locals.user = null;
    } else {
      const user = await getDataById(decodedToken.id);
      res.locals.user = user;
      next();
    }
  });
};

const cekUser3 = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.redirect("/login");
  }

  jwt.verify(token, "secret", async (err, decodedToken) => {
    if (err) {
      res.locals.user = null;
    } else {
      const user = await getDataById(decodedToken.id);
      res.locals.user = user;
      next();
    }
  });
};

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/"); // Direktori tujuan untuk menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan file dengan nama unik
  },
});

const profile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/profile/"); // Direktori tujuan untuk menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan file dengan nama unik
  },
});

// Menggunakan konfigurasi penyimpanan di multer
const upload = multer({ storage: storage });
const uploadProfile = multer({ storage: profile }).single("profile"); // Sama, ganti 'fileimg' sesuai dengan field input file form

app.get("/", cekUser1, async (req, res) => {
  try {
    res.render("index", {
      style: "style.css",
      script: "index.js",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ----------------------------
// Form Profile User
// ----------------------------
app.get("/profile/:username", cekUser3, async (req, res) => {
  // Ambil parameter username
  const user = req.params.username;
  // ambil id user tersebut
  const idUser = await getIdByName(user);
  // ambil semua data username & foto profile dengan id
  const getDataUser = await getDataById(idUser[0].id);

  res.render("profile-user/index", {
    style: "/profile_user/style.css",
    script: "/profile_user/script.js",
    User: getDataUser,
  });
});

// ----------------------------
//  foto profile
// ----------------------------
app.get("/gantiFotoProfile", (req, res) => {
  res.render("foto-profile/index", {
    style: "foto_profile/style.css",
    script: "foto_profile/script.js",
  });
});

app.post("/uploadsPP", uploadProfile, async (req, res) => {
  const token = req.cookies.jwt;
  const { id } = jwt.decode(token);
  const file = req.file;
  const filePath = file.path;

  try {
    await sendProfile(filePath, id);
    const cekPathImg = await getDataById(id);

    const getPath = cekPathImg[0].profile;

    res.locals.user = getPath; // kirim profile baru
    res.status(200).json({ success: "Foto profile berhasil dihapus" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Query gagal");
  }
});

// ----------------------------
// Galery
// ----------------------------
app.get("/gallery", async (req, res) => {
  const ambilGambar = await getAllImg();
  res.status(200).json(ambilGambar);
});

app.post("/showimg", cekUser2, async (req, res) => {
  // Ambil lokasi image yang di click
  const path = req.body.fixPath;
  // ambil data image dari lokasi
  const getDataImage = await getDataImg(path);
  // ambil tittle gambar
  const titleImage = getDataImage[0].name;
  // ambil id user yang upload gambar itu
  const uploadBY = getDataImage[0].uploadBY;
  // ambil data user tersebut
  const UserUpload = await getDataById(uploadBY);
  // ambil usernamenya
  const username = UserUpload[0].username;
  // Ambil profilenya
  const profileUser = UserUpload[0].profile;

  try {
    res.json({ titleImage, username, profileUser });
  } catch (err) {
    console.log(err);
    res.status(500).send("Query gagal");
  }
});

app.get("/:username/gallery", async (req, res) => {
  const username = req.params.username;
  const idUser = await getIdByName(username);
  const gallery = await myGallery(idUser[0].id);

  try {
    res.status(200).json(gallery);
  } catch (err) {
    res.status(400).send("Belum Appload", err);
  }
});

app.get("/:username/borkmark", async (req, res) => {
  const username = req.params.username;
  const idUser = await getIdByName(username);

  const getDataMark = await borkmark(idUser[0].id);
  const idImage = getDataMark.map((mark) => mark.markIMG);

  if (idImage.length > 0) {
    const getDataImage = await getImgById(idImage);
    res.status(200).json(getDataImage);
  } else {
    res.status(404).json({ message: "Tidak ada gambar yang di simpan" });
  }
});

app.post("/sendMark", async (req, res) => {
  const token = req.cookies.jwt;
  const { id } = jwt.decode(token);
  const { fixPath } = req.body;

  const getDataImage = await getDataImg(fixPath);
  const idImg = getDataImage[0].id;
  await sendBorkmark(id, idImg);
  res.status(200);
});

app.post("/deleteMark", async (req, res) => {
  const token = req.cookies.jwt;
  const { id } = jwt.decode(token);
  const { fixPath } = req.body;

  const getDataImage = await getDataImg(fixPath);
  const idImg = getDataImage[0].id;
  await deleteMark(idImg, id);
  res.status(200);
});

// ----------------------------
// Ganti nama & password
// ----------------------------
app.get("/gantinama", (req, res) => {
  res.render("gantiNama", {
    style: "ganti-nama/style.css",
    script: "ganti-nama/script.js",
  });
});

app.put("/changeName", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const { id } = jwt.decode(token);

    const { usernameBefore, usernameAfter } = req.body;

    // Cek apakah usernameBefore ada

    const cekNameBefore = await getDataById(id);

    if (usernameBefore !== cekNameBefore[0].username) {
      return res.status(404).json({
        UsernameNotFound: "Tolong masukan sesuai dengan nama akun anda",
      });
    }

    // Cek apakah usernameAfter sudah digunakan
    const cekNameAfter = await cekDuplikat(usernameAfter);

    if (cekNameAfter.length > 0) {
      return res
        .status(400)
        .json({ NameInUse: "Username baru sudah digunakan" });
    }

    // Jika lolos pengecekan, ubah nama pengguna
    await nameChanged(usernameAfter, id);
    res.status(200).json({ ChangedNameSuccess: "Nama sudah diganti" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ messageErr: "Gagal mengganti nama" });
  }
});

app.get("/gantipassword", (req, res) => {
  res.render("gantiPassword", {
    style: "/ganti-password/style.css",
    script: "/ganti-password/script.js",
  });
});

app.put("/changePassword", async (req, res) => {
  const token = req.cookies.jwt;
  const { id } = jwt.decode(token);

  const { passwordBefore, passwordAfter } = req.body;

  try {
    const cekPassword = await getDataById(id);

    // Bandingkan password menggunakan async/await
    const passwordCocok = await bcrypt.compare(
      passwordBefore,
      cekPassword[0].password
    );

    if (!passwordCocok) {
      return res.status(404).json({ passwordNotFound: "Password anda salah" });
    }

    // Validasi panjang password baru
    if (passwordAfter.length < 4) {
      return res
        .status(400)
        .json({ passwordKurang: "Minimum password 4 karakter" });
    }

    // Hash password baru dan perbarui
    const hashedPassword = await bcrypt.hash(passwordAfter, saltRounds);
    await passwordChanged(hashedPassword, id);

    res.json({ ChangedPasswordSuccess: "Password berhasil diubah" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ messageErr: "Ada kesalahan dari server" });
  }
});

// ----------------------------
// Upload
// ----------------------------
app.get("/upload", cekUser3, (req, res) => {
  res.render("upload", {
    style: "style.css",
    script: "upload.js",
  });
});

app.post("/upload", upload.single("fileimg"), async (req, res) => {
  const token = req.cookies.jwt;
  const { id } = jwt.decode(token);
  try {
    const file = req.file;
    const nameimg = req.body.nameimg;
    const path = file.path;

    if (!file) {
      res.status(404).send("Gambar tidak di temukan");
    }

    const kirimFile = await sendFile(path, nameimg, id);
    if (!kirimFile) {
      res.status(500).send("Query Kirim Img gagal");
    }

    res.status(200).json({ success: "Gambar berhasil di upload" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengunggah gambar.");
  }
});

app.delete("/deleteImg", async (req, res) => {
  const { fixPath } = req.body;

  const getDataImage = await getDataImg(fixPath);
  const idImage = getDataImage[0].id;
  await deleteImg(idImage);
  res.status(200).json({ message: "Delete img berhasil" });
});

// -----------------------------------------------
// Authentication
// -----------------------------------------------

app.get("/signup", (req, res) => {
  res.render("authForm/signup", {
    style: "auth/authStyle/signup.css",
    script: "auth/authJS/signup.js",
  });
});

app.post("/signup", async (req, res) => {
  const username = req.body.name;
  const password = req.body.password;
  const duplikat = await cekDuplikat(username);

  if (duplikat && duplikat.length > 0) {
    res.status(300).json({ duplikat: "Username sudah digunakan" });
  } else if (password.length < 4) {
    res.status(300).json({ pswInvalid: "Password harus lebih 4 karakter" });
  } else {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        res.status(500).send("Hashing password gagal");
      } else {
        await sendAccount(username, hash);
        res.status(200).json({ success: "Sign up success" });
      }
    });
  }
});

app.get("/login", (req, res) => {
  res.render("authForm/login", {
    style: "auth/authStyle/login.css",
    script: "auth/authJS/login.js",
  });
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const duplikat = await cekDuplikat(username);
    const IdByName = await getIdByName(username);
    const cekPasswordUser = await cekPassword(username);

    if (duplikat && duplikat.length > 0) {
      if (cekPasswordUser) {
        // Assuming cekPasswordUser returns the hashed password
        bcrypt.compare(
          password,
          cekPasswordUser[0].password,
          function (err, result) {
            if (err) {
              return res.status(500).send("Password gagal di hashing");
            }
            if (!result) {
              return res.json({
                wrongPswd: "Password yang anda masukan salah",
              });
            } else {
              const token = createToken(IdByName[0].id);
              res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
              });
              return res.json({ loginSuccess: "Login success" });
            }
          }
        );
      } else {
        return res.json({ masukanPswd: "Masukan password" });
      }
    } else {
      return res
        .status(404)
        .json({ usernameNotFound: "Username tidak ditemukan" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/logout", (req, res) => {
  const token = req.cookies.jwt;
  res.cookie("jwt", token, { httpOnly: true, maxAge: 1 });
  res.redirect("/");
});

app.listen(3000, () => console.log("server is running on port 3000..."));
