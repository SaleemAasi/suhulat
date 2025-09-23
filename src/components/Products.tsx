"use client";

import { Card, CardMedia, Typography, Box, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";

const products = [
  { name: "Coat", brand: "Zara", price: 120, discount: 90, rating: 4.5, image: "/coat.svg" },
  { name: "Bag", brand: "Gucci", price: 200, discount: 150, rating: 4.2, image: "/Gucci.svg" },
  { name: "Cooler", brand: "LG", price: 350, discount: 300, rating: 4.8, image: "/cooler.svg" },
  { name: "Table", brand: "Ikea", price: 100, discount: 75, rating: 4.0, image: "/table.svg" },
];

export default function ProductFlex() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 2,
        width: "100%",
        mt: 4,
        mb: 4,
      }}
    >
      {products.map((product, index) => (
        <Card
          key={index}
          sx={{
            flex: "1 1 calc(25% - 16px)",
            minWidth: "200px",
            maxWidth: "100%",
            p: 1.5,
            borderRadius: 2,
            boxShadow: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // height: "205px", // reduced height since layout is horizontal
            // justifyContent: "space-between",
          }}
        >
          {/* Product Image */}
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
              width: "70%",
              height: "100px",
              objectFit: "contain",
          
            }}
          />

          {/* Brand, Name, and Price in Horizontal Row */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            sx={{ width: "100%" }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ fontSize: 12, whiteSpace: "nowrap" }}
            >
              {product.brand}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}
            >
              {product.name}
            </Typography>

            <Box display="flex" gap={0.5} alignItems="center">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through", fontSize: 12 }}
              >
                ${product.price}
              </Typography>
              <Typography
                variant="body1"
                color="primary"
                sx={{ fontWeight: 700, fontSize: 14 }}
              >
                ${product.discount}
              </Typography>
            </Box>
          </Box>

          {/* Rating + Add to Cart */}
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center" gap={0.5}>
              <StarIcon fontSize="small" sx={{ color: "#FFD700" }} />
              <Typography variant="body2" sx={{ fontSize: 12 }}>
                {product.rating}
              </Typography>
            </Box>

            <IconButton color="primary" size="small">
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
