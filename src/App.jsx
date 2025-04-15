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
  Avatar,
  Chip,
} from "@mui/material";
import { sampleOrders } from "./constants/data";
import useCompanySubdomain from "./hooks/useCompanySubdomain";
import { getCompanyLogo } from "./services/logoService";

const App = () => {
  // Use custom hook to handle company detection from subdomain
  const { company, switchCompany, isLoading } =
    useCompanySubdomain(sampleOrders);

  const [page, setPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [logo, setLogo] = useState("");

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

    // Don't override the company param that might be set by the useCompanySubdomain hook
    if (!params.has("company")) {
      params.set("company", company);
    }

    // Update URL without refreshing the page
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [ordersPerPage, company]);

  useEffect(() => {
    if (isLoading) return;

    // Set company logo
    setLogo(getCompanyLogo(company));

    // Set orders data
    if (sampleOrders[company]) {
      setOrders(sampleOrders[company]);
    } else {
      // Default to first company if invalid
      const firstCompany = Object.keys(sampleOrders)[0];
      switchCompany(firstCompany);
      setOrders(sampleOrders[firstCompany]);
    }
  }, [company, isLoading, switchCompany]);

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

  // Format company name for display
  const displayCompanyName = company.charAt(0).toUpperCase() + company.slice(1);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

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
        {/* Company Logo */}
        <Box sx={{ mb: 2 }}>
          <Avatar
            src={logo}
            alt={`${displayCompanyName} logo`}
            sx={{ width: 80, height: 80 }}
            variant="rounded"
          />
        </Box>

        <Typography variant="h3" component="h1" gutterBottom>
          {displayCompanyName} Orders
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          OrderMade Management Platform
        </Typography>

        {/* Company selector for development purposes */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Object.keys(sampleOrders).map((comp) => (
            <Chip
              key={comp}
              label={`${comp} (${sampleOrders[comp].length})`}
              onClick={() => switchCompany(comp)}
              color={company === comp ? "primary" : "default"}
              variant={company === comp ? "filled" : "outlined"}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
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
              <TableCell>Index</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order, index) => (
              <TableRow
                key={order.orderId}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell>{indexOfFirstOrder + index + 1}</TableCell>
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
