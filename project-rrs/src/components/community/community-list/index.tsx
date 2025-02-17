import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommunity } from "../../../apis/communityApi";
import "../../../styles/community/community.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import LoginModal from "../../login-modal";
import DefaultImage from "../../../assets/images/dogIllust02.jpeg";
import useAuthStore from "../../../stores/useAuth.store";
import CommunityPagination from "../communityPagination";

interface CommunityData {
  id: number;
  title: string;
  content: string;
  date: string;
  likeCount: number;
  thumbnailFile: string | null;
  updatedAt: string | null;
  nickname: string;
}

const BASE_FILE_URL = "http://localhost:4040/";

function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export default function CommunityList() {
  const [allData, setAllData] = useState<CommunityData[]>([]);
  const [communityData, setCommunityData] = useState<CommunityData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("latest");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const pageSize = 6;
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getCommunity();
        console.log(data);
        setAllData(
          data.map((item: any) => ({
            id: item.communityId,
            title: item.communityTitle,
            content: item.communityContent,
            date: new Date(item.communityCreatedAt).toLocaleString("ko-KR"),
            likeCount: item.communityLikeCount,
            thumbnailFile: item.communityThumbnailFile,
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
    const slicedData = filteredData.slice(startIndex, startIndex + pageSize);
    setCommunityData(slicedData);
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [searchTerm, allData, currentPage, sortOrder]);

  const handleCreateClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate("/community/write");
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreSectionClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextSectionClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const containerClassName =
    communityData.length <= 3
      ? "community-card-container one-row"
      : "community-card-container";

  return (
    <div className="community-container">
      {showLoginModal && <LoginModal onClose={handleCloseModal} />}

      <div className="community-search-container">
        <div className="community-search-input-wrapper">
          <input
            type="text"
            className="community-search-input"
            placeholder="제목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IoSearch className="comunity-search-icon" />
        </div>

        <div className="community-button-box">
          <button
            className="community-create-button"
            onClick={handleCreateClick}
          >
            글쓰기 +
          </button>
          <select
            className="community-sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>

      <div className={containerClassName}>
        {communityData.map((data) => (
          <div
            className="community-card"
            key={data.id}
            onClick={() => {
              if (!isLoggedIn) {
                setShowLoginModal(true);
              } else {
                navigate(`/community/${data.id}`);
              }
            }}
          >
            <div className="community-card-body">
              <h2 className="community-card-title">{data.title}</h2>
              <p className="community-nickname">{`글쓴이: ${data.nickname}`}</p>
              <div className="community-image-box">
                <img
                  src={
                    data.thumbnailFile
                      ? `${BASE_FILE_URL}${data.thumbnailFile}`
                      : DefaultImage
                  }
                  alt={truncateText(data.title, 15)}
                />
              </div>
              <p className="community-card-content">
                {truncateText(data.content, 100)}
              </p>
              <div className="like-and-date-box">
                <p className="community-like-count">
                  {data.likeCount > 0 ? (
                    <FaHeart color="red" className="heart-icon" />
                  ) : (
                    <FaRegHeart color="gray" className="heart-icon" />
                  )}
                  {data.likeCount}
                </p>
                <p className="community-card-date">{data.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="community-pagination-container">
        <CommunityPagination
          pageList={Array.from({ length: totalPages }, (_, i) => i + 1)}
          currentPage={currentPage}
          handlePageClick={handlePageClick}
          handlePreSectionClick={handlePreSectionClick}
          handleNextSectionClick={handleNextSectionClick}
        />
      </div>
    </div>
  );
}
