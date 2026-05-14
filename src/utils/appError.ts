import { HttpStatus } from "@nestjs/common";

export class AppError extends Error {
  public statusCode: HttpStatus;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}