import AppLayout from "@/Layouts/AppLayout";
import Search from "antd/es/input/Search";
import { router } from "@inertiajs/react";
import { PageProps } from "@/types";
import UsersTable from "./Partials/UsersTable";
import PageTitle from "@/Components/PageTitle";

function UsersIndex({ users }: { users: PageProps }) {

  function handleSearch(value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set('search', value);

    router.get(
      route('users.index'),
      Object.fromEntries(params.entries()),
      { preserveScroll: true, preserveState: true }
    );
  }

  return (
    <div>
      <PageTitle
        title="Users"
        counter={users?.total}
        toolbar={
          <Search
            placeholder="search users..."
            style={{ width: 200 }}
            allowClear
            onSearch={handleSearch}
          />
        }
      />
      <UsersTable users={users} />
    </div>
  )
}

UsersIndex.layout = (page: any) => <AppLayout>{page}</AppLayout>;

export default UsersIndex;
