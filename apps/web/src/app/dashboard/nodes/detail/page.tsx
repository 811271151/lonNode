"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import NodeDetail from "@/components/nodes/node-detail";

function NodeDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return <p className="p-8">缺少节点 ID，请返回节点列表。</p>;
  }

  return <NodeDetail id={id} key={id} />;
}

export default function NodeDetailPage() {
  return (
    <Suspense fallback={<p className="p-8">正在加载……</p>}>
      <NodeDetailContent />
    </Suspense>
  );
}