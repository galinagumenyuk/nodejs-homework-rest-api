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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    res.status(404).json({
      Status: "404 Not Found",
      ResponseBody: {
        message: "User not found",
      },
    });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  return user;
};

module.exports = { getCurrent, updateAvatar, verifyEmail };
