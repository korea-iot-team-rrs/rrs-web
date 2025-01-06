import { useEffect, useState } from "react";
import { fetchUserInfo } from "../../../apis/userInfo";
import { createComment, deleteCommentFromCommunity, getCommentsByCommunity, updateComment } from "../../../apis/communityCommentApi";
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

const CommentsSection: React.FC<CommentsProps> = ({ communityId, token }) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [currentUserNickname, setCurrentUserNickname] = useState<string | null>(
    null
  );
  const [commentTimes, setCommentTimes] = useState<number[]>([]);
  const [editMode, setEditMode] = useState<{ [id: number]: boolean }>({});
  const [editText, setEditText] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfo = await fetchUserInfo();
        setCurrentUserNickname(userInfo.nickname);
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };

    loadUserInfo();
    fetchComments();
  }, [communityId, token]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCommentsByCommunity(communityId);
      setComments(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setError("Failed to load comments.");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const containsBadWord = (text: string) => {
    const lowerText = text.toLowerCase();
    return BAD_WORDS.some((badWord) =>
      lowerText.includes(badWord.toLowerCase())
    );
  };

  const handleAddComment = async () => {
    if (comments.length >= MAX_TOTAL_COMMENTS) {
      alert(`댓글은 최대 ${MAX_TOTAL_COMMENTS}개까지 작성할 수 있습니다.`);
      return;
    }
    if (!newComment.trim()) return;
    if (containsBadWord(newComment)) {
      alert("비속어가 포함된 댓글은 작성할 수 없습니다.");
      return;
    }
    const now = Date.now();
    const recentTimes = commentTimes.filter((time) => now - time < TIME_WINDOW);
    if (recentTimes.length >= MAX_COMMENTS_IN_WINDOW) {
      alert(
        `연속적으로 최대 ${MAX_COMMENTS_IN_WINDOW}개의 댓글만 작성할 수 있습니다. 잠시 후 다시 시도해주세요.`
      );
      return;
    }

    try {
      const newCommentData = await createComment(communityId, newComment);
      setComments((prevComments) => [...prevComments, newCommentData]);
      setCommentTimes([...recentTimes, now]);
      setNewComment("");
      setShowCommentInput(false);
      setError(null);
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      setError("댓글 등록에 실패했습니다.");
    }
  };

  const handleEditClick = (commentId: number, oldContent: string) => {
    setEditMode((prev) => ({ ...prev, [commentId]: true }));
    setEditText((prev) => ({ ...prev, [commentId]: oldContent }));
  };

  const handleEditCancel = (commentId: number) => {
    setEditMode((prev) => ({ ...prev, [commentId]: false }));
    setEditText((prev) => ({ ...prev, [commentId]: "" }));
  };

  const handleEditSubmit = async (commentId: number) => {
    const updated = editText[commentId] || "";
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
      setEditMode((prev) => ({ ...prev, [commentId]: false }));
      setEditText((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      setError("댓글 수정에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteCommentFromCommunity(communityId, commentId);
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      setError("댓글 삭제에 실패했습니다.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // 만약 엔터키로 댓글을 제출하고 싶다면 아래 주석을 해제하세요.
      // handleAddComment();
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-writebox">
        <strong
          onClick={() => setShowComments(!showComments)}
          className="comment-viewButton"
        >
          댓글 {showComments ? <FaChevronUp /> : <FaChevronDown />}
        </strong>
        <strong className="comment-writeButton">
          <button
            onClick={() => {
              if (comments.length >= MAX_TOTAL_COMMENTS) {
                alert(
                  `댓글은 최대 ${MAX_TOTAL_COMMENTS}개까지 작성할 수 있습니다.`
                );
              } else {
                setShowCommentInput(!showCommentInput);
              }
            }}
          >
            <FaEdit /> 댓글 쓰기
          </button>
        </strong>
      </div>

      {isLoading && <p>Loading comments...</p>}
      {error && <p>{error}</p>}

      {showComments && (
        <div className="comment-list">
          {comments.map((comment) => {
            const isEditing = editMode[comment.commentId] || false;
            return (
              <div key={comment.commentId} className="comment-item">
                <div className="comment-header">
                  <strong className="comment-author">{comment.nickname}</strong>
                </div>
                {isEditing ? (
                  <>
                    <textarea
                      className="comment-edit-textarea"
                      value={editText[comment.commentId] || ""}
                      onChange={(e) =>
                        setEditText((prev) => ({
                          ...prev,
                          [comment.commentId]: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown} // 엔터키 막기
                    />
                    <div className="comment-actions">
                      <button
                        className="comment-viewButton"
                        onClick={() => handleEditSubmit(comment.commentId)}
                        aria-label="댓글 수정 완료"
                      >
                        완료
                      </button>
                      <button
                        className="comment-viewButton"
                        onClick={() => handleEditCancel(comment.commentId)}
                        aria-label="댓글 수정 취소"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="comment-content">
                      {comment.communityContent
                        .split("\n")
                        .map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </div>
                    {currentUserNickname === comment.nickname && (
                      <div className="comment-actions">
                        <button
                          className="comment-viewButton"
                          onClick={() =>
                            handleEditClick(
                              comment.commentId,
                              comment.communityContent
                            )
                          }
                          aria-label="댓글 수정"
                        >
                          수정
                        </button>
                        <button
                          className="comment-viewButton"
                          onClick={() => handleDeleteComment(comment.commentId)}
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

      {showCommentInput && (
        <div className="comment-viewbox">
          <textarea
            className="comment-edit-textarea"
            autoFocus
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown} // 엔터키 막기
            placeholder="댓글을 입력해주세요"
          />
          <button onClick={handleAddComment}>등록</button>
          <button
            onClick={() => {
              setNewComment("");
              setShowCommentInput(false);
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
