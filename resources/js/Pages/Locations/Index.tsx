import PageTitle from "@/Components/PageTitle";
import { useSearch } from "@/hooks/useSearch";
import AppLayout from "@/Layouts/AppLayout";
import { LocationProps } from "@/types/location";
import Search from "antd/es/input/Search";

function Index({ locations }: { locations: LocationProps[] }) {

  const { handleSearch } = useSearch('locations.index');

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
        counter={locations.length}
        toolbar={renderToolbar()}
      />
      Locations Index Page {locations.length}
    </div>
  )
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default Index;
