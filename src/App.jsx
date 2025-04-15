import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Pagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { sampleOrders } from "./constants/data";

const App = () => {
  // Get subdomain to determine which company's orders to show
  const getSubdomain = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    return parts.length > 2 ? parts[0] : "daraz"; // Default to daraz if no subdomain
  };

  const [company, setCompany] = useState(getSubdomain());
  const [page, setPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [orders, setOrders] = useState([]);

  // For URL params sync (optional task)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const perPageParam = params.get("perPage");

    if (perPageParam) {
      setOrdersPerPage(parseInt(perPageParam, 10));
    }
  }, []);

  useEffect(() => {
    // Update URL params when ordersPerPage changes (optional task)
    const params = new URLSearchParams(window.location.search);
    params.set("perPage", ordersPerPage.toString());

    // Update URL without refreshing the page
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [ordersPerPage]);

  useEffect(() => {
    // For development/testing purposes - allow switching companies
    // In real app, this would be determined by subdomain only
    if (sampleOrders[company]) {
      setOrders(sampleOrders[company]);
    } else {
      // Default to first company if invalid company name
      const firstCompany = Object.keys(sampleOrders)[0];
      setCompany(firstCompany);
      setOrders(sampleOrders[firstCompany]);
    }
  }, [company]);

  // Get current orders for pagination
  const indexOfLastOrder = page * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Handle orders per page change
  const handleOrdersPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0) {
      setOrdersPerPage(value);
      setPage(1); // Reset to first page when changing items per page
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {company.charAt(0).toUpperCase() + company.slice(1)} Orders
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          OrderMade Management Platform
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="Orders per page"
          type="number"
          value={ordersPerPage}
          onChange={handleOrdersPerPageChange}
          InputProps={{
            inputProps: { min: 1 },
            endAdornment: (
              <InputAdornment position="end">orders</InputAdornment>
            ),
          }}
          sx={{ width: "150px" }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow
                key={order.orderId}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell component="th" scope="row">
                  {order.orderId}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: (() => {
                        switch (order.status) {
                          case "Delivered":
                            return "success.light";
                          case "Shipped":
                            return "info.light";
                          case "In Transit":
                            return "warning.light";
                          case "Pending":
                            return "secondary.light";
                          case "Cancelled":
                            return "error.light";
                          case "Preparing":
                            return "info.light";
                          default:
                            return "grey.light";
                        }
                      })(),
                      color: (() => {
                        switch (order.status) {
                          case "Delivered":
                            return "success.dark";
                          case "Shipped":
                            return "info.dark";
                          case "In Transit":
                            return "warning.dark";
                          case "Pending":
                            return "secondary.dark";
                          case "Cancelled":
                            return "error.dark";
                          case "Preparing":
                            return "info.dark";
                          default:
                            return "grey.dark";
                        }
                      })(),
                    }}
                  >
                    {order.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
};

export default App;
