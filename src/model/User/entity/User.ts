import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { Chat } from '../../Chat';
import { Message } from '../../Message';

@Entity('users')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column('text')
	password: string;

	@OneToMany(type => Message, message => message.sender)
	messages: Message[];

	@ManyToMany(type => Chat, chats => chats.members)
	@JoinTable()
	chats: Chat[];
}
