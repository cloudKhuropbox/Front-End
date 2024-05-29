import axios from "axios";

export const client = axios.create({
  baseURL: 'http://182.218.159.76:8080/'
})

export const createFile = async (fileName, file) => {
  try{
    console.log('sending api...');
    const response = await client.post('files/get-upload-url', {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteFile = async (id) => {
  try{
    const response = await client.post(`files/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateFileName = async (id, newname) => {
  try{
    const response = await client.post(`files/update`,
      {
        'id': id,
        'fileName': newname
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const downloadFile = async (id) => {
  //파일 id로 조회한 뒤에
  //fetch로 다운로드
}

export const fetchFiles = async (page = 0, order = 'null', sort = 'DESC') => {
  try{
    const response = await client.get(`files/list?page=${page}&order=${order}&sort=${sort}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data.result);
    return response.data.result
  } catch (error) {
    console.log(error);
  }
}
