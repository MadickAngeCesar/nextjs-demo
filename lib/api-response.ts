import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Standard API response format for successful operations
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Standard API response format for errors
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Standard API response format for validation errors
 */
export interface ValidationErrorResponse {
  success: false;
  error: {
    message: string;
    code: 'VALIDATION_ERROR';
    details: Record<string, string>;
  };
}

/**
 * Creates a successful response with the provided data
 * @param data - The data to return in the response
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with the data and specified status
 *
 * @example
 * // GET: Return list of items
 * const items = await db.habit.findMany({ where: { userId } });
 * return apiSuccess(items);
 *
 * @example
 * // POST: Return created item with 201 status
 * const created = await db.habit.create({ data: {...} });
 * return apiSuccess(created, 201);
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Creates an error response with message and optional details
 * @param message - Error message to display
 * @param status - HTTP status code (default: 500)
 * @param code - Optional error code for programmatic handling
 * @param details - Optional additional error details
 * @returns NextResponse with error information
 *
 * @example
 * // Return generic server error
 * return apiError('Failed to fetch transactions', 500);
 *
 * @example
 * // Return error with code for client handling
 * return apiError('Database error', 500, 'DB_ERROR', { table: 'transactions' });
 *
 * @example
 * // Return 404 with code
 * const habit = await db.habit.findUnique({ where: { id } });
 * if (!habit) {
 *   return apiError('Habit not found', 404, 'NOT_FOUND');
 * }
 */
export function apiError(
  message: string,
  status: number = 500,
  code?: string,
  details?: Record<string, unknown>
): NextResponse<ErrorResponse> {
  const error: ErrorResponse['error'] = {
    message,
    ...(code && { code }),
    ...(details && { details }),
  };

  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

/**
 * Creates a validation error response from Zod validation errors
 * @param zodError - The ZodError from schema validation
 * @param status - HTTP status code (default: 400)
 * @returns NextResponse with validation error details
 *
 * @example
 * const validationResult = CreateTransactionSchema.safeParse(body);
 * if (!validationResult.success) {
 *   return apiValidationError(validationResult.error);
 * }
 */
export function apiValidationError(
  zodError: ZodError<unknown>,
  status: number = 400
): NextResponse<ValidationErrorResponse> {
  // Format Zod errors into a flat key-value structure
  const details: Record<string, string> = {};
  zodError.issues.forEach((issue) => {
    const path = issue.path.join('.');
    details[path] = issue.message;
  });

  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      },
    },
    { status }
  );
}

/**
 * Creates a 404 Not Found response
 * @param resource - Name of the resource that was not found (e.g., 'Habit', 'Transaction')
 * @param status - HTTP status code (default: 404)
 * @returns NextResponse with 404 error
 *
 * @example
 * const habit = await db.habit.findUnique({ where: { id } });
 * if (!habit) {
 *   return apiNotFound('Habit');
 * }
 *
 * @example
 * // With custom message
 * return apiNotFound('User with this email');
 */
export function apiNotFound(
  resource: string,
  status: number = 404
): NextResponse<ErrorResponse> {
  return apiError(
    `${resource} not found`,
    status,
    'NOT_FOUND'
  );
}

/**
 * Formats error messages for consistency
 * @param error - The error to format
 * @returns Formatted error message
 *
 * @example
 * try {
 *   // ... operation
 * } catch (error) {
 *   return apiError(formatErrorMessage(error), 500);
 * }
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Checks if a value is a Zod validation error
 * @param error - The error to check
 * @returns True if the error is a ZodError
 *
 * @example
 * try {
 *   // ... operation
 * } catch (error) {
 *   if (isZodError(error)) {
 *     return apiValidationError(error);
 *   }
 *   return apiError('Internal error', 500);
 * }
 */
export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

/**
 * Creates a standardized response for paginated data
 * @param items - Array of items
 * @param total - Total count of items (before pagination)
 * @param page - Current page number (1-indexed)
 * @param pageSize - Number of items per page
 * @returns Paginated response object
 *
 * @example
 * const [items, total] = await Promise.all([
 *   db.transaction.findMany({ skip: offset, take: pageSize }),
 *   db.transaction.count({ where: { userId } }),
 * ]);
 * return apiSuccess(createPaginatedResponse(items, total, page, pageSize), 200);
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
) {
  const totalPages = Math.ceil(total / pageSize);
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
