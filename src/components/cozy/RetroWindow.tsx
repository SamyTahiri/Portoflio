import type { ReactNode } from "react";
import "./RetroWindow.css";

type RetroWindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
  titleId?: string;
  onClose?: () => void;
};

export default function RetroWindow({ title, children, className, titleId, onClose }: RetroWindowProps) {
  return (
    <div className={`cz-window${className ? ` ${className}` : ""}`}>
      <div className="cz-window__bar">
        <span className="cz-window__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="cz-window__title" id={titleId}>
          {title}
        </span>
        {onClose ? (
          <button type="button" className="cz-window__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        ) : (
          <span className="cz-window__spacer" aria-hidden="true" />
        )}
      </div>
      <div className="cz-window__body">{children}</div>
    </div>
  );
}
