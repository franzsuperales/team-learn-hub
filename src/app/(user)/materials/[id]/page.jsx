import React from "react";
import MaterialDetail from "@/app/components/MaterialDetail";

const MaterialDetailPage = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <MaterialDetail id={id} />
      </main>
    </div>
  );
};

export default MaterialDetailPage;
