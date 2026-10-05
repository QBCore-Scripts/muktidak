import { CardGridSkeleton } from "@/components/site/Skeletons";

export default function Loading() {
  return <CardGridSkeleton count={6} columns={3} image />;
}
