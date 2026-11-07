
import { notFound } from "next/navigation";
import { programs } from "@/data/program";
import ProgramDetail from "@/components/program/program-detail";

export default async function ProgramDetailPage({ params }) {
    const { programId } = await params;
    const program = programs.find((item) => String(item.id) === String(programId));


    if (!program) notFound();

    return (
        <ProgramDetail
            program={program}
        />
    );
}