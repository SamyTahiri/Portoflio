import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  id?: string;
  children?: ReactNode;
};

export default function SectionHeading({ index, label, title, id, children }: SectionHeadingProps) {
  return (
    <Reveal className="cz-heading">
      <p className="cz-heading__label">
        <span>{index}</span> {label}
      </p>
      <h2 className="cz-heading__title" id={id}>
        {title}
      </h2>
      {children && <p className="cz-heading__lede">{children}</p>}
    </Reveal>
  );
}
