'use client';

import Image from "next/image";
import { Card, CardContent, Box, Typography } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface MonthlyEarningProps {
  amount?: number;
  percentChange?: number;
  label?: string;
  imageSrc?: string;
}

export default function MonthlyEarning({
  amount = 24500,
  percentChange = 9,
  label = "Sales",
  imageSrc = "/Group.svg",
}: MonthlyEarningProps) {
  const formatted = `$${amount.toLocaleString()}`;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        width: "100%",     // fill the Grid width
        height: "100%",    // fill parent Grid height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 2, flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 12 }}>
              Monthly Earning
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
              {formatted}
            </Typography>
          </Box>

          <Box sx={{ width: 56, height: 40, position: "relative" }}>
            <Image src={imageSrc} alt="icon" fill style={{ objectFit: "contain" }} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(255,0,0,0.06)",
              color: "error.main",
              px: 1,
              py: 0.4,
              borderRadius: 1,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: 18 }} />
            <Typography component="span" sx={{ fontSize: 13, fontWeight: 600 }}>
              {percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {label}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Compared to last month
          </Typography>
        </Box>
      </CardContent>

      <Box sx={{ width: "100%", height: 60 }}>
        <svg viewBox="0 0 500 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <path
            d="M0,30 C150,60 350,0 500,30 L500,60 L0,60 Z"
            fill="rgba(100, 200, 255, 0.15)"
          />
        </svg>
      </Box>
    </Card>
  );
}
