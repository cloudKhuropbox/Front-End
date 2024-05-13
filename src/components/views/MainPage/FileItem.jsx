import { faCheck, faFileExcel, faFolder, faImage, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import styled from 'styled-components'
import { checkedState } from '../../../recoil/atom';

export default function FileItem({ id, type, name, kind, size }) {
  const [checked, setChecked] = useRecoilState(checkedState);
  const [isCheck, setIsCheck] = useState(false);

  let icon;
  switch (type){
    case "folder":
      icon = faFolder
      break
    case "img":
      icon = faImage
      break
    case "excel":
      icon = faFileExcel
      break
    default:
      icon = faQuestion
  }

  useEffect(()=>{
    if (checked.indexOf(id) == -1)
      setIsCheck(false)
  }, [checked])

  return (
    <ItemContainer onClick={(e) => {
      setChecked([id])
      setIsCheck(true)
    }}>
      <Hover>
        
      </Hover>
      <IconWrap>
        <CheckBox onClick={(e) => {
          e.stopPropagation()
          if(isCheck)
            {
              const newChecked = checked.filter((_id) => _id !== id)
              setChecked(newChecked)
              setIsCheck(false)
            }
          else
            {
              setChecked((prev) => [...prev, id])
              setIsCheck(true)
            }
        }}>
          {isCheck && <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
        </CheckBox>
        <Icon icon={icon} style={{color: "A1C9F7"}}></Icon>
      </IconWrap>
      <InfoWrap>
        <Title>파일 제목{name}</Title>
        <Info>
          파일 종류{kind} - 사이즈{size} KB
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
  left: 15px;
  top: 15px;

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
  width: 230px;
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

  width: 230px;
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