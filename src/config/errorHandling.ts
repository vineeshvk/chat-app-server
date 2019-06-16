export function returnError(path: string, message: string) {
  return { error: { path, message } };
}
