/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ["#22C55E", "#1E293B", "#334155", "#94A3B8", "#E2E8F0"];

export default function OverviewDashboard() {
  const session = useSession();
  const token = session?.data?.accessToken;

  // 1. Fetch Top Stats
  const { data: stats } = useQuery({
    queryKey: ["analytics-stats", token],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data;
    },
    enabled: !!token,
  });

  // 2. Fetch Revenue Chart Data
  const { data: revenueData } = useQuery({
    queryKey: ["revenue-chart", token],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/chart-revenue?type=weekly`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data;
    },
    enabled: !!token,
  });

  // 3. Fetch Equipment Distribution Data
  const { data: equipmentData } = useQuery({
    queryKey: ["equipment-chart", token],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics/chart-equipment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data.data;
    },
    enabled: !!token,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-tight">Overview</h1>

      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} />
        <StatCard
          title="Total Equipments"
          value={stats?.totalEquipments || 0}
        />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue || 0}`}
          isCurrency
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Monthly Revenue
              </h3>
              <p className="text-xs text-gray-400">
                Track total revenue, platform commission, and payouts.
              </p>
            </div>
            <Select defaultValue="weekly">
              <SelectTrigger className="w-24 h-8 text-xs rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94A3B8" }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value) => [`$${value}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">
              Orders Distribution
            </h3>
            <Select defaultValue="monthly">
              <SelectTrigger className="w-24 h-8 text-xs rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="orders"
                  nameKey="title"
                >
                  {equipmentData?.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {equipmentData?.map((entry: any, index: number) => (
              <div key={entry.title} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[10px] text-gray-500 font-medium truncate">
                  {entry.title}
                </span>
                <span className="text-[10px] text-gray-900 font-bold ml-auto">
                  {entry.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
  isCurrency?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-32 flex flex-col justify-between">
      <p className="text-gray-500 font-medium text-sm">{title}</p>
      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
          {value}
        </h2>
        
      </div>
    </div>
  );
}
