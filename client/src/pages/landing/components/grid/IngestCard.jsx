import { FileText, GitBranch, GitPullRequest, Network } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeading,
  CardIllustrations,
  LineSvg,
  PulseBorderIcon,
  StraightLine,
} from "./shared";

const IngestCard = () => {
  return (
    <Card className="h-auto w-full overflow-hidden rounded-2xl border border-neutral-200 p-5 sm:h-[440px] sm:rounded-none sm:border-0 sm:p-4 lg:col-span-2">
      <CardHeading>
        <GitBranch className="size-4" />
        One Webhook, Smart Generation
      </CardHeading>
      <CardDescription>
        A push webhook decides the mode — full rewrite, targeted section patch,
        or a background cleanup pass — all run through the same BullMQ pipeline.
      </CardDescription>
      <CardIllustrations>
        {/* Mobile simplified view */}
        <div className="flex flex-col gap-3 px-1 py-6 sm:hidden">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
            <FileText size={16} className="text-blue-500" />
            <span className="text-sm">Full Rewrite</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
            <GitPullRequest size={16} className="text-purple-500" />
            <span className="text-sm">Section Patch</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
            <Network size={16} className="text-orange-500" />
            <span className="text-sm">Cleanup Worker</span>
          </div>
        </div>

        {/* Desktop animated view */}
        <div
          className="relative mx-auto mr-50 hidden h-full max-w-2xl sm:block"
          style={{ transform: "scale(1.2)", transformOrigin: "top left" }}
        >
          <LineSvg className="top-[100px] left-[200px]" color="#3b82f6" />
          <StraightLine className="top-[156px] left-[200px]" />
          <LineSvg
            className="top-[180px] left-[200px] rotate-x-180"
            color="#a855f7"
          />

          <div className="absolute top-[92px] left-[56px] flex items-center gap-2 text-xs">
            <FileText size={16} />
            Full Rewrite
          </div>
          <div className="absolute top-[148px] left-[56px] flex items-center gap-2 text-xs">
            <GitPullRequest size={16} />
            Section Patch
          </div>
          <div className="absolute top-[204px] left-[56px] flex items-center gap-2 text-xs">
            <Network size={16} />
            Cleanup Worker
          </div>

          <PulseBorderIcon className="top-[132px] left-[72.5%]" />
        </div>
      </CardIllustrations>
    </Card>
  );
};

export default IngestCard;
