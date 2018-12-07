import { ResolverMap } from '../../config/graphql-utils';
import { getAllMessages } from './mutationResolvers';

export const queryResolvers: ResolverMap = {
	Query: {
		getMessages
	}
};

async function getMessages(_, { chatId }) {
	const messages = await getAllMessages(chatId);
	return messages;
}
