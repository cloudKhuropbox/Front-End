import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileItem from "./FileItem";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { checkedState } from "../../../recoil/atom";
import { Button, Form, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { createFile, deleteFile, downloadFile, loadFiles, updateFile } from "../../../services/fileCRUD";

function MainPage() {
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const fileInputRef = useRef(null);
  const [checked, setChecked] = useRecoilState(checkedState);
  const [curDir, setCurDir] = useState("/");
  const location = useLocation();
  const isTeamPage = () => {
    return location.pathname.startsWith("/team/");
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  }

  const uploadFile = (e) => {
    const fileName = e.target.files[0].name;
    const file = URL.createObjectURL(e.target.files[0]);
    
    createFile(fileName, file)
  }

  const downloadFiles = () => {
    checked.forEach((id) => {
      downloadFile(id)
    })
  }

  const handleShowDelete = () => {
      if(Boolean(checked.length))
        setShowDelete(true);
    }
  const handleCloseDelete = () => setShowDelete(false);

  const handleShowUpdate = () => {
      if(Boolean(checked.length))
        setShowUpdate(true);
      //선택한 파일의 이름 상태로 set
    }
  const handleCloseUpdate = () => setShowUpdate(false);
  
  const deleteFiles = () => {
    checked.forEach(id => {
      deleteFile(id)
    })
    setChecked([])
  }

  useEffect(() => {
    const files = loadFiles();
    // state로 보여줘야하는 files들 관리하기
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ActionBar>
        {isTeamPage() && (
          <ActionBtn variant="outline-primary">팀원초대</ActionBtn>
        )}
        {Boolean(checked.length) && <ActionBtn variant="outline-primary">공유</ActionBtn>}
        <ActionBtn variant="outline-secondary" onClick={handleClickUpload}>업로드</ActionBtn>
        <input style={{display: 'none'}} type="file" ref={fileInputRef} onChange={uploadFile}></input>
        {Boolean(checked.length) && <ActionBtn variant="outline-secondary" onClick={downloadFiles}>다운로드</ActionBtn>}
        {Boolean(checked.length) && <ActionBtn variant="outline-secondary" onClick={handleShowDelete}>삭제</ActionBtn>}
        {checked.length===1 && <ActionBtn variant="outline-secondary" onClick={handleShowUpdate}>이름 변경</ActionBtn>}
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header>
            <Modal.Title>정말로 삭제하시겠습니까?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Khuropbox에 있는 {checked.length}개 항목을 삭제하시겠어요?
          </Modal.Body>
          <Modal.Footer>
          <Button className="btn_close" variant="danger" onClick={deleteFiles}>삭제</Button>
          <Button className="btn_close" variant="secondary" onClick={handleCloseDelete}>닫기</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showUpdate} onHide={handleCloseUpdate}>
          <Modal.Header>
            <Modal.Title>이름 바꾸기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control>파일 이름</Form.Control>
          </Modal.Body>
          <Modal.Footer>
          <Button className="btn_close" variant="danger" onClick={deleteFiles}>수정</Button>
          <Button className="btn_close" variant="secondary" onClick={handleCloseUpdate}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </ActionBar>
      <div style={{ display: "flex", width: "100%", height: "50px" }}>
        <CurDir>{curDir === "/" ? "모든 파일" : curDir}</CurDir>
      </div>
      <ItemsContainer>
        {/* map이용해서 files 보여주기 */}
        <FileItem type="folder" id="1"></FileItem>
        <FileItem type="folder" id="2"></FileItem>
        <FileItem type="img" id="3"></FileItem>
        <FileItem type="excel" id="4"></FileItem>
        <FileItem id="5"></FileItem>
      </ItemsContainer>
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
