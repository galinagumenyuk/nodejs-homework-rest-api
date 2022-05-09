const { User } = require("./auth");
const path = require("path");
const fs = require("fs/promises");

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
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", originalname);
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
