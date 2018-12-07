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
		bye: string | null;
	}

	interface IByeOnMutationArguments {
		name?: string | null;
	}
}

// tslint:enable
