import Contact from "../models/Contact.js";

export const addContact = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    if (!name || !phoneNumber || !email) {
      return res
        .status(400)
        .json({ status: "failure", message: "Required field is missing" });
    }
    const contact = await Contact.create({
      name,
      phoneNumber,
      email,
      creator: req.user._id,
    });
    res
      .status(201)
      .json({ status: "success", message: "Contact Created Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};

export const getContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({
      _id: id,
      creator: req.user._id,
      deletedAt: { $exists: false },
    });
    if (!contact) {
      return res
        .status(400)
        .json({ status: "failure", message: "Conatct is not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Conatct found Successfully",
      data: contact,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const query = {
      creator: req.user._id,
      deletedAt: { $exists: false },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ],
    };
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.aggregate([
      { $match: query },
      {
        $project: {
          contact_id: "$_id",
          name: 1,
          email: 1,
          phoneNumber: 1,
          _id: 0,
        },
      },
      { $skip: skip },
      { $limit: +limit },
    ]);
    res.status(200).json({
      status: "success",
      message: "Contacts Found successfully",
      total,
      pageCount: Math.ceil(total / limit),
      data: contacts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const { id } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, creator: req.user._id, deletedAt: { $exists: false } },
      {
        name,
        phoneNumber,
        email,
      }
    );
    if (!updatedContact) {
      return res
        .status(400)
        .json({ status: "failure", message: "Conatct is not found" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Contact Updated Succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findOneAndUpdate(
      { _id: id, creator: req.user._id, deletedAt: { $exists: false } },
      {
        deletedAt: new Date(),
      }
    );
    if (!deletedContact) {
      return res
        .status(400)
        .json({ status: "failure", message: "Conatct is not found" });
    }
    res
      .status(200)
      .json({ status: "success", message: "Contact deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};
