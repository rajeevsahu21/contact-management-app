import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Modal({
  open,
  setOpen,
  title,
  enteredValue,
  enteredValue1,
  enteredValue2,
  setEnteredvalue,
  setEnteredvalue1,
  setEnteredvalue2,
  label,
  label1,
  label2,
  content,
  onSuccess,
  successButton,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={label}
          fullWidth
          value={enteredValue}
          variant="standard"
          onChange={(event) => {
            setEnteredvalue(event.target.value);
          }}
        />
        <TextField
          margin="dense"
          id="email"
          label={label1}
          fullWidth
          value={enteredValue1}
          variant="standard"
          onChange={(event) => {
            setEnteredvalue1(event.target.value);
          }}
        />
        <TextField
          margin="dense"
          id="contact"
          label={label2}
          fullWidth
          value={enteredValue2}
          variant="standard"
          onChange={(event) => {
            setEnteredvalue2(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSuccess(enteredValue);
          }}
        >
          {successButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
