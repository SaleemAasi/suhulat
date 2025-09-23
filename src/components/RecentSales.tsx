'use client';

import { Card, Typography, Box, Divider } from '@mui/material';

const recentSalesData = [
  { id: '001', assigned: 'Ali', name: 'Ali Khan', priority: 'High', budget: '$1200' },
  { id: '002', assigned: 'Sara', name: 'Sara Ahmed', priority: 'Medium', budget: '$900' },
  { id: '003', assigned: 'John', name: 'John Doe', priority: 'Low', budget: '$500' },
  { id: '004', assigned: 'Emma', name: 'Emma Smith', priority: 'High', budget: '$1500' },
];

const priorityColors: Record<string, string> = {
  High: '#FF4D4F',   // red
  Medium: '#FA8C16', // orange
  Low: '#52C41A',    // green
};

export default function RecentSales() {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        flex: 1,
        height: "100%",

      }}
    >
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Recent Sales
      </Typography>

      {/* Table header */}
      <Box display="flex" fontWeight="bold" sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>ID</Box>
        <Box sx={{ flex: 1 }}>Assigned</Box>
        <Box sx={{ flex: 2 }}>Name</Box>
        <Box sx={{ flex: 1 }}>Priority</Box>
        <Box sx={{ flex: 1 }}>Budget</Box>
      </Box>
      <Divider sx={{ mb: 1 }} />

      {/* Table rows */}
      {recentSalesData.map((item, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          sx={{ mb: index !== recentSalesData.length - 1 ? 1.5 : 0 }}
        >
          <Box sx={{ flex: 1 }}>{item.id}</Box>
          <Box sx={{ flex: 1 }}>{item.assigned}</Box>
          <Box sx={{ flex: 2 }}>{item.name}</Box>
          <Box sx={{ flex: 1, color: priorityColors[item.priority], fontWeight: 600 }}>
            {item.priority}
          </Box>
          <Box sx={{ flex: 1 }}>{item.budget}</Box>
        </Box>
      ))}
    </Card>
  );
}
