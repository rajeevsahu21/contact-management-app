import { Router } from "express";

import {
  addContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from "../controllers/contact.js";

const contactRoutes = Router();

contactRoutes.post("/", addContact);
contactRoutes.get("/", getContacts);
contactRoutes.get("/:id", getContact);
contactRoutes.put("/:id", updateContact);
contactRoutes.delete("/:id", deleteContact);

export default contactRoutes;
