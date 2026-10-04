import { notFound } from "next/navigation";
import WorkDetail from "@/components/works/WorkDetail";
import { works } from "@/data/works";

export default async function WorkDetailPage({ params }) {
  const { workId } = await params;
  const work = works.find((item) => String(item.id) === String(workId));

  if (!work) notFound();

  return <WorkDetail work={work} />;
}
