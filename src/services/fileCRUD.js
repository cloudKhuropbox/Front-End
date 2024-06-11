import axios from "axios";

export const client = axios.create({
  baseURL: "http://182.218.159.76:8080/",
});

export const createFile = async (file, idx) => {
  const formData = new FormData()
  formData.append("key", file.name)
  formData.append("fileSize", file.size)

  try{
    //Get upload_url
    const response = await client.post('files/start-upload', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('presigend url: ', response.data)

    const partArray = response.data
    const nParts = partArray.length
    
    const uploadId = (new URL(partArray[0].uploadUrl)).searchParams.get('uploadId');

    const chunkInterval = Math.floor(file.size / nParts)
    let chunkedStart = 0;
    let chunkEnd;

    const chunkWithUrlList = partArray.map(({partNumber, uploadUrl}, i) => {
      if(i === nParts - 1){
        chunkEnd = file.size
      } else {
        chunkEnd = chunkedStart + chunkInterval;
      }

      const chunk = file.slice(chunkedStart, chunkEnd);
      chunkedStart = chunkEnd;

      return {
        uploadUrl,
        partNumber,
        chunk
      }
    })

    const fulfilledList = [];
    const rejectedList = [];

    await Promise.allSettled(chunkWithUrlList.map(
        ({
            uploadUrl,
            partNumber,
            chunk
        }) => fetch(
            uploadUrl, {
                method: 'PUT',
                body: chunk,
            }).then((res) => {
            console.log(`partNumber : ${partNumber} / ETag : ${res.headers.get('ETag')}`)
            return {
                partNum: partNumber,
                etag: res.headers.get('ETag').replace(/"/g, ''),
            }
        })
    )).then((res) => {
        console.log(`upload result : ${res}`)
        res.forEach((el) => {
            if (el.status === 'fulfilled') {
                fulfilledList.push(el.value);
                return;
            }

            rejectedList.push(el.value);
        });
    });
    
    const completeUpload = await client.post(`files/complete-upload?key=${file.name}&uploadId=${uploadId}`, {
      fileName: file.name,
      fileKey: file.name,
      fileSize: file.size,
      fileType: file.type,
      parts: [...fulfilledList]
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
};

export const deleteFile = async (id) => {
  try {
    const response = await client.post(
      `files/recyclebin/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteFilePermanently = async (id) => {
  try {
    const response = await client.post(
      `files/delete/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const restoreFile = async (id) => {
  try {
    const response = await client.post(
      `files/restore/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateFileName = async (id, newname) => {
  try {
    const response = await client.post(
      `files/update`,
      {
        id: id,
        fileName: newname,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const downloadFile = async (id) => {
  //파일 id로 조회한 뒤에
  //fetch로 다운로드
};

export const fetchPersonalFiles = async (page = 0, order = 'null', sort = true, search='', recycleBin = false) => {
  let orderby = ''
  switch (order) {
    case "최신":
      orderby = "";
      break;
    case "이름":
      orderby = "fileName";
      break;
    case "크기":
      orderby = "fileSize";
      break;
    case "형식":
      orderby = "fileType";
      break;
    default:
      orderby = "";
  }

  try {
    const response = await client.get(
      `files/list?page=${page}&orderBy=${orderby}&sort=${
        sort ? "DESC" : "ASC"
      }&search=${search}&recycleBin=${recycleBin}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data.result);
    return response.data.result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchTeamFiles = async (teamid) => {
  try {
    const response = await client.get(`teams/filelist/${teamid}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response.data.result);
    return response.data.result
  } catch (error) {
    console.log(error)
  }
}
