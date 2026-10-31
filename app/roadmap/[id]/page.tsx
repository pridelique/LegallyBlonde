import { notFound } from "next/navigation";
import { PROBLEMS, getProblem } from "@/lib/data/problems";
import RoadmapRunner from "@/components/RoadmapRunner";

export function generateStaticParams() {
  return PROBLEMS.map((p) => ({ id: p.id }));
}

export default function RoadmapPage({ params }: { params: { id: string } }) {
  const p = getProblem(params.id);
  if (!p) notFound();
  return <RoadmapRunner problemId={p.id} />;
}
