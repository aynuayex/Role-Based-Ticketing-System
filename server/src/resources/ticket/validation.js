const Joi = require("joi");

const ticketSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
});

module.exports = { ticketSchema };
