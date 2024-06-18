import axios from "axios";

export const client = axios.create({
  baseURL: "http://182.218.159.76:8080/",
});

export const createFile = async (file, idx) => {
  const formData = new FormData();
  formData.append("key", file.name);
  formData.append("fileSize", file.size);

  try {
    //Get upload_url
    const response = await client.post("files/start-upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("presigend url: ", response.data);

    const partArray = response.data;
    const nParts = partArray.length;

    const uploadId = new URL(partArray[0].uploadUrl).searchParams.get(
      "uploadId"
    );

    const chunkInterval = Math.floor(file.size / nParts);
    let chunkedStart = 0;
    let chunkEnd;

    const chunkWithUrlList = partArray.map(({ partNumber, uploadUrl }, i) => {
      if (i === nParts - 1) {
        chunkEnd = file.size;
      } else {
        chunkEnd = chunkedStart + chunkInterval;
      }

      const chunk = file.slice(chunkedStart, chunkEnd);
      chunkedStart = chunkEnd;

      return {
        uploadUrl,
        partNumber,
        chunk,
      };
    });

    const fulfilledList = [];
    const rejectedList = [];

    await Promise.allSettled(
      chunkWithUrlList.map(({ uploadUrl, partNumber, chunk }) =>
        fetch(uploadUrl, {
          method: "PUT",
          body: chunk,
        }).then((res) => {
          console.log(
            `partNumber : ${partNumber} / ETag : ${res.headers.get("ETag")}`
          );
          return {
            partNum: partNumber,
            etag: res.headers.get("ETag").replace(/"/g, ""),
          };
        })
      )
    ).then((res) => {
      console.log(`upload result : ${res}`);
      res.forEach((el) => {
        if (el.status === "fulfilled") {
          fulfilledList.push(el.value);
          return;
        }

        rejectedList.push(el.value);
      });
    });

    const type = ((name) => {
      var len = name.length;
      var dot = name.lastIndexOf(".");
      return name.substring(dot + 1, len);
    })(file.name);

    const completeUpload = await client.post(
      `files/complete-upload?key=${file.name}&uploadId=${uploadId}`,
      {
        fileName: file.name,
        fileKey: file.name,
        fileSize: file.size,
        fileType: type,
        parts: [...fulfilledList],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw error;
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
  try {
    //상세정보에서 다운로드 링크 얻기
    const response = await client.get(`files/info/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(response);
    const download_link = `https://khuropbox2.s3.amazonaws.com/${response.data.result.fileKey}`;
    const fileName = response.data.result.fileName;

    //파일 다운로드
    const download = await axios.get(download_link, { responseType: "blob" });
    const url = URL.createObjectURL(new Blob([download.data]));
    const a = document.createElement("a");
    a.href = url;
    a.style.display = "none";
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchPersonalFiles = async (
  page = 0,
  order = "null",
  sort = true,
  search = "",
  recycleBin = false
) => {
  let orderby = "";
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
};

export const fetchTeamFiles = async (
  teamid,
  page = 0,
  order = "null",
  sort = true,
  search = "",
  recycleBin = false
) => {
  let orderby = "";
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
      `teams/filelist/${teamid}?page=${page}&orderBy=${orderby}&sort=${
        sort ? "DESC" : "ASC"
      }&search=${search}&recycleBin=${recycleBin}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchShareLink = async (fileid) => {
  try {
    const response = await client.get(`files/share-file?fileId=${fileid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
