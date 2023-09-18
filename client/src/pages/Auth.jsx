import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import useAxios from "../api";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://rajeevsahu.vercel.app"
        target="_blank"
      >
        Rajeev Sahu
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Auth() {
  const Axios = useAxios();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const requestbody = isSignUp
      ? {
          user_name: data.get("email"),
          password: data.get("password"),
          name: `${data.get("firstName").trim()} ${data
            .get("lastName")
            .trim()}`,
        }
      : { user_name: data.get("email"), password: data.get("password") };
    await Axios({
      method: "post",
      url: isSignUp ? "/auth/register" : "/auth/login",
      data: requestbody,
    })
      .then((res) => {
        if (res.data.user) {
          localStorage.setItem("token", res.data.accesstoken);
          window.location = "/";
        } else {
          setShowSuccess(res.data.message);
          setIsSignUp(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setShowError(err.response.data.message);
      });
    setIsLoading(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Create An Account!" : "Welcome Back!"}
          </Typography>
          {(showError || showSuccess) && (
            <Alert severity={showError ? "error" : "success"}>
              {showError ? showError : showSuccess}
            </Alert>
          )}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              {isSignUp && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
              )}
              {isSignUp && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading ? true : false}
            >
              {isLoading ? (
                <CircularProgress size={26} />
              ) : isSignUp ? (
                "Sign up"
              ) : (
                "Sign In"
              )}
            </Button>
            <div
              id="googleDiv"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            ></div>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  onClick={() => {
                    setIsSignUp((prevState) => !prevState);
                  }}
                  variant="text"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
