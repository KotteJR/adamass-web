// Shapes shared by the content files.

/** Headlines are two lines: the first in one colour, the second in another. */
export type Headline = {
  lead: string;
  rest: string;
};

/** A short key and value, shown as a mono label and plain text. */
export type Spec = {
  label: string;
  value: string;
};

/** A numbered step: "01 Frame. Write the brief first." */
export type Step = {
  title: string;
  /** Short line next to the title. */
  kicker?: string;
  body: string;
};

export type LinkAction = {
  label: string;
  href: string;
};

