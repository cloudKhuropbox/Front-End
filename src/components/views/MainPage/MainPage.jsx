import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FileItem from "./FileItem";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { checkedState, searchQueryTerm } from "../../../recoil/atom";
import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import {
  createFile,
  deleteFile,
  downloadFile,
  updateFileName,
  fetchPersonalFiles,
  fetchTeamFiles,
  restoreFile,
  deleteFilePermanently,
  fetchShareLink,
} from "../../../services/fileCRUD";
import TeamMemberModal from "./TeamMemberModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownWideShort,
  faArrowUpWideShort,
  faUpload,
  faDownload,
  faEdit,
  faTrash,
  faTrashRestore,
  faUsers,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import CopyToClipboard from "react-copy-to-clipboard";

function MainPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [order, setOrder] = useState("이름");
  const [sort, setSort] = useState(true);
  const [curPage, setCurPage] = useState(0);
  const [totalPage, setTotalPage] = useState(5);
  const [files, setFiles] = useState([]);
  const [newName, setNewName] = useState("");
  const fileInputRef = useRef(null);
  const [checked, setChecked] = useRecoilState(checkedState);
  const [curDir, setCurDir] = useState("/");
  const location = useLocation();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryTerm);

  const { teamid } = useParams();

  const isTeamPage = () => {
    return location.pathname.startsWith("/team/");
  };
  const isRecycleBinPage = () => {
    return location.pathname.endsWith("/recycle-bin");
  };

  function loadPersonalFiles() {
    return async () => {
      try {
        const res = await fetchPersonalFiles(
          curPage,
          order,
          sort,
          searchQuery,
          isRecycleBinPage()
        );
        setFiles(res.content);
        setTotalPage(res.totalPages);
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
  }

  function loadTeamFiles() {
    return async () => {
      try {
        const res = await fetchTeamFiles(
          teamid,
          curPage,
          order,
          sort,
          searchQuery,
          isRecycleBinPage()
        );
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
  };

  const uploadFile = (e) => {
    Array.from(e.target.files).forEach((file, idx) => {
      createFile(file, idx);
    });
  };

  const downloadFiles = () => {
    checked.forEach((file) => {
      downloadFile(file.id);
    });
  };

  const handleShowDelete = () => {
    if (Boolean(checked.length)) setShowDelete(true);
  };

  const handleCloseDelete = () => setShowDelete(false);

  const deleteFiles = () => {
    const deleteFn = isRecycleBinPage() ? deleteFilePermanently : deleteFile;
    checked.forEach((file) => {
      deleteFn(file.id).then(() => {
        setShowDelete(false);
        loadPersonalFiles()();
        setChecked([]);
      });
    });
    setChecked([]);
  };

  const handleShowUpdate = () => {
    if (Boolean(checked.length)) {
      setShowUpdate(true);
      console.log(checked[0]);
      setNewName(checked[0].fileName);
    }
    //선택한 파일의 이름 상태로 set
  };
  const handleCloseUpdate = () => setShowUpdate(false);

  const [shareLinks, setShareLinks] = useState([]);
  const handleShowShare = () => {
    if (Boolean(checked.length)) {
      setShowShare(true);

      checked.forEach((file) => {
        fetchShareLink(file.id).then((res) => {
          setShareLinks((prev) => [...prev, res]);
        });
      });
    }
  };
  const handleCloseShare = () => {
    setShowShare(false);
    setShareLinks((prev) => []);
  };

  const updateFile = async () => {
    if (checked.length === 1) {
      updateFileName(checked[0].id, newName).then((res) => {
        setShowUpdate(false);
        loadPersonalFiles()();
        setChecked([]);
      });
    }
  };

  const clickPage = (number) => {
    return (e) => {
      e.preventDefault();
      window.scrollTo(0, 0);
      setCurPage(number);
    };
  };

  const handleRestore = () => {
    checked.forEach((file) => {
      restoreFile(file.id).then(() => {
        loadPersonalFiles()();
        setChecked([]);
      });
    });
  };

  let items = [];
  for (
    let number = curPage - 1;
    items.length < 5 && number <= totalPage;
    number++
  ) {
    if (number > 0) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === curPage + 1}
          onClick={(e) => {
            window.scrollTo(0, 0);
            e.preventDefault();
            setCurPage(number - 1);
          }}
        >
          {number}
        </Pagination.Item>
      );
    }
  }

  useEffect(() => {
    teamid ? loadTeamFiles()() : loadPersonalFiles()();
  }, [curPage, order, sort, searchQuery, teamid, location.pathname]);

  const teamId = location.pathname.split("/")[2];

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleRecycleBin = () => {
    navigate(
      isRecycleBinPage()
        ? location.pathname.replace("/recycle-bin", "")
        : `${location.pathname}/recycle-bin`
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <ActionBar>
        {isTeamPage() && !isRecycleBinPage() && (
          <>
            <ActionBtn variant="outline-primary" onClick={handleShowModal}>
              <FontAwesomeIcon icon={faUsers} /> 팀스페이스 관리
            </ActionBtn>
          </>
        )}
        {Boolean(checked.length) && !isRecycleBinPage() && (
          <ActionBtn variant="outline-primary" onClick={handleShowShare}>
            <FontAwesomeIcon icon={faShareAlt} /> 공유
          </ActionBtn>
        )}
        {!isRecycleBinPage() && (
          <ActionBtn variant="outline-secondary" onClick={handleClickUpload}>
            <FontAwesomeIcon icon={faUpload} /> 업로드
          </ActionBtn>
        )}

        <input
          style={{ display: "none" }}
          type="file"
          ref={fileInputRef}
          onChange={uploadFile}
        ></input>
        {Boolean(checked.length) && !isRecycleBinPage() && (
          <ActionBtn variant="outline-secondary" onClick={downloadFiles}>
            <FontAwesomeIcon icon={faDownload} /> 다운로드
          </ActionBtn>
        )}
        {checked.length === 1 && !isRecycleBinPage() && (
          <ActionBtn variant="outline-secondary" onClick={handleShowUpdate}>
            <FontAwesomeIcon icon={faEdit} /> 이름 변경
          </ActionBtn>
        )}
        {isRecycleBinPage() && (
          <ActionBtn variant="outline-primary" onClick={handleRestore}>
            <FontAwesomeIcon icon={faTrashRestore} /> 복원하기
          </ActionBtn>
        )}
        {Boolean(checked.length) && (
          <ActionBtn variant="outline-danger" onClick={handleShowDelete}>
            <FontAwesomeIcon icon={faTrash} />{" "}
            {isRecycleBinPage() ? "완전히 삭제" : "삭제"}
          </ActionBtn>
        )}
        {/* Delete Modal */}
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header>
            <Modal.Title>정말로 삭제하시겠습니까?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {checked.length}개 항목을{" "}
            {isRecycleBinPage() ? "완전히 삭제하시겠어요?" : "삭제하시겠어요?"}
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_close"
              variant="danger"
              onClick={deleteFiles}
            >
              삭제
            </Button>
            <Button
              className="btn_close"
              variant="secondary"
              onClick={handleCloseDelete}
            >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Update Modal */}
        <Modal show={showUpdate} onHide={handleCloseUpdate}>
          <Modal.Header>
            <Modal.Title>이름 바꾸기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              value={newName}
              onChange={(e) => {
                setNewName((prev) => e.target.value);
              }}
            ></input>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_close"
              variant="primary"
              onClick={updateFile}
            >
              수정
            </Button>
            <Button
              className="btn_close"
              variant="secondary"
              onClick={handleCloseUpdate}
            >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Share Modal */}
        <Modal show={showShare} onHide={handleCloseShare}>
          <Modal.Header>
            <Modal.Title>공유</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table" style={{ tableLayout: "fixed" }}>
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <th style={{ width: "50%" }}>파일명</th>
                  <th style={{ width: "50%" }}>공유 링크</th>
                </tr>
              </thead>
              <tbody>
                {checked.map((file, idx) => (
                  <tr key={file.id}>
                    <td>{file.fileName}</td>
                    <td>
                      {shareLinks[idx] ? (
                        <CopyToClipboard
                          text={shareLinks[idx]}
                          onCopy={() => alert("복사되었습니다.")}
                        >
                          <ActionBtn>복사하기</ActionBtn>
                        </CopyToClipboard>
                      ) : (
                        <Button>링크 생성 중...</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_close"
              variant="secondary"
              onClick={handleCloseShare}
            >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      </ActionBar>
      <BrowseHeader>
        <CurDir>{isRecycleBinPage() ? "휴지통" : "모든 파일"}</CurDir>
        <SortBar>
          <Sort
            onClick={(e) => {
              e.preventDefault();
              setSort(!sort);
            }}
          >
            <FontAwesomeIcon
              style={{ marginRight: "10px" }}
              icon={sort ? faArrowDownWideShort : faArrowUpWideShort}
              size="lg"
            ></FontAwesomeIcon>
            <div>{order}</div>
          </Sort>
          <DropdownButton
            id="dropdown-button-drop-down"
            variant="secondary"
            size="sm"
            title="정렬 기준"
          >
            <Dropdown.Item onClick={(e) => setOrder("최신")}>
              최신순
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setOrder("이름")}>
              이름순
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setOrder("크기")}>
              크기순
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setOrder("형식")}>
              형식순
            </Dropdown.Item>
          </DropdownButton>
          <RecycleBinButton
            onClick={handleRecycleBin}
            variant="outline-secondary"
            size="sm"
          >
            {isRecycleBinPage() ? "모든 파일 보러가기" : "삭제한 파일 보러가기"}
          </RecycleBinButton>
        </SortBar>
      </BrowseHeader>
      <ItemsContainer>
        {files.map((file) => {
          return <FileItem key={file.id} file={file} />;
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
`;

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
`;

const SortBar = styled.div`
  display: flex;
  align-items: center;
`;

const Sort = styled.div`
  display: flex;
  width: 100px;
  cursor: pointer;
`;

const RecycleBinButton = styled(Button)`
  margin-left: 10px;
  &:hover {
    text-decoration: underline;
  }
`;
