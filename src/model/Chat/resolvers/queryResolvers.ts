import { ResolverMap } from '../../config/graphql-utils';
import { GQL } from '../schemas/schema';
import { getRepository } from 'typeorm';
import { User } from '../../User';

export const queryResolvers: ResolverMap = {
	Query: {
		getChats
	}
};

async function getChats(_, { userId }) {
	const user = await getUserRepo();
	const userChats = user.find(({ id }) => id === userId);
	console.log(userChats);

	return userChats.chats;
}

async function getUserRepo() {
	const userRepo = getRepository(User);
	console.log(userRepo);

	const user = await userRepo.find({
		relations: ['chats', 'chats.members']
	});
	console.log(user);

	return user;
}
