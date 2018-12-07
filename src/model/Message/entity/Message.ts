import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	BaseEntity
} from 'typeorm';
import { User } from '../../User';
import { Chat } from '../../Chat';

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
