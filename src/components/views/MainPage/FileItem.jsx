import { faCheck, faFileExcel, faFilePdf, faFileZipper, faFolder, faImage, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import styled from 'styled-components'
import CommentModal from './CommentModal';
import { checkedState } from '../../../recoil/atom';

export default function FileItem({ file }) {
  const [checked, setChecked] = useRecoilState(checkedState);
  const [isCheck, setIsCheck] = useState(false);
  const [showComments, setShowComments] = useState(false);

  let icon;
  switch (file.fileType){
    case "folder":
      icon = faFolder
      break
    case "img":
      icon = faImage
      break
    case "excel":
      icon = faFileExcel
      break
    case "pdf":
      icon = faFilePdf
      break
    case "zip":
    case "7z":
      icon = faFileZipper
      break
    default:
      icon = faQuestion
  }

  useEffect(()=>{
    if (!checked.includes(file))
      setIsCheck(false)
  }, [checked])

  const handleCloseComments = () => setShowComments(false);

  return (
    <ItemContainer onClick={(e) => {
      setChecked([file])
      setIsCheck(true)
    }} onDoubleClick={(e) => {
      setShowComments(true)
    }}>
      <Hover>
        
      </Hover>
      <IconWrap>
        <CheckBox onClick={(e) => {
          e.stopPropagation()
          if(isCheck)
            {
              const newChecked = checked.filter((_file) => _file !== file)
              setChecked(newChecked)
              setIsCheck(false)
            }
          else
            {
              setChecked((prev) => [...prev, file])
              setIsCheck(true)
            }
        }}>
          {isCheck && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
        </CheckBox>
        <Icon icon={icon} style={{color: "A1C9F7"}}></Icon>
      </IconWrap>
      <CommentModal
        show={showComments}
        onHide={handleCloseComments}
        fileId={file.id}>
      </CommentModal>
      <InfoWrap>
        <Title>{file.fileName}</Title>
        <Info>
          {file.fileType} - {Math.floor(file.fileSize/10000)/100} MB
        </Info>
      </InfoWrap>
    </ItemContainer>
  
  
  )
}

const Hover = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
`

const CheckBox = styled.div`
  position: absolute;
  left: 17%;
  top: 5%;

  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #E4DBD1
  }
`
const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 20%;
  padding: 0 2% 0 2%;
  height: 298px;
  margin-bottom: 10px;

  position: relative;
  cursor: pointer;
`

const IconWrap = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 10;

  width: 100%;
  height: 230px;
  background-color: #F7F5F2;

  &:hover {
    background-color: #EBE9E6
  }

  &:hover ${CheckBox} {
    border: 1px solid black;
  }
`

const Icon = styled(FontAwesomeIcon)`
  width: 115px;
  height: 95px;
`

const InfoWrap = styled.div`
  height: 68px;
  padding: 10px;

  display: flex;
  flex-direction: column;
`

const Title = styled.div`

`

const Info = styled.div`
`