const express = require("express");
const router = express.Router();
const { getCurrent, updateAvatar, verifyEmail } = require("../../models/users");
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");

router.get("/current", auth, async (req, res) => {
  const currentUser = await getCurrent(req, res);
  res.status(200).json({
    Status: "200 OK",
    ResponseBody: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  });
});

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    const newAvatar = await updateAvatar(req, res);
    res.status(200).json({
      Status: "200 OK",
      ResponseBody: {
        avatarURL: newAvatar,
      },
    });
  }
);

router.get("/verify/:verificationToken", async (req, res) => {
  await verifyEmail(req, res);
  res.status(200).json({
    Status: "200 OK",
    ResponseBody: {
      message: "Verification successful",
    },
  });
});

module.exports = router;
