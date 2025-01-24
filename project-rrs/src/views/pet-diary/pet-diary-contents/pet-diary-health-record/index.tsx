import { useEffect, useState } from "react";
import usePetStore, { Pet } from "../../../../stores/usePet.store";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../../../../styles/pet-diary/health-record/healthRecordList.css";
import { PetDiaryTodoProps } from "../../../../types/petDiaryType";
import { FaPlusCircle } from "react-icons/fa";
import HealthRecordCreate from "./health-record-create";
import HealthRecordGet from "./health-record-detail";
import HealthRecordUpdate from "./health-record-update";
import DeleteModal from "../../../../components/delete-modal";
import {
  getAllHealthRecords,
  deleteHealthRecord,
} from "../../../../apis/petHealthApi";
import { useRefreshStore } from "../../../../stores/refresh.store";

export default function PetDiaryHealthRecord({
  selectedDate: initialSelectedDate,
}: PetDiaryTodoProps) {
  const { pets, setPets } = usePetStore();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { incrementRefreshKey } = useRefreshStore();

  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [healthRecordId, setHealthRecordId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialSelectedDate || ""
  );

  const goBack = () => {
    setIsCreating(false);
    setIsFetching(false);
    setIsEditing(false);
  };

  const refreshRecords = async () => {
    if (!selectedPet || !selectedDate) return;

    try {
      const records = await getAllHealthRecords(selectedPet.petId);
      setHealthRecords(
        records.filter((record) => record.createdAt.startsWith(selectedDate))
      );
      incrementRefreshKey();
    } catch (error) {
      console.error("저장된 건강 기록이 없습니다:", error);
    }
  };

  const handleAddHealthRecordClick = () => {
    if (!selectedPet) {
      alert("반려 동물을 선택해 주세요.");
      return;
    }
    setIsCreating(true);
  };

  const handleEditHealthRecordClick = (record: any) => {
    setHealthRecordId(record.healthRecordId);
    setSelectedDate(record.createdAt);
    setIsEditing(true);
  };

  const handleRecordClick = (record: any) => {
    setHealthRecordId(record.healthRecordId);
    setSelectedDate(record.createdAt);
    setIsFetching(true);
  };

  const confirmDeleteRecord = (recordId: number) => {
    setRecordToDelete(recordId);
    setIsModalOpen(true);
  };

  const removeHealthRecord = async () => {
    if (!selectedPet || recordToDelete === null) return;

    try {
      await deleteHealthRecord(selectedPet.petId, recordToDelete);
      setHealthRecords((prev) =>
        prev.filter((record) => record.healthRecordId !== recordToDelete)
      );
      incrementRefreshKey();
    } catch (error) {
      console.error("건강 기록 삭제 실패:", error);
      alert("건강 기록 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsModalOpen(false);
      setRecordToDelete(null);
    }
  };

  const loadPets = async () => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:4040/api/v1/pets", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setPets(data.data || []);
      incrementRefreshKey();
    } catch (error) {
      console.error("반려 동물 정보를 불러오는 중 오류 발생:", error);
      alert("반려 동물 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadPets();
  }, [cookies]);

  useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDate(initialSelectedDate);
    }
  }, [initialSelectedDate]);

  useEffect(() => {
    if (!selectedPet) {
      setHealthRecords([]);
      return;
    }

    setHealthRecords([]);
    refreshRecords();
  }, [selectedPet, selectedDate]);

  return (
    <div>
      {isCreating ? (
        <HealthRecordCreate
          selectedPet={selectedPet}
          selectedDate={selectedDate}
          goBack={goBack}
          addHealthRecord={(newRecord) =>
            setHealthRecords((prev) => [newRecord, ...prev])
          }
        />
      ) : isFetching ? (
        <HealthRecordGet
          selectedPet={selectedPet}
          selectedDate={selectedDate}
          healthRecordId={healthRecordId}
          goBack={goBack}
        />
      ) : isEditing ? (
        <HealthRecordUpdate
          selectedPet={selectedPet}
          healthRecordId={healthRecordId}
          goBack={() => {
            goBack();
            refreshRecords();
          }}
          refreshRecords={refreshRecords}
        />
      ) : (
        <>
          <div className="petHealthSelectContainer">
            {pets.length > 0 ? (
              pets.map((pet) => (
                <button
                  key={pet.petId}
                  className={`petHealthBox ${
                    selectedPet?.petId === pet.petId ? "selectedPet" : ""
                  }`}
                  onClick={() => setSelectedPet(pet)}
                >
                  <div className="petHealthCircleBox">
                    <img src={pet.petImageUrl} alt={`${pet.petName}의 사진`} />
                  </div>
                  <p>{pet.petName}</p>
                </button>
              ))
            ) : (
              <div>
                <p className="no-pets">등록된 반려 동물이 없습니다.</p>
                <button
                  className="add-new-pet"
                  onClick={() => navigate("/user/pet-create")}
                >
                  반려 동물 등록
                </button>
              </div>
            )}
          </div>

          <div className="petHealthMidElement">
            <span>
              {selectedDate && (
                <>
                  {selectedDate.split("-")[0]}년 &nbsp;
                  {selectedDate.split("-")[1]}월 &nbsp;
                  {selectedDate.split("-")[2]}일
                </>
              )}
            </span>

            <button onClick={handleAddHealthRecordClick}>
              추가하기
              <FaPlusCircle size={"1.3em"} />
            </button>
          </div>

          <div className="petHealthRecordList">
            {selectedPet ? (
              healthRecords.length > 0 ? (
                healthRecords.map((record) => (
                  <div
                    key={record.healthRecordId}
                    className="petHealthRecordContainer"
                  >
                    <div
                      className="petHealthRecordDetails"
                      onClick={() => handleRecordClick(record)}
                      style={{ cursor: "pointer" }}
                    >
                      <p className="petHealthRecordlimitedText">
                        증상: {record.abnormalSymptoms}
                      </p>
                      {record.memo && (
                        <p className="petHealthRecordlimitedText">
                          메모: {record.memo}
                        </p>
                      )}
                    </div>
                    <div className="petHealthRecordButtons">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditHealthRecordClick(record);
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteRecord(record.healthRecordId);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="petHealthNoContent">
                  <p>작성된 건강 기록이 없습니다.</p>
                </div>
              )
            ) : (
              <div className="petHealthChoicePet">
                <p className="petHealthChoicePetText">
                  반려 동물을 선택해 주세요.
                </p>
              </div>
            )}
          </div>

          {isModalOpen && (
            <DeleteModal
              onClose={() => setIsModalOpen(false)}
              onConfirm={removeHealthRecord}
            />
          )}
        </>
      )}
    </div>
  );
}
