import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { ArtworkProps } from "@/types/artwork";
import { Link } from "@inertiajs/react";
import { Card, Tabs } from "antd";
import React from "react";

function Show ({ artwork }: { artwork: ArtworkProps }) {
  return (
    <div>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('artworks.index')}>Artworks</Link> },
          { title: artwork.title }]}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <Card className="grow">
            gallery
          </Card>
          <Card className="grow">
            details
          </Card>
        </div>
        <Card>
          Tabs
          <Tabs></Tabs>
        </Card>
      </div>
    </div>
  )
}

Show.layout = (page: React.ReactNode) => {
  return (
    <AppLayout children={page} />
  )
}

export default Show;
