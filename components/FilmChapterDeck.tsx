"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { FilmChapter } from "@/lib/film";
import FilmFactIcon from "./FilmFactIcon";
import ScrollStack, { ScrollStackItem, type ScrollStackHandle } from "./ScrollStack";

export type FilmChapterDeckHandle = {
  setProgress: (progress: number) => void;
};

type FilmChapterDeckProps = {
  chapters: readonly FilmChapter[];
  firstHeading?: boolean;
};

const FilmChapterDeck = forwardRef<FilmChapterDeckHandle, FilmChapterDeckProps>(
  function FilmChapterDeck({ chapters, firstHeading = false }, ref) {
    const stackRef = useRef<ScrollStackHandle>(null);

    useImperativeHandle(ref, () => ({
      setProgress(progress: number) {
        stackRef.current?.setProgress(progress);
      },
    }));

    return (
      <div className="film-dock">
        <ScrollStack
          ref={stackRef}
          className="film-stack"
          itemScale={0.035}
          itemStackDistance={28}
          baseScale={0.9}
        >
          {chapters.map((chapter, index) => {
            const Heading = firstHeading && index === 0 ? "h1" : "h2";
            return (
              <ScrollStackItem
                key={chapter.title}
                itemClassName={`film-card film-card--${index % 2 === 0 ? "white" : "signal"}`}
              >
                <div className="film-chapter">
                  <div className="film-card-copy">
                    <Heading className="film-card-heading">{chapter.title}</Heading>
                    <p className="film-chapter-body">{chapter.body}</p>
                  </div>

                  <ul className="film-facts">
                    {chapter.facts.map((fact) => (
                      <li key={fact.value}>
                        <span className="film-fact-icon">
                          <FilmFactIcon name={fact.icon} />
                        </span>
                        <div>
                          <strong>{fact.value}</strong>
                          <span>{fact.detail}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>
      </div>
    );
  },
);

export default FilmChapterDeck;
