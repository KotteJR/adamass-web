import UiIconButton from "./UiIconButton";

export default function FilmIntroScroll() {
  return (
    <p className="film-intro-scroll">
      <span data-intro-dissolve data-intro-order="4">
        <UiIconButton icon="down" tone="ghost" decorative />
      </span>
    </p>
  );
}
