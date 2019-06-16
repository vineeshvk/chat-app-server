import { getRepository } from 'typeorm';
import { contextType } from '..';
import { returnError } from '../../config/errorHandling';
import { UN_AUTHROIZED } from '../../config/errorMessages';
import Chat from '../../entity/Chat';
import User from '../../entity/User';

const resolvers = {
  Mutation: {
    createChat,
    deleteChat,
  },
  Query: {
    getChats,
  },
};
/* -------------------CREATE_CHAT---------------------------- */
async function createChat(_, { membersId, name }, { user }: contextType) {
  if (!user) return returnError('createChat', UN_AUTHROIZED);

  const members = await getUserObject(membersId);

  return await createNewChat([...members, user], name);
}

async function createNewChat(members: User[], name?: string) {
  const chat = await Chat.create({});
  await chat.save();

  chat.members = members;
  if (name) chat.name = name;

  await chat.save();

  return null;
}

//get the user object from the user ids and then create a chat
async function getUserObject(membersId: string[]) {
  const members = await Promise.all(
    membersId.map(async memberId => {
      const user = await User.findOne({ id: memberId });
      return user;
    })
  );
  return members;
}

/* -------------------GET_CHAT---------------------------- */

async function getChats(_, {}, { user }: contextType) {
  const userR = await getUserRepo(user.id);

  const chats = [];
  for (let chat of userR.chats) {
    if (chat.members.length == 1) {
      await chat.remove();
    } else if (!chat.name) {
      const mem = chat.members.filter(member => member.id !== user.id)[0];
      chats.push({ ...chat, name: mem.name });
    }
  }

  return chats;
}

async function getUserRepo(userId) {
  const userRepo = getRepository(User);

  const user = await userRepo.find({
    relations: ['chats', 'chats.members'],
    where: { id: userId },
  });

  return user[0];
}

async function deleteChat(_, { chatId }, { user }: contextType) {
  const chat = await Chat.findOne({ id: chatId });

  if (!chat) return returnError('deleteChat', 'Chat not found');
  if (!user) return returnError('deleteChat', UN_AUTHROIZED);

  await chat.remove();
  return { id: chatId };
}

export default resolvers;
