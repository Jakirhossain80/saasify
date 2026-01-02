// FILE: types/api.ts
import type { FieldErrors } from "@/schemas/common.schema";

export type ApiOk<T> = {
  ok: true;
  data: T;
};

export type ApiFail = {
  ok: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: FieldErrors;
  };
};

export type ApiResponse<T> = ApiOk<T> | ApiFail;

export type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR";
