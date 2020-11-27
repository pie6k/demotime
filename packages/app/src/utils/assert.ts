export function assert(input: any, message: string): asserts input {
  if (input === undefined || input === null) {
    throw new Error(message);
  }
}
