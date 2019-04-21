import {
	BaseEntity,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import Chat from './Chat';
import Message from './Message';


@Entity('users')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column('text')
	password: string;

	@ManyToMany(type => Chat, chat => chat.members)
	chats: Chat[];

	@OneToMany(type => Message, messages => messages.sender)
	messages: Message[];
}
