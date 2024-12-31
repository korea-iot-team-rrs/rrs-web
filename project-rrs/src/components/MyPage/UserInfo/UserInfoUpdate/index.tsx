import React, { useState } from 'react'
import '../../../../styles/MyPage.css'
import useAuthStore from '../../../../stores/auth.store'
import { useNavigate } from 'react-router-dom';
import { updateUserInfo } from '../../../../apis/userInfo';

export default function UserInfoUpdate() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: user?.username || '',
    name: user?.name || '',
    nickname: user?.nickname || '',
    address: user?.address || '',
    addressDetail: user?.addressDetail || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImageUrl: user?.profileImageUrl || ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 첫 번째 파일 선택
    if (file) {
      setSelectedFile(file);
      setUserInfo((prevData) => ({
        ...prevData,
        profileImageUrl: file.name, // 파일 이름으로 업데이트 (필요시 서버로 파일 전송 후 URL 업데이트)
      }));
    }
  };

  const goBack = () => {
    window.history.back();
  }

  const validateUserInfo = (): boolean => {
    const nameRegex = /^[가-힣]+$/;
    const phoneRegex = /^[0-9]{11}$/;
    const profileImageUrlRegex = /.*\.(jpg|png)$/;

    if (!userInfo.name) {
      alert('이름을 입력해주세요.');
      return false;
    } else if (!nameRegex.test(userInfo.name)) {
      alert('이름은 한글만 사용할 수 있습니다.');
      return false;
    }

    if (!userInfo.address) {
      alert('주소를 입력해 주세요.');
      return false;
    }

    if (!userInfo.addressDetail) {
      alert('상세 주소를 입력해 주세요.');
      return false;
    }

    if (!userInfo.phone) {
      alert('연락처를 입력해 주세요.');
      return false;
    } else if (!phoneRegex.test(userInfo.phone)) {
      alert('연락처는 11자리 숫자로 입력해 주세요.');
      return false;
    }

    if (!profileImageUrlRegex.test(userInfo.profileImageUrl)) {
      alert('이미지는 jpg 또는 png 형식만 지원됩니다.');
      return false;
    }

    return true;
  };

  const handleOk = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUserInfo()) {
      return;
    }

    console.log("Submitting user info:", userInfo);


    // 유효성 검사사
    // const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,15}$/;
    

    // if (!userInfo.password) {
    //   newError.password = '비밀번호를 입력해 주세요.';
    // } else if (!passwordRegex.test(userInfo.password)) {
    //   newError.password = '비밀번호는 8~15자, 숫자 및 특수문자를 포함해야 합니다.';
    // }

    // if (userInfo.password && userInfo.comfirmPassword !== userInfo.password) {
    //   newError.comfirmPassword = '비밀번호가 일치하지 않습니다.';
    // }

    try {
      if (userInfo.phone === user?.phone) {
        const response = await updateUserInfo({
          name: userInfo.name,
          address: userInfo.address,
          addressDetail: userInfo.addressDetail,
          phone: userInfo.phone,
          profileImageUrl: selectedFile ? selectedFile.name : userInfo.profileImageUrl,
        });
  
        if (response.message === 'NO_MODIFIED_VALUES') {
          alert('변경된 내용이 없습니다.');
        } else {
          alert('회원 정보가 수정되었습니다.');
          navigate('/user/info');
        }
      } else {
        // 전화번호가 변경된 경우 중복 체크
        const response = await updateUserInfo({
          name: userInfo.name,
          address: userInfo.address,
          addressDetail: userInfo.addressDetail,
          phone: userInfo.phone,
          profileImageUrl: selectedFile ? selectedFile.name : userInfo.profileImageUrl,
        });
  
        if (response.message === 'Phone already exists.') {
          alert('이미 등록된 전화번호입니다. 다른 전화번호를 입력해주세요.');
        } else if (response.message === 'NO_MODIFIED_VALUES') {
          alert('변경된 내용이 없습니다.');
        } else {
          alert('회원 정보가 수정되었습니다.');
          navigate('/user/info');
        }
      }
    } catch (error) {
      console.error('Error updating user info', error);
      alert('다시 시도해주세요.');
    }
  };

  return (
    <div>
      <h2>MyPage</h2>
      <form onSubmit={handleOk}>
        <div className='element'>
          <label>개인 프로필 사진</label>
          <input 
            type="file" 
            name='profileImageUrl'
            accept='.jpg,.png'
            onChange={handleFileChange}
          />
        </div>

        <div className='element'>
          <label>아이디</label>
          <input 
            type="text" 
            name='username'
            value={userInfo.username}
            disabled 
          />
        </div>

        {/* <div className='element'>
          <label>새 비밀번호</label>
          <input 
            type="password" 
            name='password'
            value={userInfo.password}
            onChange={handleInputChange}
          />
        </div>

        <div className='element'>
          <label>새 비밀번호 확인</label>
          <input 
            type="password" 
            name='comfirmPassword'
            value={userInfo.comfirmPassword}
            onChange={handleInputChange}
          />
        </div> */}

        <div className='element'>
          <label>이름</label>
          <input 
            type="text" 
            name='name'
            value={userInfo.name}
            onChange={handleInputChange}
          />
        </div>

        <div className='element'>
          <label>닉네임</label>
          <input 
            type="text" 
            name='nickname'
            value={userInfo.nickname}
            disabled 
          />
        </div>

        <div className='element'>
          <label>주소</label>
          <input 
            type="text" 
            name='address'
            value={userInfo.address}
            onChange={handleInputChange}
          />
          <button>주소 검색</button>
        </div>

        <div className='element'>
          <label>상세 주소</label>
          <input 
            type="text" 
            name='addressDetail'
            value={userInfo.addressDetail}
            onChange={handleInputChange}
          />
        </div>

        <div className='element'>
          <label>이메일</label>
          <input 
            type="email" 
            name='email'
            value={userInfo.email}
            disabled 
          />
        </div>

        <div className='element'>
          <label>연락처</label>
          <input 
            type="text" 
            name='phone'
            value={userInfo.phone}
            onChange={handleInputChange}
          />
        </div>

        <button className='ok-button' type='submit'>완료</button>
        <button className='back-button' type='button' onClick={goBack}>취소</button>
      </form>
    </div>
  );
}
