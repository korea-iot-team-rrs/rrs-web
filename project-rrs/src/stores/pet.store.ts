import { create } from "zustand";

interface Pet {
  petId: number;
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

interface WalkingRecord {
  recordId: number;
  date: string;
  details: string;
}

interface HealthRecord {
  recordId: number;
  date: string;
  healthDetails: string;
}

interface PetStore {
  pets: Pet[];
  setPets: (pets: Pet[]) => void;  // 펫 리스트 설정
  addWalkingRecord: (petId: number, record: WalkingRecord) => void;
  addHealthRecord: (petId: number, record: HealthRecord) => void;
}

const usePetStore = create<PetStore>((set) => ({
  pets: [],
  setPets: (pets) => set({ pets }),
  addWalkingRecord: (petId, record) => set((state) => {
    const updatedPets = state.pets.map((pet) =>
      pet.petId === petId ? { ...pet, walkingRecords: [...pet.walkingRecords, record] } : pet
    );
    return { pets: updatedPets };
  }),
  addHealthRecord: (petId, record) => set((state) => {
    const updatedPets = state.pets.map((pet) =>
      pet.petId === petId ? { ...pet, healthRecords: [...pet.healthRecords, record] } : pet
    );
    return { pets: updatedPets };
  }),
}));

export default usePetStore;