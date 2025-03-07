const express = require("express");
const router = express.Router();

const { validateTicket } = require("../../middleware/validateRequest");
const ticketController = require("./controller");

router.get("/", ticketController.handleGetAllTicket);
router.get("/:ticketId", ticketController.handleGetTicket);

router.post("/", validateTicket, ticketController.handleNewTicket);

router.put("/:ticketId", validateTicket, ticketController.handleUpdateTicketByUser);
router.put("/status/:ticketId", validateTicket, ticketController.handleUpdateTicketByAdmin);

router.delete("/:ticketId", ticketController.handleDeleteTicket);

module.exports = router;
