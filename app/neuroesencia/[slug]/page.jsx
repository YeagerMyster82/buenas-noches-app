import { notFound } from "next/navigation";
import { NEUROESENCIA, getLessonBySlug, getAdjacentLessons } from "../../../lib/courses";
import LessonViewer from "./lesson-viewer";

export function generateStaticParams() {
  return NEUROESENCIA.modules.flatMap(mod =>
    mod.lessons.map(lesson => ({ slug: lesson.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = getLessonBySlug(NEUROESENCIA, slug);
  if (!result) return {};
  return { title: `${result.lesson.title} | NeuroEsencia` };
}

export default async function LessonPage({ params }) {
  const { slug } = await params;
  const result = getLessonBySlug(NEUROESENCIA, slug);
  if (!result) notFound();

  const { lesson, module: mod } = result;
  const { prev, next } = getAdjacentLessons(NEUROESENCIA, slug);

  return (
    <LessonViewer
      lesson={lesson}
      module={mod}
      prev={prev}
      next={next}
    />
  );
}
