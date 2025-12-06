import AppLayout from "@/Layouts/AppLayout"
import { PageProps } from "@/types"

function Index({ artworks }: { artworks: PageProps }) {
  return (
    <div>
      <pre>{JSON.stringify(artworks.data, null, 2)}</pre>
    </div>
  )
}

Index.layout = (page: any) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export default Index
