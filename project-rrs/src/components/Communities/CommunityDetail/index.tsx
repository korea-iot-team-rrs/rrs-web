import React, { useEffect, useState } from "react";
import CommentsSection from "../CommunityComment";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../utils/auth";
import { fetchUserInfo } from "../../../apis/userInfo";
import { deleteCommunity, getCommunityById } from "../../../apis/communityApi";
import { CommunityLikeResponseDto, ToggleLikeData } from "../../../types/ToggleLikeType";
import { getUsersWhoLikedCommunity, toggleLike } from "../../../apis/ToggleKikeApi";
import { FaHeart, FaThumbsUp } from "react-icons/fa";
import "../../../styles/communities/CommunityDetail.css";
import DefaultImage from "../../../assets/images/dogIllust02.jpeg";
import DeleteModal from "../../../components/DeleteModal";

const BASE_FILE_URL = "http://localhost:4040/";

interface AttachmentData {
  url: string;
}

interface CommunityData {
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount: number;
  communityContent: string;
  communityThumbnailFile: string | null; // null 허용
  attachments?: AttachmentData[];
}

interface User {
  userId: number;
  nickname: string;
}

export default function CommunityDetail() {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = getToken();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [likeCount, setLikeCount] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [attachmentsVisible, setAttachmentsVisible] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const fetchedUserInfo = await fetchUserInfo();
        setUserInfo(fetchedUserInfo);

        if (id) {
          const data = await getCommunityById(Number(id));
          if (data) {
            setCommunity({
              ...data,
              communityCreatedAt: new Date(data.communityCreatedAt),
              communityUpdatedAt: data.communityUpdatedAt
                ? new Date(data.communityUpdatedAt)
                : undefined,
              communityThumbnailFile: data.communityThumbnailFile
                ? `${BASE_FILE_URL}${data.communityThumbnailFile}`
                : DefaultImage,
              attachments: data.attachments?.map((attachment: any) => ({
                url: `${BASE_FILE_URL}${attachment}`,
              })),
            });

            setLikeCount(data.communityLikeCount);

            if (fetchedUserInfo.nickname === data.nickname) {
              setIsAuthor(true);
            } else {
              setIsAuthor(false);
            }

            const usersWhoLiked: CommunityLikeResponseDto[] = await getUsersWhoLikedCommunity(Number(id));
            const nicknames = usersWhoLiked.map((user) => user.nickname);

            setUserLiked(nicknames.includes(fetchedUserInfo.nickname));
          } else {
            setCommunity(null);
            setError("해당 커뮤니티 정보를 찾을 수 없습니다.");
          }
        }
      } catch (e) {
        console.error("데이터 가져오기 실패:", e);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, token]);

  const handleToggleLike = async () => {
    if (!id) return;

    try {
      const data: ToggleLikeData = await toggleLike(Number(id));
      setLikeCount(data.likeCount);
      setUserLiked(data.userLiked);
    } catch (e) {
      console.error("좋아요 토글 실패:", e);
      alert("자신이 작성한 게시글에는 좋아요를 누를 수 없습니다.");
    }
  };

  const confirmDelete = async () => {
    if (!community || !token) return;

    try {
      await deleteCommunity(community.communityId);
      alert("커뮤니티 게시글이 삭제되었습니다.");
      navigate("/community");
    } catch (e) {
      console.error("커뮤니티 삭제 실패:", e);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleEdit = () => {
    if (community) {
      navigate(`/community/edit/${community.communityId}`);
    }
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="community-detail-container">
      <div>
        {community ? (
          <div className="community-content-box">
            <h2 className="community-detail-header">
              {community.communityTitle}
            </h2>
            <div className="community-detail-meta">
              <p className="community-detail-author">작성자: {community.nickname}</p>
              {isAuthor && (
                <div className="author-actions">
                  <button onClick={handleEdit} className="edit-button">
                    수정
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="delete-button">
                    삭제
                  </button>
                </div>
              )}
            </div>
            <div className="community-sub-header-box">
              <div className="community-detail-date">
                작성일: {community.communityCreatedAt.toLocaleString("ko-KR")}
              </div>
              <div className="community-detail-likecount">
                <FaHeart color={userLiked ? "red" : "gray"} size={20} />
                <span className="like-count-number">{likeCount}</span>
                <FaThumbsUp
                  color={userLiked ? "black" : "gray"}
                  size={20}
                  onClick={handleToggleLike}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <hr />
            <img
              src={community.communityThumbnailFile || DefaultImage}
              alt="Thumbnail"
              style={{ width: "100%", height: "auto" }}
            />
            <hr />
            <p className="community-detail-content">{community.communityContent}</p>
            {community.attachments && community.attachments.length > 0 && (
              <div className="attachments-dropdown">
                <button
                  className="dropdown-button"
                  onClick={() => setAttachmentsVisible(!attachmentsVisible)}
                >
                  {attachmentsVisible ? "첨부 파일 숨기기 ▲" : "첨부 파일 보기 ▼"}
                </button>
                {attachmentsVisible && (
                  <div className="dropdown-content">
                    {community.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        첨부 파일 {index + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
            {token && (
              <CommentsSection
                communityId={community.communityId}
                token={token}
              />
            )}
          </div>
        ) : (
          <p>해당 커뮤니티 정보를 찾을 수 없습니다.</p>
        )}
      </div>
      {isModalOpen && (
        <DeleteModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
