import { useEffect, useState } from "react";
import { fetchUserInfo } from "../../../apis/userInfo";
import {
  createComment,
  deleteCommentFromCommunity,
  getCommentsByCommunity,
  updateComment,
} from "../../../apis/communityCommentApi";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { CommunityComment } from "../../../types/commentType";

interface CommentsProps {
  communityId: number;
  token: string;
}

const MAX_COMMENTS_IN_WINDOW = 3;
const TIME_WINDOW = 60000;
const MAX_TOTAL_COMMENTS = 10;

// 욕 필터하는 배열(욕 생각 날때마다 적기?)
const BAD_WORDS = ["개새끼", "씨발", "병신", "꺼져"];

const CommunityDetailCommentsSection: React.FC<CommentsProps> = ({ communityId, token }) => {
  const [communityDetailComments, setCommunityDetailComments] = useState<CommunityComment[]>([]);
  const [communityDetailNewComment, setCommunityDetailNewComment] = useState("");
  const [communityDetailIsLoading, setCommunityDetailIsLoading] = useState(false);
  const [communityDetailError, setCommunityDetailError] = useState<string | null>(null);
  const [communityDetailShowComments, setCommunityDetailShowComments] = useState(false);
  const [communityDetailShowCommentInput, setCommunityDetailShowCommentInput] = useState(false);
  const [communityDetailCurrentUserNickname, setCommunityDetailCurrentUserNickname] = useState<string | null>(null);
  const [communityDetailCommentTimes, setCommunityDetailCommentTimes] = useState<number[]>([]);
  const [communityDetailEditMode, setCommunityDetailEditMode] = useState<{ [id: number]: boolean }>({});
  const [communityDetailEditText, setCommunityDetailEditText] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setCommunityDetailCurrentUserNickname(userInfo.nickname);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };

    loadUserInfo();
    fetchCommunityDetailComments();
  }, [communityId, token]);

  const fetchCommunityDetailComments = async () => {
    setCommunityDetailIsLoading(true);
    setCommunityDetailError(null);
    try {
      const response = await getCommentsByCommunity(communityId);
      setCommunityDetailComments(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setCommunityDetailError("Failed to load comments.");
      setCommunityDetailComments([]);
    } finally {
      setCommunityDetailIsLoading(false);
    }
  };

  const containsBadWord = (text: string) => {
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some((badWord) =>
      lowerText.includes(badWord.toLowerCase())
    );
  };

  const handleCommunityDetailAddComment = async () => {
    if (communityDetailComments.length >= MAX_TOTAL_COMMENTS) {
      alert(`댓글은 최대 ${MAX_TOTAL_COMMENTS}개까지 작성할 수 있습니다.`);
      return;
    }
    if (!communityDetailNewComment.trim()) return;
    if (containsBadWord(communityDetailNewComment)) {
      alert("비속어가 포함된 댓글은 작성할 수 없습니다.");
      return;
    }
    const now = Date.now();
    const recentTimes = communityDetailCommentTimes.filter((time) => now - time < TIME_WINDOW);
    if (recentTimes.length >= MAX_COMMENTS_IN_WINDOW) {
      alert(
        `연속적으로 최대 ${MAX_COMMENTS_IN_WINDOW}개의 댓글만 작성할 수 있습니다. 잠시 후 다시 시도해주세요.`
      );
      return;
    }

    try {
      const newCommentData = await createComment(communityId, communityDetailNewComment);
      setCommunityDetailComments((prevComments) => [...prevComments, newCommentData]);
      setCommunityDetailCommentTimes([...recentTimes, now]);
      setCommunityDetailNewComment("");
      setCommunityDetailShowCommentInput(false);
      setCommunityDetailError(null);
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      setCommunityDetailError("댓글 등록에 실패했습니다.");
    }
  };

  const handleCommunityDetailEditClick = (commentId: number, oldContent: string) => {
    setCommunityDetailEditMode((prev) => ({ ...prev, [commentId]: true }));
    setCommunityDetailEditText((prev) => ({ ...prev, [commentId]: oldContent }));
  };

  const handleCommunityDetailEditCancel = (commentId: number) => {
    setCommunityDetailEditMode((prev) => ({ ...prev, [commentId]: false }));
    setCommunityDetailEditText((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleCommunityDetailEditSubmit = async (commentId: number) => {
    const updated = communityDetailEditText[commentId] || "";
    if (!updated.trim()) {
      alert("수정할 내용이 비어있습니다.");
      return;
    }
    if (containsBadWord(updated)) {
      alert("비속어가 포함된 댓글은 작성할 수 없습니다.");
      return;
    }

    try {
      await updateComment(communityId, commentId, {
        communityCommentContent: updated,
      });
      setCommunityDetailEditMode((prev) => ({ ...prev, [commentId]: false }));
      setCommunityDetailEditText((prev) => ({ ...prev, [commentId]: "" }));
      fetchCommunityDetailComments();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      setCommunityDetailError("댓글 수정에 실패했습니다.");
    }
  };

  const handleCommunityDetailDeleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteCommentFromCommunity(communityId, commentId);
      fetchCommunityDetailComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      setCommunityDetailError("댓글 삭제에 실패했습니다.");
    }
  };

  const handleCommunityDetailKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div className="communityDetailCommentSection">
      <div className="communityDetailCommentWriteBox">
        <strong
          onClick={() => setCommunityDetailShowComments(!communityDetailShowComments)}
          className="communityDetailCommentViewButton"
        >
          댓글 {communityDetailShowComments ? <FaChevronUp /> : <FaChevronDown />}
        </strong>
        <strong className="communityDetailCommentWriteButton">
          <button
            onClick={() => {
              if (communityDetailComments.length >= MAX_TOTAL_COMMENTS) {
                alert(
                  `댓글은 최대 ${MAX_TOTAL_COMMENTS}개까지 작성할 수 있습니다.`
                );
              } else {
                setCommunityDetailShowCommentInput(!communityDetailShowCommentInput);
              }
            }}
          >
            <FaEdit /> 댓글 쓰기
          </button>
        </strong>
      </div>

      {communityDetailIsLoading && <p>Loading comments...</p>}
      {communityDetailError && <p>{communityDetailError}</p>}

      {communityDetailShowComments && (
        <div className="communityDetailCommentList">
          {communityDetailComments.map((comment) => {
            const isEditing = communityDetailEditMode[comment.commentId] || false;
            return (
              <div key={comment.commentId} className="communityDetailCommentItem">
                <div className="communityDetailCommentHeader">
                  <strong className="communityDetailCommentAuthor">{comment.nickname}</strong>
                </div>
                {isEditing ? (
                  <>
                    <textarea
                      className="communityDetailCommentEditTextarea"
                      value={communityDetailEditText[comment.commentId] || ""}
                      onChange={(e) =>
                        setCommunityDetailEditText((prev) => ({
                          ...prev,
                          [comment.commentId]: e.target.value,
                        }))
                      }
                      onKeyDown={handleCommunityDetailKeyDown}
                    />
                    <div className="communityDetailCommentActions">
                      <button
                        className="communityDetailCommentViewButton"
                        onClick={() => handleCommunityDetailEditSubmit(comment.commentId)}
                        aria-label="댓글 수정 완료"
                      >
                        완료
                      </button>
                      <button
                        className="communityDetailCommentViewButton"
                        onClick={() => handleCommunityDetailEditCancel(comment.commentId)}
                        aria-label="댓글 수정 취소"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="communityDetailCommentContent">
                      {comment.communityContent
                        .split("\n")
                        .map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </div>
                    {communityDetailCurrentUserNickname === comment.nickname && (
                      <div className="communityDetailCommentActions">
                        <button
                          className="communityDetailCommentViewButton"
                          onClick={() =>
                            handleCommunityDetailEditClick(
                              comment.commentId,
                              comment.communityContent
                            )
                          }
                          aria-label="댓글 수정"
                        >
                          수정
                        </button>
                        <button
                          className="communityDetailCommentViewButton"
                          onClick={() => handleCommunityDetailDeleteComment(comment.commentId)}
                          aria-label="댓글 삭제"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {communityDetailShowCommentInput && (
        <div className="communityDetailCommentViewBox">
          <textarea
            className="communityDetailCommentEditTextarea"
            autoFocus
            value={communityDetailNewComment}
            onChange={(e) => setCommunityDetailNewComment(e.target.value)}
            onKeyDown={handleCommunityDetailKeyDown}
            placeholder="댓글을 입력해주세요"
          />
          <button onClick={handleCommunityDetailAddComment}>등록</button>
          <button
            onClick={() => {
              setCommunityDetailNewComment("");
              setCommunityDetailShowCommentInput(false);
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityDetailCommentsSection;
