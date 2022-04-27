const express = require("express");
const router = express.Router();

const {
  joiSchema,
  joiStatusSchema,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ contact });
});

router.post("/", async (req, res, next) => {
  // const validationResult = joiSchema.validate(req.body);
  // if (validationResult.error) {
  //   return res.status(400).json({
  //     status: validationResult.error.details.map((x) => x.message),
  //     message: `missing required ${validationResult.error.details.map(
  //       (x) => x.context.key
  //     )} field`,
  //   });
  // }

  const newContact = await addContact(req.body);
  res.status(201).json({ newContact });
});

router.delete("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (contact.length === 0) {
    res.status(404).json({ message: "Not found" });
  }
  await removeContact(req.params.contactId);
  res.status(200).json({ message: "contact deleted" });
});

router.put("/:contactId", async (req, res, next) => {
  // const validationResult = joiSchema.validate(req.body);
  // if (validationResult.error) {
  //   return res.status(400).json({
  //     status: validationResult.error.details.map((x) => x.message),
  //     message: `missing required ${validationResult.error.details.map(
  //       (x) => x.context.key
  //     )} field`,
  //   });
  // }
  const updContact = await updateContact(req.params.contactId, req.body);

  res.status(200).json({ updContact });
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const validationResult = joiStatusSchema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({
      message: "missing field favorite",
    });
  }
  const updStatusContact = await updateStatusContact(
    req.params.contactId,
    req.body.favorite
  );

  res.status(200).json({ updStatusContact });
});

module.exports = router;
