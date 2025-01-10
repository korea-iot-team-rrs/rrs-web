export const MAIN_PATH = 'http://localhost:3000';
export const MAIN_URL = 'http://localhost:4040/api/v1';
export const FILE_URL = "http://localhost:4040/"

export const USER_PATH = '/users';

//auth
export const LOGIN = '/auth/login';
export const SIGN_UP = '/auth/sign-up';
export const SEND_EMAIL = '/auth/send-email';
export const FIND_ID_BY_TOKEN = (token: string) => `/auth/find-id/${token}`;

// Todo
export const TODO_POST_PATH = '/todos/write';
export const TODO_GET_ALL = '/todos';
export const TODO_GET_BY_DATE_PATH = (day: string) => `/todos/api/v1/todos?day=${day}`;
export const TODO_PUT_PATH = (todoId: number) => `/todos/${todoId}`;
export const TODO_DELETE_PATH = (todoId: number) => `/todos/${todoId}`;

// Reservation
export const RESERVATION_PATH = '/reservations';

// Review
export const REVIEW_PATH = '/reviews';

// CustomerSupport
export const CUSTOMER_SUPPORT_PATH = '/customer-supports'

export const DEFAULT_FILE_URL = "http://localhost:4040/file/default/defaultImg.png"