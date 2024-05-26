import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileItem from "./FileItem";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { checkedState } from "../../../recoil/atom";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import TeamMemberModal from "./TeamMemberModal";

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useRecoilState(checkedState);
  const [curDir, setCurDir] = useState("/");
  const location = useLocation();

  const isTeamPage = () => {
    return location.pathname.startsWith("/team/");
  };

  const teamId = location.pathname.split("/")[2];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ActionBar>
        {isTeamPage() && (
          <>
            <ActionBtn variant="outline-primary" onClick={handleShowModal}>
              팀스페이스 관리
            </ActionBtn>
          </>
        )}
        <ActionBtn variant="outline-secondary">공유</ActionBtn>
        <ActionBtn variant="outline-secondary">업로드</ActionBtn>
        <ActionBtn variant="outline-secondary">다운로드</ActionBtn>
        <ActionBtn variant="outline-secondary">삭제</ActionBtn>
      </ActionBar>
      <div style={{ display: "flex", width: "100%", height: "50px" }}>
        <CurDir>{curDir === "/" ? "모든 파일" : curDir}</CurDir>
      </div>
      <ItemsContainer>
        <FileItem type="folder" id="1"></FileItem>
        <FileItem type="folder" id="2"></FileItem>
        <FileItem type="img" id="3"></FileItem>
        <FileItem type="excel" id="4"></FileItem>
        <FileItem id="5"></FileItem>
      </ItemsContainer>
      <TeamMemberModal
        show={showModal}
        onHide={handleCloseModal}
        teamId={teamId}
      />
    </div>
  );
}

export default MainPage;

const ActionBar = styled.div`
  display: flex;
  margin-bottom: 16px;
`;
const ActionBtn = styled(Button)`
  margin-right: 8px;
`;
const CurDir = styled.div`
  font-size: 30px;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
