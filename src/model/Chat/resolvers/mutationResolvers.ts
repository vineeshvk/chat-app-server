import { GQL } from '../schemas/schema';
import { ResolverMap } from '../../config/graphql-utils';
import { User } from '../../User';
import Chat from '../entity/Chat';

export const mutationResolvers: ResolverMap = {
	Mutation: {
		createChat
	}
};

async function createChat(_, { membersId }) {
	const members = await getUserObject(membersId);

	return await createNewChat(members);
}

async function createNewChat(members) {
	const chat = await Chat.create();
	console.log(members);

	chat.members = members;

	await chat.save();
	console.log(chat);
	return null;
}

//get the user object from the user ids and then create a chat
async function getUserObject(membersId) {
	const members = await Promise.all(
		membersId.map(async memberId => {
			const user = await User.findOne({ id: memberId });
			return user;
		})
	);
	return members;
}
