"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import s from "./styles.module.css";
import { lerp } from "@/lib/math";
import gsap from "gsap";

export default function Page() {
  const [snap, setSnap] = useState<null | {
    x: number;
    y: number;
    w: number;
    h: number;
  }>(null);
  const mouseRef = useRef<HTMLDivElement>(null);

  const cursorPosRef = useRef({
    x: 0,
    y: 0,
  });

  const cursorTargetRef = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const callback: gsap.TickerCallback = (time, deltaTime) => {
      if (snap) {
        cursorPosRef.current.x = lerp(
          cursorPosRef.current.x,
          snap.x,
          deltaTime * 0.01
        );
        cursorPosRef.current.y = lerp(
          cursorPosRef.current.y,
          snap.y,
          deltaTime * 0.01
        );
      } else {
        cursorPosRef.current.x = lerp(
          cursorPosRef.current.x,
          cursorTargetRef.current.x,
          deltaTime * 0.01
        );
        cursorPosRef.current.y = lerp(
          cursorPosRef.current.y,
          cursorTargetRef.current.y,
          deltaTime * 0.01
        );
      }
      mouseRef.current?.style.setProperty(
        "--x",
        cursorPosRef.current.x.toString()
      );
      mouseRef.current?.style.setProperty(
        "--y",
        cursorPosRef.current.y.toString()
      );
    };

    const cb = gsap.ticker.add(callback);
    return () => {
      gsap.ticker.remove(cb);
    };
  }, [snap]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener("mousemove", (event) => {
      const { clientX, clientY } = event;

      if (mouseRef.current) {
        cursorTargetRef.current.x = clientX;
        cursorTargetRef.current.y = clientY;
      }
    });

    return () => {
      controller.abort();
    };
  }, []);

  const onPointerEnter = useCallback<PointerEventHandler<HTMLHeadingElement>>(
    (event) => {
      const rect = event.currentTarget.getClientRects()[0];
      setSnap({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: rect.width + 10,
        h: rect.height + 10,
      });
    },
    []
  );
  const onPointerLeave = useCallback(() => {
    setSnap(null);
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-green-400 flex items-center justify-center">
      <h1
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        className="uppercase text-[10vh] leading-none relative cursor-default pl-[0.1em] opacity-60 hover:opacity-100"
      >
        Start
      </h1>
      <div
        ref={mouseRef}
        className={s.cursor}
        style={
          {
            "--w": snap ? snap.w + "px" : undefined,
            "--h": snap ? snap.h + "px" : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
