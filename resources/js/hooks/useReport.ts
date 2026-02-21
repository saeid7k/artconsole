import { downloadFile } from "@/utils/downloadHelper";

function useReport(report: any) {

  function handleDownload() {
    downloadFile({
      url: route('reports.download', { report: report.id }),
      fileName: report.name + '.pdf'
    })
  }

  return {
    handleDownload,
  }
}

export default useReport
