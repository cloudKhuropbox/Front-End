import axios from "axios";

// const accessToken = localStorage.getItem('access_Token')
const accessToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4YTU1YWZhOC0xZTZiLTQ3MTctYjE0ZS02ZGQ4ZmY0NGJlYWUiLCJpc3MiOiJkZW1vIGFwcCIsImlhdCI6MTcxNTczNzc4MCwiZXhwIjoxNzE1ODI0MTgwfQ.I6YGcTCUFIvkmcvVsJvuqSkyLZ98wtyaFq4IEokoBZ3NnZ0bLFmyrHfmEsYcVPx3OHYzqZOhSOiaOXx-Mw7CCg"

export const client = axios.create({
  baseURL: 'http://182.218.159.76:8081/',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})

export const createFile = async (fileName, file) => {
  const formData = new FormData();
  formData.append("fileName", fileName)
  formData.append("file", file)
  for (let key of formData.keys()){
    console.log(key);
  }
  for (let value of formData.values()){
    console.log(value);
  }
  try{
    console.log('sending api...');
    const response = await client.post('files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteFile = async (id) => {
  try{
    const response = await client.post(`files/delete/${id}`)
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateFile = async (id, newname) => {
  try{
    const response = await client.post(`files/update`,
      {
        'id': id,
        'fileName': newname
      }
    )
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const downloadFile = async (id) => {
  //파일 id로 조회한 뒤에
  //fetch로 다운로드
}

export const loadFiles = async (opt = null) => {
  try{
    const response = await client.get(`files/list/${opt}`)
    console.log(response.data.result);
    return response.data.result
  } catch (error) {
    console.log(error);
  }
}