import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/Announcement.css";

interface EventData {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface APIEventData {
  eventId: number;
  eventTitle: string;
  eventContent: string;
  eventCreatedAt: string;
}

function EventDetailPage() {
  const [event, setEvent] = useState<EventData | null>(null);
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
    const fetchEvent = async () => {
      try {
        const response = await axios.get<{ data: APIEventData }>(
          `http://localhost:4040/api/v1/events/${id}`
        );
        const data = response.data.data;
        if (data) {
          setEvent({
            id: data.eventId,
            title: data.eventTitle,
            content: data.eventContent,
            date: formatDate(data.eventCreatedAt),
          });
        } else {
          setEvent(null);
        }
      } catch (e) {
        console.error("Failed to fetch event data", e);
        setEvent(null);
      }
    };

    fetchEvent();
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
                  navigate("/usageGuide");
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
        <h1 className="header-style">이벤트</h1>
        {event ? (
          <div>
            <h1 className="detail-content-title">{event.title}</h1>
            <small className="detail-date-style">게시일: {event.date}</small>
            <p className="detail-content-style">{event.content}</p>
          </div>
        ) : (
          <div>해당 이벤트를 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default EventDetailPage;
