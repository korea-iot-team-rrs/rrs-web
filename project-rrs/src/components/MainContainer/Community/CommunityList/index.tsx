import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import "../../.././../styles/Community.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface CommunityData {
  id: number;
  title: string;
  content: string;
  date: string;
  likeCount: number;
  thumbnailUrl: string;
  updatedAt: string | null;
  nickname: string;
}

const BASE_FILE_URL = "http://localhost:4040/uploads";

export default function CommunityList() {
  const [allData, setAllData] = useState<CommunityData[]>([]);
  const [communityData, setCommunityData] = useState<CommunityData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const navigate = useNavigate();
  const pageSize = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/users/community`
        );
        const data = response.data.data;
        console.log(data);
        setAllData(
          data.map((item: any) => ({
            id: item.communityId,
            title: item.communityTitle,
            content: item.communityContent,
            date: new Date(item.communityCreatedAt).toLocaleString("ko-KR"),
            likeCount: item.communityLikeCount,
            thumbnailUrl: item.communityThumbnailUrl,
            updatedAt: item.communityUpdatedAt
              ? new Date(item.communityUpdatedAt).toLocaleString("ko-KR")
              : null,
            nickname: item.nickname,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filteredData = searchTerm
      ? allData.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allData;

    if (sortOrder === "latest") {
      filteredData.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortOrder === "popular") {
      filteredData.sort((a, b) => b.likeCount - a.likeCount);
    } else if (sortOrder === "oldest") {
      filteredData.sort((a, b) => a.date.localeCompare(b.date));
    }

    const startIndex = (currentPage - 1) * pageSize;
    setCommunityData(filteredData.slice(startIndex, startIndex + pageSize));
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [searchTerm, allData, currentPage, sortOrder]);

  const handleCreateClick = () => {
    navigate('/api/v1/users/community');
  };

  return (
    <div className="community-container">
      <div className="community-search-container">
        <input
          type="text"
          className="search-input"
          placeholder="제목"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="community-button-box">
          <button
            className="community-create-button"
            onClick={handleCreateClick}
          >
            글쓰기 +
          </button>
          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>
      <div className="community-card-container">
        {communityData.map((data) => (
          <div
            className="community-card"
            key={data.id}
            onClick={() => navigate(`/communities/${data.id}`)}
          >
            <div className="community-card-body">
              <h2 className="community-card-title">{data.title}</h2>
              <p className="community-nickname">글쓴이 {data.nickname}</p>
              <div className="community-image-box">
                {data.thumbnailUrl && (
                  <img
                    src={`${BASE_FILE_URL}/${data.thumbnailUrl}`}
                    alt={data.title}
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </div>
              <p className="community-card-content">{data.content}</p>
              <div className="like-and-date-box">
                <p className="community-like-count">
                  {data.likeCount > 0 ? (
                    <FaHeart color="red" className="heart-icon" />
                  ) : (
                    <FaRegHeart color="gray" className="heart-icon" />
                  )}
                  {data.likeCount}
                </p>
                <p className="community-card-date">{`${data.date}`}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="community-pagination-container">
        <Pagination
          pageList={Array.from({ length: totalPages }, (_, i) => i + 1)}
          currentPage={currentPage}
          handlePageClick={(page: number) => setCurrentPage(page)}
          handlePreSectionClick={() =>
            currentPage > 1 && setCurrentPage(currentPage - 1)
          }
          handleNextSectionClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
        />
      </div>
    </div>
  );
}
