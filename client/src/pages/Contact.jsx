import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  TablePagination,
} from "@mui/material";

import useAxios from "../api";
import AlertModal from "../components/Modal/AlertModal";
import Modal from "../components/Modal/Modal";
import Navbar from "../components/Navbar/Navbar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Contact = () => {
  const Axios = useAxios();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [total, setTotal] = React.useState(null);
  const [contacts, setContacts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [contactId, setContactId] = React.useState(null);
  const [showAlertModal, setShowAlertModal] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState(null);
  const [contact, setContact] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [updateContact, setUpdateContact] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const updateContactHandler = async () => {
    await Axios({
      url: `/contacts/${contactId}`,
      method: "put",
      data: { name, phoneNumber: contact, email },
    })
      .then((res) => {
        setIsError(false);
        setShowAlert(true);
        setAlertMessage(res.data.message);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setShowModal(false);
    getContacts();
  };

  const addContactHandler = async () => {
    await Axios({
      url: `/contacts`,
      method: "post",
      data: { name, phoneNumber: contact, email },
    })
      .then((res) => {
        setIsError(false);
        setShowAlert(true);
        setAlertMessage(res.data.message);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setShowModal(false);
    getContacts();
  };

  const deleteContactHandler = async () => {
    setShowAlertModal(false);
    await Axios({
      method: "delete",
      url: `/contacts/${contactId}`,
    })
      .then((res) => {
        setIsError(false);
        setShowAlert(true);
        setAlertMessage(res.data.message);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    getContacts();
  };

  const getContacts = async () => {
    await Axios(
      `/contacts?page=${page + 1}&limit=${rowsPerPage}&search=${search}`
    )
      .then((res) => {
        setContacts(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => {
        setIsError(true);
        setShowAlert(true);
        setAlertMessage(err.response.data.message);
      });
    setIsLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    getContacts();
  }, [page, rowsPerPage, search]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack sx={{ width: "100%" }}>
      <Navbar SearchTerm={search} setSearchTerm={setSearch} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      {showAlertModal && (
        <AlertModal
          open={showAlertModal}
          setOpen={setShowAlertModal}
          title="Delete Contact"
          content="Are you sure you want to delete this Contact?"
          successButton="Delete"
          onSuccess={deleteContactHandler}
        />
      )}
      {showModal && (
        <Modal
          open={showModal}
          setOpen={setShowModal}
          onSuccess={updateContact ? updateContactHandler : addContactHandler}
          title={updateContact ? "Update Contact" : "Add Contact"}
          label="Name"
          label1="Email"
          label2="Phone Number"
          enteredValue={name}
          enteredValue1={email}
          enteredValue2={contact}
          setEnteredvalue={setName}
          setEnteredvalue1={setEmail}
          setEnteredvalue2={setContact}
          successButton={updateContact ? "Update" : "Add"}
          content={`${updateContact ? "Update" : "Add"} Contact Deatils.`}
        />
      )}
      {!contacts.length && (
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "120px",
          }}
        >
          No Contacts Found
        </h1>
      )}
      {!!contacts.length && (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "83.6vh" }}>
            <Table sx={{ minWidth: 300, mt: 9 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ fontWeight: 700 }}>
                    Name
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 700 }}>
                    Phone number
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 700 }}>
                    Email
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 700 }}>
                    Edit Contact
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontWeight: 700 }}>
                    Delete Contact
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.phoneNumber}</StyledTableCell>
                    <StyledTableCell>{row.email}</StyledTableCell>
                    <StyledTableCell>
                      <Button
                        onClick={() => {
                          setContactId(row._id);
                          setShowModal(true);
                          setName(row.name);
                          setEmail(row.email);
                          setContact(row.phoneNumber);
                          setUpdateContact(true);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        onClick={() => {
                          setContactId(row._id);
                          setShowAlertModal(true);
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15, 25, 100]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
      <Fab
        onClick={() => {
          setShowModal(true);
          setName("");
          setContact("");
          setEmail("");
          setUpdateContact(false);
        }}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        aria-label="Add"
        color="primary"
      >
        <AddIcon />
      </Fab>
    </Stack>
  );
};

export default Contact;
