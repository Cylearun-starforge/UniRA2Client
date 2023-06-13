import { UniRA2SDKError } from './basic-error';

export class ArgumentError extends UniRA2SDKError {
  name = 'ArgumentError';
  argumentName: string;

  constructor(argumentName: string) {
    super();
    this.argumentName = argumentName;
  }
}
