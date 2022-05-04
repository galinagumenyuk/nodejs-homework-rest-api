const Joi = require("joi");
const { Schema, model } = require("mongoose");

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const joiSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-ЯёЁ\s]+$/)
    .min(2)
    .max(20)
    .required(),
  phone: Joi.string()
    .min(5)
    .pattern(/^[0-9\s]+$/)
    .required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "org"] },
    }),
  favorite: Joi.bool(),
});

const joiStatusSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const Contact = model("contact", contactSchema);

const listContacts = async (req, res) => {
  const { _id } = req.user._conditions;
  const list = await Contact.find({ owner: _id }).populate(
    "owner",
    "_id email"
  );
  return list;
};

const getContactById = async (contactId) => {
  const result = Contact.findById(contactId);
  return result;
};

const addContact = async (req, res) => {
  const { _id } = req.user._conditions;
  const newContact = await Contact.create({ ...req.body, owner: _id });
  return newContact;
};

const removeContact = async (contactId) => {
  const removeContact = Contact.findByIdAndRemove(contactId);
  return removeContact;
};

const updateContact = async (contactId, body) => {
  const updContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return updContact;
};

const updateStatusContact = async (contactId, favorite) => {
  const updStatusContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
  return updStatusContact;
};

module.exports = {
  joiSchema,
  joiStatusSchema,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
