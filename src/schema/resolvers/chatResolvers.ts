import { getRepository } from 'typeorm';
import { contextType } from '..';
import { returnError } from '../../config/errorHandling';
import { UN_AUTHROIZED } from '../../config/errorMessages';
import Chat from '../../entity/Chat';
import User from '../../entity/User';

const resolvers = {
  Mutation: {
    createChat,
  },
  Query: {
    getChats,
  },
};

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

async function getChats(_, {}, { user }: contextType) {
  const userR = await getUserRepo(user.id);
  // const userChats = userR.find(({ id }) => id === user.id);
  const chats = userR.chats.map(chat => {
    if (!chat.name) {
      const mem = chat.members.filter(member => member.id !== user.id)[0];
      return { ...chat, name: mem.email };
    }
    return chat;
  });
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

export default resolvers;
