import { create } from "zustand";

export interface Pet {
  petId: number;
  userId: number;
  petName: string;
  petImageUrl: string;
  petGender: string;
  petBirthDate: string;
  petWeight: number;
  petAddInfo: string;
  petNeutralityYn: string;
  walkingRecords: WalkingRecord[];
  healthRecords: HealthRecord[];
}

export interface WalkingRecord {
  walkingRecordId: number;
  walkingRecordDistance: number;
  walkingRecordWalkingTime: number;
  walkingRecordCreateAt: string;
  walkingRecordWeatherState: WalkingRecordWeatherState;
  walkingRecordMemo: string;
  files: File[];
}

export interface CreateWalkingRecord {
  walkingRecordWeatherState: WalkingRecordWeatherState;
  walkingRecordDistance: number;
  walkingRecordWalkingTime: number;
  walkingRecordCreateAt: string;
  walkingRecordMemo: string;
  files: File[];
}

enum WalkingRecordWeatherState {
  SUNNY = "SUNNY",
  CLOUDY = "CLOUDY",
  RAINY = "RAINY",
  SNOWY = "SNOWY",
}

interface WalkingRecordAttachment {
  walkingRecordAttachmentId: number;
  walkingRecordId: number;
  walkingRecordAttachmentFile: string;
}

export interface HealthRecord {
  recordId: number;
  date: string;
  healthDetails: string;
}

interface PetStore {
  pets: Pet[];
  setPets: (pets: Pet[]) => void;
  addWalkingRecord: (petId: number, record: WalkingRecord) => void;
  addHealthRecord: (petId: number, record: HealthRecord) => void;
}

const usePetStore = create<PetStore>((set) => ({
  pets: [] as Pet[],
  setPets: (pets: Pet[]) => set({ pets }),
  addWalkingRecord: (petId, record) =>
    set((state) => {
      const updatedPets = state.pets.map((pet) =>
        pet.petId === petId
          ? { ...pet, walkingRecords: [...pet.walkingRecords, record] }
          : pet
      );
      return { pets: updatedPets };
    }),
  addHealthRecord: (petId, record) =>
    set((state) => {
      const updatedPets = state.pets.map((pet) =>
        pet.petId === petId
          ? { ...pet, healthRecords: [...pet.healthRecords, record] }
          : pet
      );
      return { pets: updatedPets };
    }),
}));

export default usePetStore;
