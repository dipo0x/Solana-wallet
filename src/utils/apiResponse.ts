import { env } from "../config/env";

export interface PaginatedResponse<T> {
  readonly records: T[];
  readonly metaData?: any;
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

export class ApiResponse<T> {
  public readonly status: "success" | "error";
  public readonly message: string;
  public readonly data?: T;
  public readonly error?: string;

  // --- HTTP Status Codes ---
  static OK = 200;
  static RESOURCE_CREATED = 201;
  static ACCEPTED = 202;
  static NO_CONTENT = 204;
  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static FORBIDDEN = 403;
  static RESOURCE_NOT_FOUND = 404;
  static INTERNAL_SERVER_ERROR = 500;

  constructor(
    status: "success" | "error",
    message: string,
    data?: T,
    error?: string,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  // --- Success Response ---
  static success<T>(message: string, data?: T) {
    return new ApiResponse<T>("success", message, data);
  }

  // --- Error Response ---
  static error<T>(message: string, error?: string | Error | any) {
    return new ApiResponse<T>(
      "error",
      message,
      undefined,
      env.NODE_ENV !== "production" ? error : undefined,
    );
  }

  // --- Paginated Response ---
  static paginate<T>(options: {
    message: string;
    data: any;
    total: number;
    page: number;
    limit: number;
    metaData?: any;
  }) {
    return new ApiResponse<PaginatedResponse<T>>("success", options.message, {
      records: options.data,
      metaData: options?.metaData,
      total: options.total,
      page: options.page,
      limit: options.limit,
    });
  }

  // --- Convert to JSON object ---
  toObject() {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      error: this.error,
    };
  }

  toJSON() {
    return this.toObject();
  }
}
