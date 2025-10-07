
"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  inquiries: {
    label: "Inquiries",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type InquiriesChartProps = {
    data: { date: string; day: string; inquiries: number }[];
}

export function InquiriesChart({ data }: InquiriesChartProps) {
  return (
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={4} />
        </BarChart>
      </ChartContainer>
  )
}
