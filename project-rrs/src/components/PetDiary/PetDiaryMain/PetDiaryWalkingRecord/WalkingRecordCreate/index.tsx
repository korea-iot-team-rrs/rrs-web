import { useState } from 'react';
import { Pet } from '../../../../../types';

interface WalkingRecordCreateProps {
  selectedPet: Pet | null;
}

const WalkingRecordCreate = ({ selectedPet }: WalkingRecordCreateProps) => {
  const [walkingTime, setWalkingTime] = useState('');
  const [memo, setMemo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) {
      alert('반려 동물이 선택되지 않았습니다.');
      return;
    }
    // 산책기록 저장 로직 (여기에서 API 호출 또는 상태 업데이트)
    console.log('산책기록 등록:', { petId: selectedPet.petId, walkingTime, memo });
    alert('산책기록이 저장되었습니다!');
  };

  return (
    <div>
      <h3>{selectedPet?.petName}의 산책기록</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            산책 시간:
            <input
              type="text"
              value={walkingTime}
              onChange={(e) => setWalkingTime(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            산책 내용:
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default WalkingRecordCreate;
