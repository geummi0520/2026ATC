export default async function WorkDetailPage({ params }) {
  const { workId } = await params;
  return <h1>Work: {workId}</h1>;
}
