import React, { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CardOverviewProps {
  title: string;
  numberInfo: string | number;
  icon: ReactNode;
}

const CardOverview: React.FC<CardOverviewProps> = ({
  title,
  numberInfo,
  icon,
}) => {
  return (
    <Card className="p-5 w-[372px] rounded-xl shadow-sm">
      <CardContent className="p-0">
        {/* Title */}
        <h3 className="text-[#343A40] font-semibold mb-3">{title}</h3>

        {/* Number + Icon */}
        <div className="flex justify-between items-center">
          <div className="text-5xl font-bold">{numberInfo}</div>
          <div className="text-xl [&>svg]:w-8 [&>svg]:h-8 bg-[#F0F6E7] text-[#65A30D] rounded-full p-4">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
