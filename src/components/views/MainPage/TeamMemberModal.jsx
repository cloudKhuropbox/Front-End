import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Alert,
  Form,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./TeamMemberModal.css";

const API_SERVER = process.env.REACT_APP_API_URL;

function TeamMemberModal({ show, onHide, teamId }) {
  const [members, setMembers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [inviteUserName, setInviteUserName] = useState("");
  const [inviteUserRole, setInviteUserRole] = useState("customer");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
        setMembers(response.data.result);
        const currentUser = response.data.result.find(
          (member) => member.user.id === userId
        );
        setCurrentUserRole(currentUser ? currentUser.role : null);
      }
    } catch (error) {
      alert("멤버를 불러오는 데 실패했습니다.");
      console.error(error);
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
          role: inviteUserRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
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

  const handleRemove = async (userName, role) => {
    try {
      await axios.post(
        `${API_SERVER}/teams/exile`,
        { userName, team: teamId, role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        `${API_SERVER}/teams/leave/${teamId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
        `${API_SERVER}/teams/dissolution/${teamId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
    setInviteUserRole("customer");
    onHide();
  };

  const handleRoleChange = async (userName, newRole) => {
    try {
      const response = await axios.post(
        `${API_SERVER}/teams/updaterole`,
        {
          userName,
          teamId,
          role: newRole,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        fetchTeamMembers();
      } else {
        throw new Error("역할 변경 요청 처리 중 서버에서 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("역할 변경 중 오류가 발생했습니다: " + error.message);
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
        <Modal.Title style={{ fontWeight: "bolder" }}>
          팀 스페이스 관리
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr style={{ fontWeight: "bold" }}>
              <th style={{ width: "33%" }}>멤버</th>
              <th style={{ width: "33%" }}>역할 관리</th>
              <th style={{ width: "34%" }}>멤버 관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.user.id} style={{ height: "50px" }}>
                <td>{member.user.username}</td>
                <td className="align-items-center">
                  {member.role === "owner" ? (
                    "최고관리자"
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {member.role === "admin" ? "관리자" : "일반"}
                      {(currentUserRole === "owner" ||
                        currentUserRole === "admin") &&
                        member.user.id !== userId && (
                          <Dropdown
                            className="ms-2"
                            style={{ marginLeft: "10px" }}
                          >
                            <Dropdown.Toggle
                              variant="third"
                              id="dropdown-basic"
                              size="sm"
                              className="m-1"
                            >
                              변경하기
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="role-dropdown-menu">
                              {member.role === "admin" && (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleRoleChange(
                                      member.user.username,
                                      "customer"
                                    )
                                  }
                                >
                                  일반
                                </Dropdown.Item>
                              )}
                              {member.role === "customer" && (
                                <Dropdown.Item
                                  onClick={() =>
                                    handleRoleChange(
                                      member.user.username,
                                      "admin"
                                    )
                                  }
                                >
                                  관리자
                                </Dropdown.Item>
                              )}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                    </div>
                  )}
                </td>
                <td>
                  {member.user.id === userId && member.role !== "owner" ? (
                    <Button variant="warning" onClick={handleLeave}>
                      탈퇴하기
                    </Button>
                  ) : (
                    member.user.id !== userId &&
                    member.role === "customer" &&
                    currentUserRole !== "customer" && (
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleRemove(member.user.username, member.role)
                        }
                      >
                        추방하기
                      </Button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentUserRole !== "customer" && (
          <InputGroup className="mt-3 invite-group">
            <FormControl
              placeholder="Username to invite"
              value={inviteUserName}
              onChange={(e) => setInviteUserName(e.target.value)}
              className="invite-username"
            />
            <Form.Select
              value={inviteUserRole}
              onChange={(e) => setInviteUserRole(e.target.value)}
              aria-label="Select role"
              className="ml-2 invite-role"
            >
              <option value="customer">일반</option>
              <option value="admin">관리자</option>
            </Form.Select>
            <Button
              variant="primary"
              onClick={handleInvite}
              className="invite-button"
            >
              초대하기
            </Button>
          </InputGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        {currentUserRole === "owner" && (
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
              삭제하기
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
