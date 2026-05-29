import LocationCard from "@/Components/Locations/LocationCard";
import LocationCreateEditModal from "@/Components/Locations/LocationCreateEditModal";
import PageSearchBox from "@/Components/PageSearchBox";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

function Index({ locations }: { locations: PageProps }) {

  const user = usePage().props.auth.user;
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Render

  const renderToolbar = () => (
    <div className="flex gap-2">
      <PageSearchBox routeName="locations.index" placeHolder="Search locations..." />
    </div>
  )

  return (
    <div>
      <PageTitle title="Locations"
        counter={locations.data?.length}
        createButtonDisabled={!user?.has_edit_access}
        onCreateButtonClick={() => setOpenCreateModal(true)}
        toolbar={renderToolbar()}
      />
      <div className="grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {(locations.data?.length ?? 0) > 0 && (
          <>
            {[...(locations.data ?? [])].map((location: any) => (
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
