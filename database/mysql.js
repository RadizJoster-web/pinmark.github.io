const mysql = require("mysql2");
// const { rejects } = require("assert");
// const { rejects } = require("assert");
// const { resolve } = require("path");
// const { resolve } = require("path");
// const { send } = require("process");

const db = mysql.createConnection({
  host: "localhost",
  database: "pinterest",
  password: "admin123",
  user: "root",
});

const getAllImg = () => {
  return new Promise((resolve, rejects) => {
    const query = "SELECT * FROM images ORDER BY id desc";
    db.query(query, (err, result) => {
      if (err) {
        rejects(err);
      } else {
        const modifyPath = result.map((image) => {
          image.path = image.path.replace("public", "");
          return image;
        });
        resolve(modifyPath);
      }
    });
  });
};

const sendFile = (path, name, id) => {
  return new Promise((resolve, rejects) => {
    const fixPath = path.replace("public", "");
    const query = "INSERT INTO images (path, name, uploadBY) values(?,?,?) ";
    db.query(query, [fixPath, name, id], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sendAccount = (username, password) => {
  return new Promise((resolve, rejects) => {
    const query = "insert into account (username, password) values(?, ?)";
    db.query(query, [username, password], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const cekDuplikat = (username) => {
  return new Promise((resolve, rejects) => {
    const query = "select username from account where username = ?";
    db.query(query, [username], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const cekPassword = (username) => {
  return new Promise((resolve, rejects) => {
    const query = "select password from account where username = ? ";
    db.query(query, [username], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getDataById = (id) => {
  return new Promise((resolve, rejects) => {
    const query = "select * from account where id = ? ";
    db.query(query, [id], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getIdByName = (username) => {
  return new Promise((resolve, rejects) => {
    const query = "select id from account where username = ? ";
    db.query(query, [username], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const nameChanged = (username, id) => {
  return new Promise((resolve, rejects) => {
    const query = "update account set username = ? where id = ?";
    db.query(query, [username, id], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const passwordChanged = (password, id) => {
  return new Promise((resolve, rejects) => {
    const query = "update account set password = ? where id = ?";
    db.query(query, [password, id], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getDataImg = (pathImg) => {
  return new Promise((resolve, reject) => {
    const fixPath = pathImg.replace(/\//g, "\\");
    const query = "SELECT * FROM images WHERE path = ?";
    db.query(query, [fixPath], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sendProfile = (path, id) => {
  return new Promise((resolve, rejects) => {
    const fixPath = path.replace("public", "");
    const query = "update account set profile = ? where id = ?";
    db.query(query, [fixPath, id], (err, result) => {
      if (err) {
        rejects(err);
      } else {
        resolve(result);
      }
    });
  });
};

const myGallery = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from images where uploadBY = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const borkmark = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from borkmark where accountID = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const sendBorkmark = (accountID, imgMark) => {
  return new Promise((resolve, reject) => {
    const query = "insert into borkmark (accountID, markIMG) values(?, ?)";
    db.query(query, [accountID, imgMark], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteMark = (markIMG, accountID) => {
  return new Promise((resolve, reject) => {
    const query = "delete from borkmark where markIMG = ? and accountID = ?";
    db.query(query, [markIMG, accountID], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getImgById = (idImage) => {
  return new Promise((resolve, reject) => {
    const query = `select * from images where id in (${idImage.join(",")})`;
    db.query(query, [idImage], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteImg = (idImage) => {
  return new Promise((resolve, reject) => {
    const query = "Delete from images where id = ?";
    db.query(query, [idImage], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  db,
  deleteImg,
  deleteMark,
  sendBorkmark,
  getImgById,
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
  cekDuplikat,
};
