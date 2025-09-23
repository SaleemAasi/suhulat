"use client";

import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "3/4", Sales: 200 },
  { name: "4/6", Sales: 300 },
  { name: "5/7", Sales: 250 },
  { name: "6/8", Sales: 400 },
  { name: "7/9", Sales: 320 },
  { name: "8/10", Sales: 280 },
  { name: "9/11", Sales: 350 },
];

export default function SalesOverview() {
  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        {/* Heading + Right Side Label */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold">
            Sales Overview
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Last 7 Days
          </Typography>
        </Box>

        {/* Chart */}
       <Box sx={{ height: { xs: 180, sm: 300, md: 350, lg: 226} }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 400]} />
      <Tooltip />
      <Bar dataKey="Sales" fill="#779AFF" barSize={18} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</Box>
      </CardContent>
    </Card>
  );
}
