"use client";

import { cn } from "@/lib/utils";
import s from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { distance } from "@/lib/math";

export default function Page() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(
      "mousemove",
      (event) => {
        const { clientX, clientY } = event;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const centerX = screenW / 2;
        const centerY = screenH / 2;
        const d = distance(clientX, clientY, centerX, centerY);
        const maxDistance = distance(0, 0, centerX, centerY);
        titleRef.current?.style.setProperty(
          "--distance",
          (d / maxDistance).toString()
        );
      },
      {
        signal: controller.signal,
      }
    );

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div
      className={cn(
        "w-screen h-screen text-white flex items-center justify-center",
        s.grid
      )}
    >
      <script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
      <h1
        ref={titleRef}
        className={cn(
          "uppercase text-[10vh] leading-none relative",
          s["title"]
        )}
      >
        Variables
      </h1>
    </div>
  );
}
