import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_SERVER } from "./../../../config/apiConfig";
import { Modal, Button, InputGroup, FormControl, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TeamMemberModal({ show, onHide, teamId }) {
  const [members, setMembers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [inviteUserName, setInviteUserName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  // const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_SERVER}/teams/memberlist/${teamId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMembers(response.data);
        const currentUser = members.find((member) => member.id === userId);
        setCurrentUserRole(currentUser ? currentUser.role : null);
      }
    } catch (error) {
      alert("멤버를 불러오는 데 실패했습니다.");
    }
  }, [teamId, token, userId]);

  useEffect(() => {
    if (show) {
      fetchTeamMembers();
    }
  }, [show, fetchTeamMembers]);

  const refreshTeamList = () => {
    window.dispatchEvent(new CustomEvent("refreshTeamList"));
  };

  const handleInvite = async () => {
    if (!inviteUserName) return;
    try {
      await axios.post(
        `${API_SERVER}/teams/join`,
        {
          userName: inviteUserName,
          team: teamId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTeamMembers();
      setInviteUserName("");
    } catch (error) {
      alert("멤버 초대 중 문제가 발생했습니다.");
      setInviteUserName("");
    }
  };

  const handleRemove = async (userName) => {
    try {
      await axios.post(
        `${API_SERVER}/teams/exile`,
        { userName, team: teamId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTeamMembers();
    } catch (error) {
      alert("멤버 추방 중 문제가 발생했습니다.");
    }
  };

  const handleLeave = async () => {
    try {
      const response = await axios.post(
        `${API_SERVER}/teams/leave`,
        { teamId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        alert("탈퇴가 완료되었습니다.");
        refreshTeamList();
        navigate("/personal");
      }
      onHide();
    } catch (error) {
      alert("탈퇴 처리 중 문제가 발생했습니다.");
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await axios.post(
        `${API_SERVER}/teams/dissolution`,
        { teamId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("팀이 성공적으로 삭제되었습니다.");
      setShowDeleteConfirm(false);
      refreshTeamList();
      navigate("/personal");
      onHide();
    } catch (error) {
      alert("팀 해체 중 문제가 발생했습니다.");
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const resetAndClose = () => {
    setInviteUserName("");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: "bolder" }}>
          팀 스페이스 관리
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table">
          <thead>
            <tr style={{ fontWeight: "bold" }}>
              <th>멤버</th>
              <th>역할</th>
              <th>멤버 관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.username}</td>
                <td>{member.role === "admin" ? "관리자" : "일반"}</td>
                <td>
                  {member.id === userId ? (
                    <Button variant="warning" onClick={handleLeave}>
                      탈퇴
                    </Button>
                  ) : (
                    // currentUserRole === "admin" &&
                    <Button
                      variant="danger"
                      onClick={() => handleRemove(member.username)}
                    >
                      추방
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentUserRole === "admin" && (
          <InputGroup className="mt-3">
            <FormControl
              placeholder="Username to invite"
              value={inviteUserName}
              onChange={(e) => setInviteUserName(e.target.value)}
            />
            <Button variant="primary" onClick={handleInvite}>
              초대하기
            </Button>
          </InputGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentUserRole === "admin" && (
          <Button variant="danger" onClick={confirmDelete}>
            팀 삭제하기
          </Button>
        )}
        <Button variant="secondary" onClick={resetAndClose}>
          닫기
        </Button>
      </Modal.Footer>
      {showDeleteConfirm && (
        <Alert
          style={{
            backgroundColor: "#f7f5f2",
            color: "#495057",
            borderColor: "#e1e1e1",
          }}
          onClose={() => setShowDeleteConfirm(false)}
          dismissible
        >
          <Alert.Heading style={{ fontWeight: "bold" }}>
            정말로 팀을 삭제하시겠습니까?
          </Alert.Heading>
          <div className="d-flex justify-content-end">
            <Button
              onClick={handleDeleteTeam}
              variant="outline-danger"
              style={{ marginRight: "10px" }}
            >
              삭제
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="outline-secondary"
            >
              닫기
            </Button>
          </div>
        </Alert>
      )}
    </Modal>
  );
}

export default TeamMemberModal;