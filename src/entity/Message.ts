import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Chat from './Chat';
import User from './User';

@Entity()
export default class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(type => User, user => user.messages)
  sender: User;

  @ManyToOne(type => Chat, chat => chat.messages)
  chat: Chat;
}
