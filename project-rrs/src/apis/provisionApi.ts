// import axios from "axios";
// import { MAIN_URL, PROVISION_PATH } from "../constants";
// import { Provision, ReservationStatus } from "../types/provisionType";

// const PROVISION_API_URL = `${MAIN_URL}${PROVISION_PATH}`;

// export const fetchProvision = async (
//   reservationId: number,
//   token: string
// ): Promise<Provision> => {
//   try {
//     const response = await axios.get(`${PROVISION_API_URL}/${reservationId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const provisionData = response.data.data;
//     console.log(provisionData);

//     const userInfo = provisionData.userInfo || {
//       userId: '',
//       nickname: '',
//       phone: '',
//       address: '',
//       profileImageUrl: '',
//     };

//     return {
//       reservationId: provisionData.reservationId,
//       providerId: provisionData.providerId,
//       reservationStartDate: provisionData.reservationStartDate,
//       reservationEndDate: provisionData.reservationEndDate,
//       reservationMemo: provisionData.reservationMemo,
//       reservationStatus: provisionData.reservationStatus,
//       userInfo: {
//         userId: provisionData.userInfo.userId,
//         nickname: provisionData.userInfo.nickname, 
//         phone: provisionData.userInfo.phone, 
//         address: provisionData.userInfo.address, 
//         profileImageUrl: provisionData.userInfo.profileImageUrl,
//       },
//       pets: provisionData.pets,
//     };
//   } catch (error) {
//     console.log("Error fetching provision data: ", error);
//     throw error;
//   }
// };

// export const fetchProvisionList = async (
//   token: string
// ): Promise<Provision[]> => {
//   const response = await axios.get(`${PROVISION_API_URL}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data.data;
// };

// export const updateReservaionStatus = async (
//   data: {
//     reservationId: number;
//     reservationStatus: ReservationStatus;
//   },
//   token: string
// ) => {
//   const response = await axios.put(
//     `http://localhost:4040/api/v1/reservations/update-reservation-status`,
//     data,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return response.data.data;
// };
export{}