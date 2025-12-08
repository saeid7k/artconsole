import PageTitle from "@/Components/PageTitle"
import AppLayout from "@/Layouts/AppLayout"
import { PageProps } from "@/types"
import Search from "antd/es/input/Search"
import ArtworksTable from "./Partials/ArtworksTable"
import { useSearch } from "@/hooks/useSearch"

function Index({ artworks }: { artworks: PageProps }) {

  const { handleSearch } = useSearch('artworks.index');

  return (
    <div>
      <PageTitle
        title="Artworks Inventory"
        counter={artworks.total}
        // onCreateButtonClick={() => {}}
        toolbar={
          <Search
            placeholder="search artworks..."
            style={{ width: 200 }}
            allowClear
            onSearch={handleSearch}
          />
        }
      />
      <ArtworksTable artworks={artworks} />
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
