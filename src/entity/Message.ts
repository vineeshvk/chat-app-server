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

  @ManyToOne(type => User, user => user.messages,{onDelete: 'CASCADE'})
  sender: User;

  @ManyToOne(type => Chat, chat => chat.messages,{onDelete: 'CASCADE'})
  chat: Chat;
}
