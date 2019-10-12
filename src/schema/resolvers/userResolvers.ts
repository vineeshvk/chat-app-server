import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { contextType } from '..';
import { returnError } from '../../config/errorHandling';
import {
  DUPLICATE_USER,
  INVALID_PASSWORD,
  NO_USER,
  UN_AUTHROIZED,
} from '../../config/errorMessages';
import Chat from '../../entity/Chat';
import Message from '../../entity/Message';
import User from '../../entity/User';

const resolvers = {
  Query: {
    hello: () => 'hello',
    getUsers,
    me,
  },
  Mutation: {
    register,
    login,
    deleteUser,
    shredData,
    renameUser,
  },
};

//Query
/* ---------------------ME-------------------------- */
async function me(_, {}, { user }: contextType) {
  return user;
}

/* ---------------------GET_USERS-------------------------- */

async function getUsers(_, {}, { user }: contextType) {
  if (!user) return returnError('getUsers', UN_AUTHROIZED);

  let users = await User.find();
  users = users.filter(us => us.id !== user.id);
  return { users };
}

//Mutation
/* --------------------REGISTER-------------------------- */

async function register(_, { email, password, name, fcmToken }) {
  const userName = await User.findOne({ name });
  if (userName) return returnError('name', DUPLICATE_USER('name'));

  const userExist = await User.findOne({ email });
  if (userExist) return returnError('email', DUPLICATE_USER('email'));

  const hashedPassword = await hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    fcmToken,
  }).save();

  let token;
  try {
    token = sign({ id: user.id }, process.env.JWT_SECRET_TOKEN);
  } catch (e) {
    console.error(e)
  }

  return { token, id: user.id };
}

/* ------------------------LOGIN------------------------------- */
async function login(_, { email, password, fcmToken }) {
  const userExist = await User.findOne({ email });
  if (!userExist) return returnError('email', NO_USER);

  const validPassword = await compare(password, userExist.password);
  if (!validPassword) return returnError('password', INVALID_PASSWORD);

  let token;
  try {
    token = sign({ id: userExist.id }, process.env.JWT_SECRET_TOKEN);
  } catch (e) {
    console.error(e);
  }

  if (fcmToken != userExist.fcmToken) {
    userExist.fcmToken = fcmToken;
    await userExist.save();
  }
  return { token, id: userExist.id };
}

/* -----------------------DELELTE_USER------------------------- */
async function deleteUser(_, {}, { user }: contextType) {
  await user.remove();
}

async function shredData(_, { secret }) {
  if (secret === process.env.KILL_SWITCH && secret) {
    await Chat.clear();
    await User.clear();
    await Message.clear();
  }
}

/* ---------------------RENAME_USER------------------------- */
async function renameUser(_, { name }, { user }: contextType) {
  if (!name) return returnError('renameUser', 'Name not given');

  user.name = name;
  await user.save();
  return { id: user.id };
}

export default resolvers;
