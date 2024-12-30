import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../../styles/CommunityDetail.css";
import { getCommunityById } from "../../../../apis/communityApi";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"; // 아이콘 추가

interface CommunityComment {
  nickname: string;
  communityContent: string;
}

interface CommunityData {
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount?: number;
  communityContent: string;
  communityThumbnailUrl: string;
  comments?: CommunityComment[];
  attachments?: string[];
}

export default function CommunityDetail() {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [showComments, setShowComments] = useState(false); // 댓글 보기 상태 추가
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1NTE5NDAxLCJleHAiOjE3MzU1NTU0MDF9.wH69oEiQ_AqnVuRdbXVFlzwvqV4oGxgBF1sIakA3QVw";

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (id) {
      const fetchCommunity = async () => {
        try {
          const data = await getCommunityById(Number(id), token);
          if (data) {
            setCommunity({
              ...data,
              communityCreatedAt: new Date(data.communityCreatedAt),
              communityUpdatedAt: data.communityUpdatedAt
                ? new Date(data.communityUpdatedAt)
                : undefined,
              comments: data.comments,
            });
          } else {
            setCommunity(null);
          }
        } catch (e) {
          console.error("Failed to fetch community data", e);
          setCommunity(null);
        }
      };

      fetchCommunity();
    }
  }, [id, token, navigate]);

  const toggleComments = () => {
    setShowComments(!showComments); // 댓글 보기 상태 토글
  };

  return (
    <div className="community-detail-container">
      <div className="content-area">
        {community ? (
          <div>
            <h2 className="community-detail-header">
              {community.communityTitle}
            </h2>
            <div className="community-sub-header-box">
              <div className="community-sub-header">
                <p className="community-detail-date">
                  작성일: {community.communityCreatedAt.toLocaleString("ko-KR")}
                </p>
                <p className="community-detail-likecount">
                  {community.communityLikeCount &&
                  community.communityLikeCount > 0 ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart color="gray" />
                  )}
                  {community.communityLikeCount}
                </p>
              </div>

              <p>
                {community.attachments?.map((attachment, index) => (
                  <div key={index}>
                    <a href={attachment}>첨부 파일 {index + 1}</a>
                  </div>
                ))}
              </p>
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
            <p>{community.communityContent}</p>
            <div className="comment-section" onClick={toggleComments}>
              <strong>댓글 보기</strong>{" "}
              {showComments ? <FaChevronUp /> : <FaChevronDown />}
              {showComments &&
                community.comments?.map((comment) => (
                  <div key={comment.nickname} className="comment-detail">
                    <strong className="comment-style">
                      {comment.nickname}:
                    </strong>{" "}
                    {comment.communityContent}
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p>해당 커뮤니티 정보를 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}
