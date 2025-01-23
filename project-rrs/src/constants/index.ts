export const MAIN_URL = "http://localhost:4040/api/v1";
export const FILE_URL = "http://localhost:4040/";

export const USER_PATH = "/users";

//auth
export const LOGIN = "/auth/login";
export const SIGN_UP = "/auth/sign-up";
export const SEND_EMAIL = "/auth/recovery-email";
export const FIND_ID_BY_TOKEN = (token: string) => `/auth/find-id/${token}`;
export const UPDATE_PASSWORD = `/users/me/password`;

// Todo
export const TODO_POST_PATH = "/todos";
export const TODO_GET_ALL_PATH = "/todos";
export const TODO_GET_BY_DATE_PATH = `/todos/day`;
export const TODO_PUT_PATH = (todoId: number) => `/todos/${todoId}`;
export const TODO_DELETE_PATH = (todoId: number) => `/todos/${todoId}`;

// Reservation
export const RESERVATION_POST_PATH = "/reservations";
export const RESERVATION_ALL_GET_BY_USER_PATH = "/reservations/users/me";
export const RESERVATION_GET_PATH = (reservationId: number) =>
  `/reservations/${reservationId}`;
export const RESERVATION_PUT_PATH = (reservationId: number) =>
  `/reservations/${reservationId}`;
export const RESERVATION_PUT_STATUS_PATH = `/reservations/status`;
export const RESERVATION_GET_AVAILABLE_PROVIDER = `/reservations/available-providers`;
export const RESERVATION_HAS_REVIEW_PATH = (reservationId: number) =>
  `/reservations/${reservationId}/review`;

// Review
export const REVIEW_POST_PATH = "/reviews";
export const REVIEW_GET_BY_PROVIDER_PATH = (providerId: number) =>
  `/reviews/providers/${providerId}`;
export const REVIEW_GET_BY_RESERVATION_PATH = (reservationId: number) =>
  `/reviews/reservations/${reservationId}`;
export const REVIEW_GET_AVG_PATH = (providerId: number) =>
  `/reviews/providers/${providerId}/average`;
export const REVIEW_PUT_PATH = (reservationId: number) =>
  `/reviews/reservations/${reservationId}`;
export const REVIEW_DELETE_PATH = (reviewId: number) => `/reviews/${reviewId}`;
export const REVIEW_GET_LATEST_REVIEW = (providerId: number) =>
  `/reviews/providers/${providerId}/latest`;

// CustomerSupport
export const CUSTOMER_SUPPORT_CREATE_PATH = "/customer-supports/me";
export const CUSTOMER_SUPPORT_GET_ALL_PATH = "/customer-supports/me";
export const CUSTOMER_SUPPORT_GET_PATH = (customerSupportId: number) =>
  `/customer-supports/${customerSupportId}/me`;
export const CUSTOMER_SUPPORT_PUT_PATH = (customerSupportId: number) =>
  `/customer-supports/${customerSupportId}/me`;
export const CUSTOMER_SUPPORT_DELETE_PATH = (customerSupportId: number) =>
  `/customer-supports/${customerSupportId}/me`;

export const DEFAULT_FILE_URL =
  "http://localhost:4040/file/default/defaultImg.png";

// Provision
export const PROVISION_PATH = "/provider/provision";
