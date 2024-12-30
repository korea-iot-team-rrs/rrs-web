export const MAIN_PATH = 'http://localhost:3000';
export const MAIN_URL = 'http://localhost:4040/api/v1';

export const USER_PATH = '/users';

//auth
export const AUTH_PATH = '/auth';
export const LOGIN = '/auth/login';
export const SIGN_UP = '/auth/sign-up';

// Todo
export const TODO_PATH = '/todos';
export const TODO_CREATE_PATH = '/todos/write';
export const TODO_UPDATE_PATH = (todoId: number) => `/todos/${todoId}`;

// Reservation
export const RESERVATION_PATH = '/reservations';
export const RESERVATION_CREATE_PATH = '/reservations/write';
export const RESERVATION_DETAIL_PATH = (reservationId: number) => `/reservations/${reservationId}`;
export const RESERVATION_LIST_FOR_USER = '/reservations/mine/user';
export const RESERVATION_LIST_FOR_PROVIDER = '/reservations/mine/provider';
export const RESERVATION_UPDATE_PATH = (reservationId: number) => `/reservations/${reservationId}`;  // update path for resetvation memo
export const RESERVATION_UPDATE_STATUS_PATH = '/update-reservation-status';
export const FIND_PROVIDER_BY_DATE_PATH = '/get-provider';

// Review
export const REVIEW_PATH = '/reviews';

// CustomerSupport
export const CUSTOMER_SUPPORT_PATH = '/customer-supports'
