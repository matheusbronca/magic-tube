import React from "react";
import { categoryNames as categories } from "@/scripts/seed-categories";
import {
  Car,
  BookOpen,
  Gamepad,
  Film,
  Music,
  Laugh,
  Tv,
  Aperture,
  Newspaper,
  Speech,
  Cat,
  Atom,
  TentTree,
  Volleyball,
} from "lucide-react"; // exemplo de ícones
import { JSX } from "react";

const categoryIcons: Record<(typeof categories)[number], JSX.Element> = {
  "Cars and vehicles": <Car />,
  Comedy: <Laugh />,
  Education: <BookOpen />,
  Gaming: <Gamepad />,
  Entertainment: <Tv />,
  "Film and animation": <Film />,
  "How-to and style": <Aperture />,
  Music: <Music />,
  "News and politics": <Newspaper />,
  "People and blogs": <Speech />,
  "Pets and animals": <Cat />,
  "Science and technology": <Atom />,
  Sports: <Volleyball />,
  "Travel and events": <TentTree />,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: (typeof categories)[number];
  className?: string;
}) {
  const icon = categoryIcons[category];
  if (!icon) return null;

  // Optionally merge with the icon's existing className if needed:
  const combinedClassName = [icon.props.className, className]
    .filter(Boolean)
    .join(" ");

  return React.cloneElement(icon, { className: combinedClassName });
}
