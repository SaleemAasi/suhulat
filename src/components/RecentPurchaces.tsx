'use client';

import { Card, Typography, Box } from '@mui/material';

const purchases = [
  { time: '09:30 AM', text: 'Payment received from Ali of $34' },
  { time: '10:15 AM', text: 'Payment received from Sara of $45' },
  { time: '11:00 AM', text: 'Payment received from John of $50' },
  { time: '12:30 PM', text: 'Payment received from Maria of $29' },
  { time: '01:45 PM', text: 'Payment received from David of $60' },

];

export default function RecentPurchases() {
  return (
<Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, flex: 1, height: "100%" }}>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Recent Purchases
      </Typography>

      {purchases.map((item, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', alignItems: 'center', mb: index !== purchases.length - 1 ? 1.5 : 0 }}
        >
          {/* Left: Time */}
          <Box sx={{ width: 80 }}>
            <Typography variant="body2" color="text.secondary">
              {item.time}
            </Typography>
          </Box>

          {/* Center: Circle */}
          <Box
            sx={{
              width: 12,
              height: 12,
              border: '2px solid #64C8FF',
              borderRadius: '50%',
              mx: 2,
              flexShrink: 0,
            }}
          />

          {/* Right: Text */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2">{item.text}</Typography>
          </Box>
        </Box>
      ))}
    </Card>
  );
}
