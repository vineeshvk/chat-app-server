// tslint:disable
// graphql typescript definitions

export declare namespace GQL {
	interface IGraphQLResponseRoot {
		data?: IQuery | IMutation;
		errors?: Array<IGraphQLResponseError>;
	}

	interface IGraphQLResponseError {
		/** Required for all errors */
		message: string;
		locations?: Array<IGraphQLResponseErrorLocation>;
		/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
		[propName: string]: any;
	}

	interface IGraphQLResponseErrorLocation {
		line: number;
		column: number;
	}

	interface IQuery {
		__typename: 'Query';
		hello: string | null;
	}

	interface IHelloOnQueryArguments {
		name?: string | null;
	}

	interface IMutation {
		__typename: 'Mutation';
		register: Array<IError> | null;
		login: Array<IError> | null;
	}

	interface IRegisterOnMutationArguments {
		email?: string | null;
		password?: string | null;
	}

	interface ILoginOnMutationArguments {
		email?: string | null;
		password?: string | null;
	}

	interface IError {
		__typename: 'Error';
		path: string;
		message: string;
	}
}

// tslint:enable
