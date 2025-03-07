const Ticket = require("./model");

const logger = require("../../config/logger");

const handleGetTicket = async (req, res) => {
  try {
    logger.info("Single ticket request received");
    const user = req.user;

    // If admin, fetch the ticket.
    if (user.role === "admin") {
      const tickets = await Ticket.findOne({
        _id: req.params.ticketId,
      }).exec();
      return res.json(tickets);
    }

    // If regular user, fetch only the ticket they own.
    const tickets = await Ticket.findOne({
      userId: user.id,
      _id: req.params.ticketId,
    }).exec();
    res.json(tickets);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const handleGetAllTicket = async (req, res) => {
  try {
    logger.info("All ticket list request received");
    const user = req.user;
    // If admin, fetch all tickets
    if (user.role === "admin") {
      // Populate only fullName and rename it as userId  directly like
      // userId: "ayne abreham" instead of being "userId": { "fullName": "ayne abreham"}
      const tickets = await Ticket.find({})
        .populate({ path: "userId", select: "fullName", transform: (doc) => doc?.fullName });

      return res.json(tickets);
    }
    
    console.log({User: user.id})
    // If regular user, fetch only their tickets
    const tickets = await Ticket.find({ userId: user.id });
    res.json(tickets);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const handleNewTicket = async (req, res) => {
  try {
    logger.info("Ticket creation request received");
    console.log(req.body);
    const { title, description } = req.body;

    const result = await Ticket.create({
      userId: req.user.id,
      title,
      description,
    });
    res.status(201).json({
      success: `New Ticket with title ${result.title} created!`,
      result,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const handleUpdateTicketByUser = async (req, res) => {
  try {
    logger.info("Ticket update request received by User");
    console.log(req.body);
    const { title, description } = req.body;

    const result = await Ticket.findByIdAndUpdate(
      { _id: req.params.ticketId },
      {
        title,
        description,
      },
      { new: true }
    );
    res.json({
      success: `Ticket updated!`,
      result,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const handleUpdateTicketByAdmin = async (req, res) => {
  try {
    logger.info("Ticket update request received by Admin");
    console.log(req.body);
    const { status } = req.body;

    const result = await Ticket.findByIdAndUpdate(
      { _id: req.params.ticketId },
      { status },
      { new: true }
    );
    res.json({
      success: `Ticket updated!`,
      result,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const handleDeleteTicket = async (req, res) => {
  try {
    logger.info("Ticket delete request received");

    const result = await Ticket.findByIdAndDelete({ _id: req.params.ticketId });
    res.json({
      success: `Ticket deleted!`,
      result,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleGetTicket,
  handleGetAllTicket,
  handleNewTicket,
  handleUpdateTicketByUser,
  handleUpdateTicketByAdmin,
  handleDeleteTicket,
};
