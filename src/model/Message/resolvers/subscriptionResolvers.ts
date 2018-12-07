import { PubSub, withFilter } from 'apollo-server';

export const pubSub = new PubSub();

export const GET_CHAT_SUB = 'GET_CHAT_SUB';
export const subscriptionResolvers = {
	Subscription: {
		getNewMessages: {
			subscribe: getNewMessages()
		}
	}
};

function getNewMessages() {
	return withFilter(
		() => pubSub.asyncIterator(GET_CHAT_SUB),
		(payload, variable) => payload.chatId === variable.chatId
	);
}
