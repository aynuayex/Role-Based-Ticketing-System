const Joi = require("joi");

const STATUS_VALUES = ["open", "In progress", "closed"];

const newTicketSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(5).max(150).required(),
});

const changeTicketUserSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(5).max(150).required(),
});

const ChangeTicketAdminSchema = Joi.object({
  status: Joi.string().valid(...STATUS_VALUES).required(),
});

module.exports = { newTicketSchema, changeTicketUserSchema, ChangeTicketAdminSchema };
