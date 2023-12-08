import { CLAIMS_EMAIL } from "../constants";
import { User } from "../models";

const getProfile = async (req, res) => {
  const email = req.auth.payload[CLAIMS_EMAIL];
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    res.status(400);
    throw new Error(ERROR_USER_NOT_EXIST);
  }

  return res.json({ user });
};

const createClass = async (req, res) => {};

const getClasses = async (req, res) => {};

const getClassDetails = async (req, res) => {};

export { getProfile, createClass, getClasses, getClassDetails };
