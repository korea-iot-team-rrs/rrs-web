import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCommunityById } from "../../../../apis/communityApi";
import CommunityComment from "../CommunityComment/index";
import "../../../../styles/CommunityDetail.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface CommunityData {
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount?: number;
  communityContent: string;
  communityThumbnailUrl: string;
  attachments?: string[];
}

export default function CommunityDetail() {
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1NjAzMzkxLCJleHAiOjE3MzU2MzkzOTF9.thuuJITGeagXvPcMHp2LZ7Q92HsmAgGulijp-2pO5fc";

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

  return (
    <div className="community-detail-container">
      <div>
        {community ? (
          <div className="community-content-box">
            <h2 className="community-detail-header">
              {community.communityTitle}
            </h2>
            <div className="community-sub-header-box">
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
            <CommunityComment
              communityId={community.communityId}
              token={token}
            />
          </div>
        ) : (
          <p>해당 커뮤니티 정보를 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}
