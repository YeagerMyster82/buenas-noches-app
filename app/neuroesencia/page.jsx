import { redirect } from "next/navigation";
import { NEUROESENCIA } from "../../lib/courses";

export default function NeuroEsenciaIndex() {
  const firstSlug = NEUROESENCIA.modules[0].lessons[0].slug;
  redirect(`/neuroesencia/${firstSlug}`);
}
