import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileItem from "./FileItem";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { checkedState } from "../../../recoil/atom";
import { Button, Dropdown, DropdownButton, Form, Modal, Pagination } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import { createFile, deleteFile, downloadFile, updateFileName, fetchFiles } from "../../../services/fileCRUD";
import TeamMemberModal from "./TeamMemberModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [order, setOrder] = useState('이름')
  const [sort, setSort] = useState(true)
  const [curPage, setCurPage] = useState(0);
  const [totalPage, setTotalPage] = useState(5);
  const [files, setFiles] = useState([]);
  const [newName, setNewName] = useState('');
  const fileInputRef = useRef(null);
  const [checked, setChecked] = useRecoilState(checkedState);
  const [curDir, setCurDir] = useState("/");
  const location = useLocation();

  const { teamid } = useParams();
  console.log(teamid);

  const isTeamPage = () => {
    return location.pathname.startsWith("/team/");
  };

  function loadFiles() {
    return async () => {
      try {
        const res = await fetchFiles(curPage, order, sort);
        setFiles(res.content);
        setTotalPage(res.totalPages);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
  }

  const handleClickUpload = () => {
    fileInputRef.current.click();
  }

  const uploadFile = (e) => {
    const fileName = e.target.files[0].name;
    const file = URL.createObjectURL(e.target.files[0]);
    
    createFile(fileName, file)
  }

  const downloadFiles = () => {
    checked.forEach((file) => {
      downloadFile(file.id)
    })
  }

  const handleShowDelete = () => {
      if(Boolean(checked.length))
        setShowDelete(true);
    }

  const handleCloseDelete = () => setShowDelete(false);

  const deleteFiles = () => {
    checked.forEach(file => {
      deleteFile(file.id).then(() => {
        setShowDelete(false);
        (loadFiles())();
        setChecked([])
      })
    })
    setChecked([])
  }

  const handleShowUpdate = () => {
      if(Boolean(checked.length)){
        setShowUpdate(true);
        console.log(checked[0]);
        setNewName(checked[0].fileName)
      }
      //선택한 파일의 이름 상태로 set
    }
  const handleCloseUpdate = () => setShowUpdate(false);

  const handleShowComments = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('double clicked');
    setShowComments(true)
  }

  const handleCloseComments = () => setShowComments(false)

  const updateFile = async () => {
    if (checked.length === 1){
      updateFileName(checked[0].id, newName).then((res) => {
        setShowUpdate(false);
        (loadFiles())();
        setChecked([])
      })
    }
    
  }

  const clickPage = (number) => {
    return (e) => {
      e.preventDefault();
      window.scrollTo(0, 0)
      setCurPage(number);
    };
  }

  let items = [];
  for (let number = curPage - 1; (items.length <5) && (number <= totalPage) ; number++) {
    if (number > 0){
      items.push(
        <Pagination.Item key={number} active={number === curPage + 1} onClick={clickPage(number)}>
          {number}
        </Pagination.Item>
      )
    }
  }


  useEffect(() => {
    (loadFiles())();
  }, [curPage, order, sort])

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
            <input value={newName} onChange={(e) => {
              setNewName(prev => e.target.value)
            }}></input>
          </Modal.Body>
          <Modal.Footer>
          <Button className="btn_close" variant="primary" onClick={updateFile}>수정</Button>
          <Button className="btn_close" variant="secondary" onClick={handleCloseUpdate}>닫기</Button>
          </Modal.Footer>
        </Modal>
      </ActionBar>
      <BrowseHeader>
        <CurDir>{curDir === "/" ? "모든 파일" : curDir}</CurDir>
        <SortBar>
          <Sort onClick={(e) => {
            e.preventDefault();
            setSort(!sort)
          }}>
            <FontAwesomeIcon style={{marginRight: '10px'}} icon={sort ? faArrowDownWideShort : faArrowUpWideShort} size="lg"></FontAwesomeIcon>
            <div>{order}</div>
          </Sort>
          <DropdownButton id="dropdown-button-drop-down" variant="secondary" size="sm" title="정렬 기준">
            <Dropdown.Item onClick={(e) => setOrder('최신')}>최신순</Dropdown.Item>
            <Dropdown.Item onClick={(e) => setOrder('이름')}>이름순</Dropdown.Item>
            <Dropdown.Item onClick={(e) => setOrder('크기')}>크기순</Dropdown.Item>
            <Dropdown.Item onClick={(e) => setOrder('형식')}>형식순</Dropdown.Item>
          </DropdownButton>
        </SortBar>
      </BrowseHeader>
      <ItemsContainer>
        {files.map((file) => {
          return (
          <FileItem key={file.id} file={file} setShowComments={setShowComments}/>)
        })}
      </ItemsContainer>
      <PaginationWrapper>
        <Pagination size="lg">{items}</Pagination>
      </PaginationWrapper>
      <TeamMemberModal
        show={showModal}
        onHide={handleCloseModal}
        teamId={teamId}
      />

      {/* 댓글 모달 창 */}
      <Modal show={showComments} onHide={handleCloseComments}>
      <Modal.Header>
          <Modal.Title>댓글</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
      </Modal>
    </div>
  );

  
}

export default MainPage;

const ActionBar = styled.div`
  display: flex;
  margin-bottom: 16px;
  margin-left: 20px;
`;
const ActionBtn = styled(Button)`
  margin-right: 8px;
`;

const BrowseHeader = styled.div`
  display: flex;
  flex-direction: column;
  height: 100px;

  margin: 0px 20px 20px 20px;

  padding-bottom: 5px;
  border-bottom: 1px solid black;
`

const CurDir = styled.div`
  font-size: 30px;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  
  margin-top: 20px;
`

const SortBar = styled.div`
  display: flex;
  align-items: center;
`

const Sort = styled.div`
  display: flex;
  width: 100px;

  cursor: pointer;
`