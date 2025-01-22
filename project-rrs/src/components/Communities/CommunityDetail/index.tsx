import React, { useEffect, useState } from "react";
import CommentsSection from "../CommunityComment";
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../utils/auth";
import { fetchUserInfo } from "../../../apis/userInfo";
import { deleteCommunity, getCommunityById } from "../../../apis/communityApi";
import {
  CommunityLikeResponseDto,
  ToggleLikeData,
} from "../../../types/toggleLikeType$";
import {
  getUsersWhoLikedCommunity,
  toggleLike,
} from "../../../apis/toggleKikeApi$.ts";
import { FaHeart, FaThumbsUp } from "react-icons/fa";
import "../../../styles/communities/CommunityDetail.css";
import DefaultImage from "../../../assets/images/dogIllust02.jpeg";
import DeleteModal from "../../../components/DeleteModal";

const BASE_FILE_URL = "http://localhost:4040/";

const removeUUIDFromFileName = (fileName: string): string => {
  return fileName.replace(/^[a-f0-9-]{36}_/, "");
};

const extractFileName = (filePath: string): string => {
  const fullName = filePath.split("/").pop() || "알 수 없는 파일";
  return removeUUIDFromFileName(fullName);
};

interface AttachmentData {
  url: string;
  name: string;
}

interface CommunityData {
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount: number;
  communityContent: string;
  communityThumbnailFile: string | null;
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
                name: extractFileName(attachment),
              })),
            });

            setLikeCount(data.communityLikeCount);

            if (fetchedUserInfo.nickname === data.nickname) {
              setIsAuthor(true);
            } else {
              setIsAuthor(false);
            }

            const usersWhoLiked: CommunityLikeResponseDto[] =
              await getUsersWhoLikedCommunity(Number(id));
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
    <div className="communityDetailContainer">
      <div>
        {community ? (
          <div className="communityDetailContentBox">
            <div className="communityDetailTitle">
              <h1 className="communityDetailHeader">
                {community.communityTitle}
              </h1>
            </div>

            <div className="communityDetailMetaRow">
              <p className="communityDetailAuthor">
                작성자: {community.nickname}
              </p>
              <div className="communityDetailSubActions">
                <div className="communityDetailSubActionsBox">
                  <span className="communityDetailDate">
                    작성일: {community.communityCreatedAt.toLocaleString("ko-KR")}
                  </span>
                  <div className="communityDetailLikeCount">
                    <FaHeart color={userLiked ? "red" : "gray"} size={20} />
                    <span className="communityDetailLikeCountNumber">
                      {likeCount}
                    </span>
                    <FaThumbsUp
                      color={userLiked ? "black" : "gray"}
                      size={20}
                      onClick={handleToggleLike}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
                {isAuthor && (
                  <div className="communityDetailAuthorActions">
                    <button
                      onClick={handleEdit}
                      className="communityDetailEditButton"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="communityDetailDeleteButton"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            <hr />

            <img
              src={community.communityThumbnailFile || DefaultImage}
              alt="Thumbnail"
              style={{ width: "100%", height: "auto" }}
            />
            <hr />

            <p
              className="communityDetailContent"
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: community.communityContent.replace(/\n/g, "<br />"),
              }}
            ></p>

            {community.attachments && community.attachments.length > 0 && (
              <div className="communityDetailAttachmentsDropdown">
                <p>첨부 파일:</p>
                <ul className="communityDetailAttachmentsList">
                  {community.attachments.map((attachment, index) => (
                    <li key={index} className="communityDetailAttachmentItem">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.name}
                      </a>
                    </li>
                  ))}
                </ul>
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
