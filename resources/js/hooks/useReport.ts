import { downloadFile } from "@/utils/downloadHelper";
import { router } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import axios from "axios";

function useReport(report: any) {

  function handleDownload() {
    downloadFile({
      url: route('reports.download', { report: report.id }),
      fileName: report.name + '.pdf'
    })
  }

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(route('reports.destroy', report.id)),
    onSuccess: () => {
      message.success('Report deleted successfully')
      router.reload()
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Failed to delete report')
    },
  })

  return {
    handleDownload,
    deleteMutation
  }
}

export default useReport
