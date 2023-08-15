export interface ArgumentError {
  errorType: "ArgumentError";
  content: string;
}

export interface InvalidOperation {
  errorType: "InvalidOperation";
  content: string;
}

export interface IoError {
  errorType: "IoError";
  content: string;
}

export interface BatchError {
  errorType: "BatchError";
  content: ClientError[];
}

export type ClientError =
  | ArgumentError
  | InvalidOperation
  | IoError
  | BatchError;
