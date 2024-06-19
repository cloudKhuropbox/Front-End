import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/userAtom";
import "./CommentModal.css"; // Import the CSS file

const API_SERVER = process.env.REACT_APP_API_URL;

function CommentModal({ show, onHide, fileId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);

  const token = localStorage.getItem("token");

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_SERVER}/comment/comments/${fileId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setComments(response.data.result);
      }
    } catch (error) {
      alert("Failed to load comments.");
      console.error(error);
    }
  }, [fileId, token]);

  useEffect(() => {
    if (show) {
      fetchComments();
    }
  }, [show, fetchComments]);

  const handleComment = async () => {
    if (!comment) return;
    try {
      console.log({ comment });
      await axios.post(
        `${API_SERVER}/comment/create`,
        { fileId: `${fileId}`, comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      alert("An error occurred while adding the comment.");
    }
    fetchComments();
  };

  const handleDeleteComment = async (id) => {
    try {
      await axios.post(
        `${API_SERVER}/comment/delete/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments();
    } catch (error) {
      alert("An error occurred while deleting the comment.");
      console.error(error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setComment(comment.comment);
  };

  const handleUpdateComment = async () => {
    if (!editingComment) return;
    try {
      await axios.post(
        `${API_SERVER}/comment/update`,
        { id: editingComment.id, comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments();
      setEditingComment(null);
      setComment("");
    } catch (error) {
      alert("An error occurred while updating the comment.");
      console.error(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bolder" }}>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table">
          <thead>
            <tr style={{ fontWeight: "bold" }}>
              <th>Username</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Edited</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.userName}</td>
                <td>{comment.comment}</td>
                <td>{new Date(comment.createdAt).toLocaleString()}</td>
                <td>{comment.updated ? "Edited" : ""}</td>
                <td>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditComment(comment)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="comment-section">
          <h2>{editingComment ? "Edit Comment" : "Add a Comment"}</h2>
          <textarea
            id="commentInput"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
          />
          {editingComment ? (
            <Button
              id="updateCommentBtn"
              onClick={handleUpdateComment}
              variant="primary"
            >
              Update Comment
            </Button>
          ) : (
            <Button
              id="addCommentBtn"
              onClick={handleComment}
              variant="primary"
            >
              Add Comment
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CommentModal;
