import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Announcement.css";
import { MAIN_URL } from "../../../constants";

interface UsageGuideData {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface APIUsageGuideData {
  guideId: number;
  guideTitle: string;
  guideContent: string;
  guideCreatedAt: string;
}

function UsageGuideDetailPage() {
  const [guide, setGuide] = useState<UsageGuideData | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await axios.get<{ data: APIUsageGuideData }>(
          `${MAIN_URL}/usageGuide/${id}`
        );
        const data = response.data.data;
        if (data) {
          setGuide({
            id: data.guideId,
            title: data.guideTitle,
            content: data.guideContent,
            date: formatDate(data.guideCreatedAt),
          });
        } else {
          setGuide(null);
        }
      } catch (e) {
        console.error("Failed to fetch usage guide data", e);
        setGuide(null);
      }
    };

    fetchGuide();
  }, [id]);

  return (
    <div className="announcement-container">
      <ul className="list-box">
        {["공지사항", "사용방법", "이벤트"].map((menu, index) => (
          <li
            key={index}
            className="list-item"
            onClick={() => {
              switch (menu) {
                case "공지사항":
                  navigate("/announcements");
                  break;
                case "사용방법":
                  navigate("/usage-guide");
                  break;
                case "이벤트":
                  navigate("/events");
                  break;
                default:
                  break;
              }
            }}
          >
            {menu}
          </li>
        ))}
      </ul>
      <div className="content-area">
        <h1 className="header-style">사용방법</h1>
        {guide ? (
          <div>
            <h1 className="detail-content-title">{guide.title}</h1>
            <small className="detail-date-style">게시일: {guide.date}</small>
            <p className="detail-content-style">{guide.content}</p>
          </div>
        ) : (
          <div>해당 사용방법을 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default UsageGuideDetailPage;
