import React,{useState} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import {useDispatch} from 'react-redux'
import Cookies from "js-cookie";
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [emailorusername, setEmailorusername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    let data = {
        email:emailorusername,
        password
    }
    axios.post(`${process.env.REACT_APP_API}/user/signin`, data)
        .then((res) => {
            if (res.status === 200) {
              if(res.data.user.role === 'admin'){
                Cookies.set("fb_admin_token", res.data.token);
                dispatch({
                    type: "SET_USER",
                    payload: res.data.user
                })
                setError(null)
                setLoading(false)
                window.location.pathname='/app/dashboard'
              }else{
                return alert("access denied")
              }
                
            }
        })
        .catch((err) => {
            setLoading(false)
            err && err.response && alert(err.response.data.error)

        });
}

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
       
              <form onSubmit={handleLogin}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
               
                
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  name="emailorusername"
                  type="text"
                  variant="outlined"
                  value={emailorusername}
                  onChange={(e)=>setEmailorusername(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
               
              </form>
           
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
