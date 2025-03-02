const User = require("../users/model");
const Ticket = require("./model");

const logger = require("../../config/logger");

const handleGetTicket = async (req, res) => {
  try {
    logger.info("Single ticket request received");
    const result = await Ticket.find({ userId: req.params.id });
    res.json({ result });
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

const handleGetAllTicket = async (req, res) => {
  try {
    logger.info("All ticket list request received");

    const result = await Ticket.find({});
    res.json(result);
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

const handleNewTicket = async (req, res) => {
  try {
    logger.info("Ticket creation request received");
    console.log(req.body);
    const { title, description } = req.body;

    const user = await User.findOne({email: req.user.email}).exec();
    const result = await Ticket.create({
      userId: user._id,
      title,
      description,
    });
    res.status(201).json({
      success: `New Ticket with title ${result.title} created!`,
      result,
    });
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

const handleChangeTicket = async (req, res) => {
  try {
    logger.info("Ticket change request received");
    console.log(req.body);
    const { title, description, status } = req.body;

    const result = await Ticket.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title,
        description,
        status,
      },
      { new: true }
    );
    res.json({
      success: `Ticket updated!`,
      result,
    });
  } catch (err) {
    logger.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleGetTicket,
  handleGetAllTicket,
  handleNewTicket,
  handleChangeTicket,
};
