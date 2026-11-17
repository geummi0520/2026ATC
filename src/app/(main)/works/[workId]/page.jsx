import { notFound } from "next/navigation";
import WorkDetail from "@/components/works/WorkDetail";
import { works } from "@/data/works";
import {
  createPageMetadata,
  toMetaDescription,
} from "@/utils/createPageMetadata";

const findWork = (workId) =>
  works.find((item) => String(item.id) === String(workId));

export const generateStaticParams = () =>
  works.map((work) => ({ workId: String(work.id) }));

export async function generateMetadata({ params }) {
  const { workId } = await params;
  const work = findWork(workId);

  if (!work) return {};

  return createPageMetadata({
    title: `${work.title.ko} - ${work.team.ko}`,
    description: toMetaDescription(
      `${work.tagline.ko} ${work.description.ko}`
    ),
    path: `/works/${work.id}`,
    image: work.images.thumbnail,
  });
}

export default async function WorkDetailPage({ params }) {
  const { workId } = await params;
  const work = findWork(workId);

  if (!work) notFound();

  return <WorkDetail work={work} />;
}
