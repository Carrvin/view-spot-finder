export class RequestPayloadValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, RequestPayloadValidationError.prototype);
  }
}
