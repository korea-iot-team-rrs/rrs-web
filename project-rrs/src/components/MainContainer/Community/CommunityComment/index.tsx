import React, { useEffect, useState } from "react";
import { getCommentsByCommunity, createComment } from "../../../../apis/communityCommentApi";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { CommunityComment } from "../../../../types/commentType";

interface CommentsProps {
  communityId: number;
  token: string;
}

const CommentsSection: React.FC<CommentsProps> = ({ communityId, token }) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [communityId, token]);

  const fetchComments = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCommentsByCommunity(communityId, token);
      setComments(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("댓글 가져오기 실패:", error);
      setError("댓글을 불러오는 데 실패했습니다.");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await createComment(communityId, newComment, token);
      setComments(prev => [...prev, addedComment]);
      setNewComment("");
      setShowCommentInput(false);
    } catch (error) {
      console.error("Failed to add comment:", error);
      setError("댓글 추가에 실패했습니다.");
    }
  };

  const handleCancelComment = () => {
    setNewComment("");
    setShowCommentInput(false);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  return (
    <div className="comment-section">
      <div className="comment-writebox">
        <strong onClick={toggleComments} className="comment-viewButton">댓글 보기 {showComments ? <FaChevronUp /> : <FaChevronDown />}</strong>
        <strong className="comment-writeButton">
          <button onClick={toggleCommentInput} >
            <FaEdit /> 댓글 쓰기
          </button>
        </strong>
      </div>

      {isLoading ? (
        <p>댓글 로딩 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        showComments && (
          <>
            {comments.map((comment) => (
              <div key={comment.commentId} className="comment-detail">
                <strong className="comment-style">{comment.nickname}:</strong> {comment.communityContent}
              </div>
            ))}
          </>
        )
      )}

      {showCommentInput && (
        <div className="comment-viewbox">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment}>확인</button>
          <button onClick={handleCancelComment}>취소</button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
