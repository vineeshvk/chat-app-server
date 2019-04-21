import { ValidationError } from 'yup';

type ErrorType = Array<{ path: string; message: string }>;

export function formatYupError(err: ValidationError): ErrorType {
	return [...extractMessageFromError(err)];
}

function extractMessageFromError(err: ValidationError): ErrorType {
	return err.inner.map(({ path, message }) => {
		return { path, message };
	});
}

export function returnError(path: string, message: string) {
	return [{ path, message }];
}
