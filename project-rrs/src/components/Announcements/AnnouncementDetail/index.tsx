import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Announcement.css";
import { MAIN_URL } from "../../../constants";

interface AnnouncementData {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface APIAnnouncementData {
  announcementId: number;
  announcementTitle: string;
  announcementContent: string;
  announcementCreatedAt: string;
}

export default function AnnouncementDetailPage() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(
    null
  );
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
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get<{ data: APIAnnouncementData }>(
          `${MAIN_URL}/announcements/${id}`
        );
        const data = response.data.data;
        if (data) {
          setAnnouncement({
            id: data.announcementId,
            title: data.announcementTitle,
            content: data.announcementContent,
            date: formatDate(data.announcementCreatedAt),
          });
        } else {
          setAnnouncement(null);
        }
      } catch (e) {
        console.error("Failed to fetch announcement data", e);
        setAnnouncement(null);
      }
    };

    fetchAnnouncement();          
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
        <h1 className="header-style">공지사항</h1>
        {announcement ? (
          <div>
            <h1 className="detail-content-title">{announcement.title}</h1>
            <small className="detail-date-style">게시일: {announcement.date}</small>
            <p className="detail-content-style">{announcement.content}</p>
          </div>
        ) : (
          <div>해당 공지사항을 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}