import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { returnError } from '../../config/errorHandling';
import {
  DUPLICATE_USER,
  INVALID_PASSWORD,
  NO_USER,
  UN_AUTHROIZED,
} from '../../config/errorMessages';
import User from '../../entity/User';

const resolvers = {
  Query: {
    hello: (_, name) => 'hello',
    getUsers,
  },
  Mutation: {
    register,
    login,
  },
};

//Query
/* ---------------------GET_USERS-------------------------- */

async function getUsers(_, {}, { user }) {
  if (!user) return returnError('getUsers', UN_AUTHROIZED);

  const users = await User.find();
  return users;
}

//Mutation
/* --------------------REGISTER-------------------------- */

async function register(_, { email, password }) {
  const userExist = await User.findOne({ email });
  if (userExist) return returnError('email', DUPLICATE_USER);

  const hashedPassword = await hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  }).save();
  const token = sign({ id: user.id }, process.env.JWT_SECRET_TOKEN);

  return { token, id: user.id };
}

/* ------------------------LOGIN------------------------------- */
async function login(_, { email, password }) {
  const userExist = await User.findOne({ email });
  if (!userExist) return returnError('email', NO_USER);

  const validPassword = await compare(password, userExist.password);
  if (!validPassword) return returnError('password', INVALID_PASSWORD);

  const token = sign({ id: userExist.id }, process.env.JWT_SECRET_TOKEN);

  return { token, id: userExist.id };
}

export default resolvers;
