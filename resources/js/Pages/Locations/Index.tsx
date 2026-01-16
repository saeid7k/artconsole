import LocationCard from "@/Components/Locations/LocationCard";
import LocationCreateEditModal from "@/Components/Locations/LocationCreateEditModal";
import PageTitle from "@/Components/PageTitle";
import { useSearch } from "@/hooks/useSearch";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import Search from "antd/es/input/Search";
import { useState } from "react";

function Index({ locations }: { locations: PageProps }) {

  const { handleSearch } = useSearch('locations.index');
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Render

  const renderToolbar = () => (
    <div className="flex gap-2">
      <Search
        placeholder="search locations..."
        style={{ width: 200 }}
        size="middle"
        allowClear
        onSearch={handleSearch}
      />
    </div>
  )

  return (
    <div>
      <PageTitle title="Locations"
        counter={locations.data.length}
        onCreateButtonClick={() => setOpenCreateModal(true)}
        toolbar={renderToolbar()}
      />
      <div className="grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {locations.data.length > 0 && (
          <>
            {[...locations.data].map((location: any) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </>
        )}
      </div>

      <LocationCreateEditModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        mode="create"
      />
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default Index;
