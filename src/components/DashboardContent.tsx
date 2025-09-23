"use client";

import { Grid, Box } from "@mui/material";
import SalesOverview from "@/components/SaleOverview";
import YearlyBreakup from "@/components/YearlyBreakup";
import MonthlyEarning from "@/components/MonthlyEarning";
import RecentPurchases from "@/components/RecentPurchaces";
import RecentSales from "@/components/RecentSales";
import Products from "@/components/Products";

export default function DashboardContent() {
  return (
    <>
     <Grid container spacing={2} alignItems="flex-start">
  {/* Sales Overview */}
  <Grid size={{ xs: 12, md: 8 }}>
    <Box sx={{ height: { xs: 270, sm: 380, md: 400, lg: 317 } }}>
      <SalesOverview />
    </Box>
  </Grid>


  <Grid xs={12} md={4} lg={4}>
    <Box display="flex" flexDirection="column" gap={2}>
      <Box sx={{ height: { xs: 140, sm: 160, md: 180, lg: 150 } }}>
        <YearlyBreakup />
      </Box>
      <Box sx={{ height: { xs: 140, sm: 160, md: 180, lg: 150 } }}>
        <MonthlyEarning />
      </Box>
    </Box>
  </Grid>
</Grid>

<Grid container spacing={2} sx={{ mt: 2 }} alignItems="stretch">
  <Grid size={{ xs: 12, md: 4 }}>
    <Box sx={{ height: { xs: 270, sm: 380, md: 400, lg: 270 } }}>
      <RecentPurchases />
    </Box>
  </Grid>

  <Grid size={{ xs: 12, md: 8 }}>
    <Box sx={{ height: { xs: 270, sm: 380, md: 400, lg: 270 } }}>
      <RecentSales />
    </Box>
  </Grid>
</Grid>

<Grid container>
  <Grid item xs={12} size={{ md: 12 }}>
    <Products />
  </Grid>
</Grid>

    </>
  );
}
