import { message } from "antd"
import axios from "axios"

type Params = {
  url: string
  fileName?: string | null
}

function downloadFile({ url, fileName = null }: Params) {
  message.loading({ content: 'Downloading file...', key: 'download-image' });
  axios.get(url, {
    responseType: 'blob',
  })
    .then((response) => {
      downloadBlob({
        data: response.data,
        responseHeaders: response.headers,
        fileName: fileName
      });
      message.success({ content: 'File downloaded successfully', key: 'download-image' });
    })
    .catch((err) => {
      message.error({ content: err?.response?.data?.message || 'Failed to download file', key: 'download-image' });
    });
}

function downloadBlob({ data, responseHeaders, fileName }: { data: Blob, responseHeaders?: any, fileName?: string | null }) {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  if (!fileName && responseHeaders) {
    const disposition = responseHeaders['content-disposition']
    if (disposition && disposition.indexOf('filename=') !== -1) {
      fileName = disposition.split('filename=')[1].replace(/"/g, '').trim()
    }
  }
  link.setAttribute('download', fileName || 'download')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export { downloadBlob, downloadFile }

