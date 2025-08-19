// Type guards for Supabase API responses

export interface SupabaseErrorLike {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export const isSupabaseError = (error: unknown): error is SupabaseErrorLike => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
};

export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiError {
  data: null;
  error: SupabaseErrorLike;
}

export const isApiResponse = <T>(response: unknown): response is ApiResponse<T> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'error' in response &&
    (response as any).error === null
  );
};

export const isApiError = (response: unknown): response is ApiError => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'error' in response &&
    (response as any).data === null &&
    (response as any).error !== null
  );
};

export const isProduct = (obj: unknown): obj is any => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'price' in obj &&
    'handle' in obj
  );
};

export const isCollection = (obj: unknown): obj is any => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'handle' in obj
  );
};

export const isCartItem = (obj: unknown): obj is any => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'product_id' in obj &&
    'quantity' in obj
  );
};
