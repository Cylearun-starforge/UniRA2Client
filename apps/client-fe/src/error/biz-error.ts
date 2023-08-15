export class BizError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "BizError";
  }
}
