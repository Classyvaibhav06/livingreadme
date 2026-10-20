import ModelCard from "./ModelCard";
import ChatCard from "./ChatCard";
import IngestCard from "./IngestCard";
import Reveal from "../Reveal";
import { SECTION_HEAD_GAP, SECTION_X, SECTION_Y } from "../../lib/section";

const Grid = () => {
  return (
    <section id="features" className={SECTION_Y}>
      <Reveal
        className={`flex flex-col items-center gap-5 px-4 text-center ${SECTION_HEAD_GAP}`}
      >
        <div className="text-blue-600">Platform</div>
        <div className="text-2xl font-medium tracking-tighter sm:text-3xl md:text-4xl">
          One webhook. Docs that write themselves.
        </div>
        <div className="max-w-2xl text-slate-600">
          Every feature below runs off the same GitHub push webhook — provider
          fallback, smart generation modes, and live job logs all stay in sync
          automatically.
        </div>
      </Reveal>

      <Reveal blur={6} y={40} className={SECTION_X}>
        <div className="mb-4 grid min-w-full grid-cols-1 gap-4 divide-neutral-200 rounded-2xl sm:gap-0 sm:divide-x sm:divide-y sm:border sm:border-neutral-200 lg:grid-cols-2">
          <ModelCard />
          <ChatCard />
          <IngestCard />
        </div>
      </Reveal>
    </section>
  );
};

export default Grid;
