import { compare, hash } from "bcryptjs";
import * as yup from "yup";

import {
	duplicateEmail,
	invalidEmail,
	noUser,
	shortEmail,
	shortPassword,
	wrongPassword
} from "../../config/errorMessages";
import { formatYupError, returnError } from "../../config/errorHandling";
import User from '../../entity/User';

const resolvers = {
    Query: {
		hello: (_, name) => 'hello'
	},
	Mutation: {
		register,
		login
	}
};

//Mutation Functions
async function register(_, args) {
	try {
		await registerMutationHelper(args);
	} catch (error) {
		return formatYupError(error);
	}
}

async function login(_, { email, password }) {
	const userExist = await checkUserExists(email);
	if (!userExist) return returnError("email", noUser);

	const validPassword = await compare(password, userExist.password);
	if (!validPassword) return returnError("password", wrongPassword);

	return userExist.id;
}

//Helper Functions
const validationSchema = yup.object().shape({
	email: yup
		.string()
		.min(4, shortEmail)
		.email(invalidEmail),
	password: yup.string().min(4, shortPassword)
});

async function registerMutationHelper({
	email,
	password
}) {
	await validationSchema.validate({ email, password }, { abortEarly: false });

	const userExist = await checkUserExists(email);
	if (userExist) return returnError("email", duplicateEmail);

	return await createUser(email, password);
}

async function checkUserExists(email: string) {
	const userExist = await User.findOne({ email });
	return userExist;
}

async function createUser(email: string, password: string) {
	const hashedPassword = await hash(password, 10);
	await User.create({
		email,
		password: hashedPassword
	}).save();
	return null;
}

export default resolvers;