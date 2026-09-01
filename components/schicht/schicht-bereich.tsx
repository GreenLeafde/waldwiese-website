"use client";

import { useCallback, useEffect, useState } from "react";
import { holeDienstAction } from "@/app/actions/schicht";
import { Dienst, type DienstPerson } from "@/components/schicht/dienst";
import { SchichtListe } from "@/components/schicht/schicht-liste";
import type { Kommentar, Tagesaufgabe } from "@/lib/aufgaben";
import type { Schicht } from "@/lib/schichten";

/** Mehrere Geraete an derselben Schicht — regelmaessig nachsehen, wer da ist. */
const ABGLEICH_MS = 8000;

type Props = {
  datum: string;
  schicht: Schicht;
  aufgaben: Tagesaufgabe[];
  kommentare: Record<string, Kommentar[]>;
  mitarbeiter: string[];
  imDienst: DienstPerson[];
  /** false = die Aufgaben gehören zu einem anderen Tag als heute. */
  istHeute: boolean;
};

export function SchichtBereich({
  datum,
  schicht,
  aufgaben,
  kommentare,
  mitarbeiter,
  imDienst,
  istHeute,
}: Props) {
  const [dienst, setDienst] = useState(imDienst);
  const [ich, setIch] = useState("");

  useEffect(() => setDienst(imDienst), [imDienst]);

  const abgleichen = useCallback(async () => {
    try {
      setDienst(await holeDienstAction());
    } catch {
      /* offline — beim naechsten Mal wieder */
    }
  }, []);

  useEffect(() => {
    const id = setInterval(abgleichen, ABGLEICH_MS);
    return () => clearInterval(id);
  }, [abgleichen]);

  // Ist nur eine Person im Dienst, ist die Frage "wer bist du?" beantwortet.
  useEffect(() => {
    if (dienst.length === 1) setIch(dienst[0].name);
    else if (ich && !dienst.some((d) => d.name === ich)) setIch("");
  }, [dienst, ich]);

  const merken = useCallback((name: string) => {
    setIch(name);
    // Sofort nachsehen statt auf den naechsten Abgleich zu warten.
    holeDienstAction()
      .then(setDienst)
      .catch(() => {});
  }, []);

  return (
    <>
      <Dienst
        mitarbeiter={mitarbeiter}
        imDienst={dienst}
        datum={datum}
        schicht={schicht}
        ich={ich}
        onIch={merken}
      />

      {dienst.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
          <p className="font-display text-xl text-waldgruen">Noch niemand im Dienst</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-waldgruen/55">
            Starte oben deine Schicht — danach siehst du, was heute zu tun ist.
          </p>
        </div>
      ) : !ich ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-waldgruen/10">
          <p className="font-display text-xl text-waldgruen">Wer bist du?</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-waldgruen/55">
            Tippe oben auf deinen Namen. Dann wird festgehalten, wer was erledigt hat.
          </p>
        </div>
      ) : (
        <>
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-waldgruen/45">
            Aufgaben
          </h2>
          {!istHeute && (
            <p className="mb-3 text-sm text-waldgruen/50">
              Du siehst einen anderen Tag als heute.
            </p>
          )}
          <SchichtListe
            datum={datum}
            schicht={schicht}
            aufgaben={aufgaben}
            kommentare={kommentare}
            ich={ich}
          />
        </>
      )}
    </>
  );
}
