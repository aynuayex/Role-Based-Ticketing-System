const express = require("express");
const router = express.Router();

const { validateTicket } = require("../../middleware/validateRequest");
const ticketController = require("./controller");

router.get("/", ticketController.handleGetAllTicket);
router.get("/:id", ticketController.handleGetTicket);
router.post("/", ticketController.handleNewTicket);
router.put("/:id", ticketController.handleChangeTicket);

module.exports = router;
