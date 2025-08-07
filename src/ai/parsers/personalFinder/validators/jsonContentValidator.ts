export function jsonContentValidator(response: { result: string; }): void {


  if (!response || typeof response !== 'object') {
    throw new Error('Response must be a JSON object');
  }

  if (!response.result || typeof response.result !== 'string') {
    throw new Error('Missing or invalid result field');
  }

}
