import CardOverview from "./CardOverview";
import { Anchor, ChartLine, Clock4, TrendingUp } from "lucide-react";

export default function Overview() {
  return (
    <div >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
        </div>
        <div className="stat-cards flex gap-4">
          <CardOverview
            title="Total Listings"
            numberInfo={100}
            icon={<Anchor />}
          />
          <CardOverview
            title="Content Generated"
            numberInfo={142}
            icon={<ChartLine />}
          />
          <CardOverview
            title="Time Saved"
            numberInfo={"47h"}
            icon={<Clock4 />}
          />
          <CardOverview
            title="Engagement Rate"
            numberInfo={"8.4%"}
            icon={<TrendingUp />}
          />
        </div>
      </div>
    </div>
  );
}
