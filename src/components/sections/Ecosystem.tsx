"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ShineText } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const nodes = [
  { key: "brand", label: "Brand", related: ["website", "content"] },
  { key: "website", label: "Website", related: ["seo", "analytics", "brand"] },
  { key: "seo", label: "Search", related: ["website", "content", "analytics"] },
  { key: "content", label: "Content", related: ["social", "seo", "brand"] },
  { key: "social", label: "Social", related: ["content", "crm"] },
  { key: "crm", label: "CRM", related: ["ai", "social", "analytics"] },
  { key: "ai", label: "AI", related: ["crm", "analytics", "website"] },
  { key: "analytics", label: "Analytics", related: ["website", "seo", "ai"] },
];

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = 190;

function nodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
}

export function Ecosystem() {
  const [hovered, setHovered] = useState<string | null>(null);
  const positions = useMemo(() => Object.fromEntries(nodes.map((n, i) => [n.key, nodePosition(i, nodes.length)])), []);
  const relatedSet = new Set(hovered ? nodes.find((n) => n.key === hovered)?.related ?? [] : []);

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div aria-hidden className="gx-bg-dark-aurora" />
      <CursorAtmosphere tone="dark" />
      <Container className="relative z-10">
        <SectionHeader
          animate
          tone="dark"
          eyebrow="The GraphikosX Ecosystem"
          title="Growth doesn't come from isolated marketing activities."
          description="It comes from connected systems working toward the same business objective."
        />

        {/* Desktop/tablet: the full radial diagram. Fixed-size (480x480) SVG
            diagram, so below the breakpoint where that no longer fits
            comfortably inside the viewport it's replaced with the accessible
            list below instead of forcing horizontal scroll — the same
            pattern IndustriesTeaser already uses for its own radial network. */}
        <div className="mt-16 hidden justify-center sm:flex">
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="absolute inset-0" aria-hidden>
              {/* spokes: center to each node */}
              {nodes.map((n) => {
                const pos = positions[n.key];
                const isActive = hovered === n.key || relatedSet.has(n.key);
                return (
                  <line
                    key={n.key}
                    x1={CENTER}
                    y1={CENTER}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isActive ? "#1D4ED8" : "rgba(255,255,255,0.1)"}
                    strokeWidth={isActive ? 2 : 1}
                    className="transition-all duration-300"
                  />
                );
              })}
              {/* direct relationship lines for the hovered node, drawn node-to-node */}
              {hovered &&
                nodes
                  .find((n) => n.key === hovered)!
                  .related.map((r) => (
                    <line
                      key={r}
                      x1={positions[hovered].x}
                      y1={positions[hovered].y}
                      x2={positions[r].x}
                      y2={positions[r].y}
                      stroke="#1D4ED8"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      opacity={0.8}
                    />
                  ))}
            </svg>

            <div
              className="absolute flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-center font-display text-xs font-bold leading-tight"
              style={{ left: CENTER, top: CENTER }}
            >
              YOUR
              <br />
              BUSINESS
            </div>

            {nodes.map((node) => {
              const pos = positions[node.key];
              const isActive = hovered === node.key || relatedSet.has(node.key);
              const isDimmed = hovered !== null && !isActive;
              return (
                <button
                  key={node.key}
                  onMouseEnter={() => setHovered(node.key)}
                  onFocus={() => setHovered(node.key)}
                  onMouseLeave={() => setHovered(null)}
                  onBlur={() => setHovered(null)}
                  className={`absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center text-xs font-semibold transition-all duration-300 ${
                    isActive ? "border-accent bg-accent/20 scale-110 text-paper" : "border-white/10 bg-surface text-grey-300"
                  } ${isDimmed ? "opacity-40" : "opacity-100"}`}
                  style={{ left: pos.x, top: pos.y }}
                >
                  {node.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: the same eight nodes as a clean wrapped tag list — no
            forced-scroll fixed-size diagram below the breakpoint where it
            no longer fits comfortably. */}
        <div className="mt-16 flex flex-wrap justify-center gap-2 sm:hidden">
          {nodes.map((node) => (
            <span key={node.key} className="rounded-full border border-white/10 bg-surface px-4 py-2 text-xs font-semibold text-grey-300">
              {node.label}
            </span>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-14 max-w-2xl text-center font-display text-lg font-bold md:text-xl">
            AI isn&rsquo;t the product. <ShineText delay={0.4}>It&rsquo;s our advantage.</ShineText>
          </p>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-grey-400">
            AI accelerates execution. Human strategy drives decisions.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
