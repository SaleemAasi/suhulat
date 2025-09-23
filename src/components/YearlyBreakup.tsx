'use client';

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const yearlyData = {
  2024: { amount: 45200, sales: 9, purchases: 9, chart: [{ value: 75 }, { value: 25 }] },
  2025: { amount: 58900, sales: 12, purchases: 15, chart: [{ value: 60 }, { value: 40 }] },
};

const COLORS = ["#5A8DEE", "#E0E0E0"];

export default function YearlyBreakup() {
  const [year, setYear] = useState<"2024" | "2025">("2024");
  const data = yearlyData[year];

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",      // full width of Grid
        height: "100%",     // fill parent Grid height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <ToggleButtonGroup
          value={year}
          exclusive
          onChange={(e, newYear) => newYear && setYear(newYear)}
          size="small"
        >
          <ToggleButton value="2024" sx={{ fontSize: 12 }}>2024</ToggleButton>
          <ToggleButton value="2025" sx={{ fontSize: 12 }}>2025</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <CardContent sx={{ p: 0, flex: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ fontSize: 14 }}>
          Yearly Breakup
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between" height="100%">
          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: 16 }}>
              ${data.amount.toLocaleString()}
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <TrendingUpIcon color="success" fontSize="small" />
              <Typography variant="body2" color="green" ml={0.5} sx={{ fontSize: 12 }}>
                +{data.sales}% Sales
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ fontSize: 12 }}>
              +{data.purchases}% Purchases
            </Typography>
          </Box>

          <Box width={100} height={100}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.chart}
                  innerRadius={20}
                  outerRadius={30}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {data.chart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
