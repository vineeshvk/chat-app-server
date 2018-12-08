import { getRepository } from 'typeorm';
import { Message } from '..';
import { Chat } from '../../Chat';
import { ResolverMap } from '../../config/graphql-utils';
import { User } from '../../User';
import { GET_CHAT_SUB, pubSub } from './subscriptionResolvers';

export const mutationResolvers: ResolverMap = {
	Mutation: {
		createMessage
	}
};

async function createMessage(_, { chatId, senderId, text }) {
	const sender = await User.findOne({ id: senderId });
	const chat = await Chat.findOne({ id: chatId });
	const newMessage = await createNewMessage(text, sender, chat);

	return triggerSubscription(senderId, chatId, newMessage);
}

async function createNewMessage(text, sender, chat) {
	const message = await Message.create({ text, sender, chat });
	await message.save();
	return message;
}

export async function getAllMessages(chatId: string) {
	const chats = await getChatRepo();

	const chatMessages = chats.find(({ id }) => id === chatId);
	return chatMessages;
}

async function getChatRepo() {
	const chatRepo = getRepository(Chat);
	return await chatRepo.find({
		relations: ['members', 'messages', 'messages.sender']
	});
}

async function triggerSubscription(senderId, chatId, message) {
	// const chats = await getAllMessages(chatId);
	pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
	return null;
}
