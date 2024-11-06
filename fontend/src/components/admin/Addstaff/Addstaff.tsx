import React, { useEffect, useState } from "react";
import axios from "axios";
// TableComponent.tsx
// import Sidebar from "./Sidebar/sidebar";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  IconButton,
  CssBaseline,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useCookies } from "react-cookie";

const API = import.meta.env.VITE_API || "";

// Interface for Data, excluding _id for Add
interface Data {
  _id: string; // Used for existing records
  id: string;
  name: string;
  email: string;
  role: string;
}

const Addstaff: React.FC = () => {
  const [rows, setRows] = useState<Data[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentRow, setCurrentRow] = useState<Data | null>(null);
  const [formData, setFormData] = useState<Omit<Data, "_id">>({
    id: "",
    name: "",
    email: "",
    role: "", // Add the 'role' property
  });
  const [cookie] = useCookies(["token"]);
  const [formError, setFormError] = useState<{ [key: string]: string }>({});
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Data[]>(`${API}/adminfunc/getstaff`,{headers: { "x-auth-token": cookie.token }});
      // console.log(response.data[0]._id);
      setRows(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  // Fetch data from the server
  useEffect(() => {
    

    fetchData();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddOpen = () => {
    setFormData({ id: "", name: "", email: "", role: "" });
    setFormError({});
    setOpenAddDialog(true);
  };

  const handleAddClose = () => {
    setOpenAddDialog(false);
  };

  const handleEditOpen = (row: Data) => {
    setFormData({
      id: row._id,
      name: row.name,
      email: row.email,
      role: row.role,
    });
    setCurrentRow(row);
    setFormError({});
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteOpen = (row: Data) => {
    setCurrentRow(row);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form data
  const validateForm = (): boolean => {
    const { name, email } = formData;
    let valid = true;
    const errors: { [key: string]: string } = {};

    // Clear previous errors
    // setFormError({});

    
    if (!name) {
      errors.name = "Name is required.";
      valid = false;
    }
    if (!email) {
      errors.email = "Email is required.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format.";  
    }

    setFormError(errors);
    return valid;
  };

  // ADD
  const handleAddSubmit = async () => {
    if (!validateForm()) return;

    try {
      console.log("Adding station with data:", formData); // Debugging
      await axios.post(`${API}/adminfunc/addstaff`, formData, {
        headers: { "x-auth-token": cookie.token },
      });
      // Fetch updated data from the server to reflect changes
      await fetchData();
      handleAddClose();
    } catch (error) {
      console.error("Failed to add station", error); // Debugging
      setError("Failed to add station");
    }
  };

  // EDIT
  const handleEditSubmit = async () => {
    if (!currentRow || !validateForm()) return;

    try {
      console.log(
        "Editing station with ID:",
        currentRow._id,
        "and data:",
        formData
      ); 
      // Debugging
      await axios.put(`${API}/adminfunc/editstaff`, formData, {
        headers: { "x-auth-token": cookie.token },
      });
      // Fetch updated data from the server to reflect changes
      await fetchData();
      handleEditClose();
    } catch (error) {
      console.error("Failed to update Staff", error); // Debugging
      setError("Failed to update staff");
    }
  };

  // DELETE
  const handleDeleteSubmit = async () => {
    if (!currentRow) return;
    const request = {
        id: currentRow._id,
        role:"USER"
    }
    try {
      console.log("Deleting station with ID:", currentRow._id); // Debugging
      await axios.put(`${API}/adminfunc/editstaff`,request, {
        headers: { "x-auth-token": cookie.token },
      });
      // Fetch updated data from the server to reflect changes
      await fetchData();
      handleDeleteClose();
    } catch (error) {
      console.error("Failed to delete station", error); // Debugging
      setError("Failed to delete station");
    }
  };


  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="h-0 w-full">
      <Box display="flex" height="100vh">
        <CssBaseline />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#E2B644",
            p: 3,
          }}
        >
          <Container className="pt-2 rounded-xl bg-white w-full h-full">
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="error"
                onClick={handleAddOpen}
              >
                + Add Staff
              </Button>
            </Grid>
            <Paper
              sx={{
                borderRadius: 4,
                width: "100%",
                maxHeight: "100%",
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Role
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row,index) => (
                        <TableRow key={row._id}>
                          <TableCell sx={{ textAlign: "center" }}>
                            {index + 1}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.email}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.role}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <IconButton
                              sx={{ color: "#E2B644" }}
                              onClick={() => handleEditOpen(row)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              sx={{ color: "#A30D11" }}
                              onClick={() => handleDeleteOpen(row)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[6, 12, { label: "All", value: -1 }]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Container>
        </Box>
      </Box>

      {/* Add Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleAddClose}
        PaperProps={{
          style: {
            padding: "16px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Add New Station</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to add a new station.
          </DialogContentText>
          
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formError.name}
            helperText={formError.name}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formError.email}
            helperText={formError.email}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddClose}
            color="error"
            sx={{
              backgroundColor: "#FF4D4F",
              color: "white",
              "&:hover": {
                backgroundColor: "#FF1A1A",
                boxShadow: "0 4px 8px rgba(255, 0, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSubmit}
            color="success"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#388E3C",
                boxShadow: "0 4px 8px rgba(0, 255, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        PaperProps={{
          style: {
            padding: "16px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Edit Station</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the form below to edit the station.
          </DialogContentText>
          
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            error={!!formError.name}
            helperText={formError.name}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formError.email}
            helperText={formError.email}
          />
          
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            color="error"
            sx={{
              backgroundColor: "#FF4D4F",
              color: "white",
              "&:hover": {
                backgroundColor: "#FF1A1A",
                boxShadow: "0 4px 8px rgba(255, 0, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="success"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#388E3C",
                boxShadow: "0 4px 8px rgba(0, 255, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        PaperProps={{
          style: {
            padding: "8px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography component="span" color="error">
              {`Are you sure you want to delete `}
              <strong>{currentRow?.name}</strong>
              {` station?`}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteClose}
            color="error"
            sx={{
              backgroundColor: "#FF4D4F",
              color: "white",
              "&:hover": {
                backgroundColor: "#FF1A1A",
                boxShadow: "0 4px 8px rgba(255, 0, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteSubmit}
            color="success"
            sx={{
              backgroundColor: "#4CAF50",
              color: "white",
              "&:hover": {
                backgroundColor: "#388E3C",
                boxShadow: "0 4px 8px rgba(0, 255, 0, 0.3)",
              },
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Addstaff;
