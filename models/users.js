const { User } = require("./auth");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const getCurrent = async (req, res) => {
  const curUser = req.user;
  return curUser;
};

const updateAvatar = async (req, res) => {
  console.log(req.file);
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;

  try {
    const resultUpload = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      originalname
    );
    const avatarURL = path.join("public", "avatars", originalname);
    await fs.rename(tempUpload, resultUpload);

    Jimp.read(resultUpload).then((image) => {
      image.resize(250, 250).write(resultUpload);
    });
    await User.findByIdAndUpdate(_id, { avatarURL });
    return avatarURL;
  } catch (error) {
    await fs.unlink(tempUpload);
    res.status(401).json({
      Status: "401 Unauthorized",
      ResponseBody: {
        message: "Not authorized",
      },
    });
  }
};

module.exports = { getCurrent, updateAvatar };
