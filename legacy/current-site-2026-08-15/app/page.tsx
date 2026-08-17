"use client";

import Header from "@/components/Header";
import ForwardScroll from "@/components/ForwardScroll";
import StaticSection from "@/components/StaticSection";
import ReverseScroll from "@/components/ReverseScroll";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>
      <Header />
      <ForwardScroll />
      <div className="relative z-10 -mt-[100vh]">
        <StaticSection />
        <ReverseScroll />
      </div>
    </main>
  );
}
