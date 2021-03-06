const express = require("express");

const press = express.Router();

const regExpIntegrityCheck = require("../middlewares/regexCheck");
const { uuidv4RegExp } = require("../middlewares/regexCheck");
const auth = require("../middlewares/auth");

const Press = require("../model/press.model");

press.get("/", async (req, res) => {
  const pressR = await Press.findAll();
  try {
    res.status(200).json(pressR);
  } catch (err) {
    res.status(400).json(err);
  }
});

press.get("/:uuid", regExpIntegrityCheck(uuidv4RegExp), async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const pressR = await Press.findByPk(uuid);
    res.status(200).json(pressR);
  } catch (err) {
    res.status(422).json({
      status: "error",
      message: "invalid request",
    });
  }
});

press.post("/", auth, async (req, res) => {
  const { title, description, picture } = req.body;
  try {
    const pressR = await Press.create({
      title,
      description,
      picture,
    });
    res.status(201).json(pressR);
  } catch (err) {
    res.status(422).json({
      status: "error",
      message: "invalid request",
    });
  }
});

press.put(
  "/:uuid",
  auth,
  regExpIntegrityCheck(uuidv4RegExp),
  async (req, res) => {
    const { uuid } = req.params;
    const { title, description, picture } = req.body;

    try {
      const pressR = await Press.update(
        { title, description, picture },
        { where: { uuid } }
      );

      res.status(204).json(pressR);
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: "invalid request",
      });
    }
  }
);

press.delete(
  "/:uuid",
  auth,
  regExpIntegrityCheck(uuidv4RegExp),
  async (req, res) => {
    const { uuid } = req.params;
    try {
      const pressR = await Press.destroy({ where: { uuid } });

      res.status(204).json(pressR);
    } catch (err) {
      res.status(404).json({
        status: "error",
        message: "press relation not found",
      });
    }
  }
);

module.exports = press;
