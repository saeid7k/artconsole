import AppLayout from "@/Layouts/AppLayout";
import Search from "antd/es/input/Search";
import { router } from "@inertiajs/react";
import { PageProps } from "@/types";
import UsersTable from "./Partials/UsersTable";

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
    <AppLayout
      title={
        <div className="flex items-center gap-2">
          <div>Users</div>
          <small className="text-muted font-light">({users.total?.toLocaleString()})</small>
        </div>
      }
      actionsBar={
        <Search
          placeholder="search users..."
          style={{ width: 200 }}
          allowClear
          onSearch={handleSearch}
        />
      }
    >
      <UsersTable users={users} />
    </AppLayout>
  )
}

export default UsersIndex;
