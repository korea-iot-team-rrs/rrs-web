import { useEffect, useState } from "react";
import "../../../../styles/CommunityDetail.css";
import { BiSolidLike, BiLike } from "react-icons/bi"; // 좋아요 아이콘
import { FaHeart } from "react-icons/fa"; // 하트 아이콘
import { useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../../utils/auth";
import { getCommunityById } from "../../../../apis/communityApi";
import CommentsSection from "../../../Communities/CommunityComment";
interface CommunityData {
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount: number;
  communityContent: string;
  communityThumbnailUrl: string;
  attachments?: string[];
  userLiked: number[]; // 좋아요한 사용자 ID 배열
}

export default function CommunityDetail() {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = getToken();
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const handleToggleLike = async () => {
    // if (!community || !token || loggedInUserId === null) return;

    // try {
    //   const { likeCount, userId } = await toggleLike(community.communityId);
    //   setCommunity((prev) =>
    //     prev
    //       ? {
    //           ...prev,
    //           communityLikeCount: likeCount,
    //           userLiked: userId === loggedInUserId
    //             ? [...prev.userLiked, userId]
    //             : prev.userLiked.filter((id) => id !== userId),
    //         }
    //       : prev
    //   );
    // } catch (e) {
    //   console.error("Failed to toggle like", e);
    // }
    return null;
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (id) {
      const fetchCommunity = async () => {
        try {
          const data = await getCommunityById(Number(id));
          // if (data) {
          //   setCommunity({
          //     ...data,
          //     communityCreatedAt: new Date(data.communityCreatedAt),
          //     communityUpdatedAt: data.communityUpdatedAt
          //       ? new Date(data.communityUpdatedAt)
          //       : undefined,
          //   });
          //   // 현재 로그인된 사용자 ID 설정
          //   // setLoggedInUserId(data.loggedInUserId);
          // } else {
          //   setCommunity(null);
          // }
        } catch (e) {
          console.error("Failed to fetch community data", e);
          setCommunity(null);
        }
      };

      fetchCommunity();
    }
  }, [id, navigate, token]);

  return (
    <div className="community-detail-container">
      <div>
        {community ? (
          <div className="community-content-box">
            <h2 className="community-detail-header">{community.communityTitle}</h2>
            <div className="community-sub-header-box">
              <div className="community-header-p-box">
                <p className="community-detail-date">
                  작성일: {community.communityCreatedAt.toLocaleString("ko-KR")}
                </p>
                <div
                  className="community-detail-likecount"
                  onClick={handleToggleLike}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FaHeart
                    color={loggedInUserId && community.userLiked.includes(loggedInUserId) ? "red" : "gray"}
                    size={15}
                  />
                  <span style={{ fontSize: "18px" }}>{community.communityLikeCount}</span>
                  {loggedInUserId && community.userLiked.includes(loggedInUserId) ? (
                    <BiSolidLike color="black" size={24} />
                  ) : (
                    <BiLike color="gray" size={24} />
                  )}
                </div>
              </div>
              {community.attachments?.map((attachment, index) => (
                <div key={index}>
                  <a href={attachment}>첨부 파일 {index + 1}</a>
                </div>
              ))}
            </div>
            <hr />
            {community.communityThumbnailUrl && (
              <img
                src={community.communityThumbnailUrl}
                alt="Thumbnail"
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <hr />
            <p className="community-detail-content">
              {community.communityContent}
            </p>
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
    </div>
  );
}
