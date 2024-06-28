import * as React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// pages import 
import {GlobalStore} from '../../store';

export const SignupPage = ({ }) =>{
  const {notify} = React.useContext(GlobalStore)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [businessName, setBusinessName] = React.useState("")

  async function submit(){
    notify('info', `Creating your dashboard`);

    try{
      let body = JSON.stringify({
        payload:{
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
          'businessName': businessName
        }
     })
      let res = await  fetch('http://localhost:5000/api/signup/', {
       headers: {"Content-Type": "application/json"},
       method: 'POST',
       body: body
      });

      let data = await res.json()
      if (res.status === 201){
        notify('success', 'Setup Complete')
        setTimeout(() => (document.location.href = "/i"), 2500)
        return 
      }else{
        return notify('error', data.message)
      }
    }catch(err){
      return notify('error', err.message)
    }
  }

  return(
    <Box className="page">
      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto'}}>
        <Box sx={{p: 2}} className="form">
          <Typography component="h1" sx={{mb: 4}} className="form-title"> Sign up </Typography>

          <Box sx={{my: 2, }} className="form-group">
            <Typography component="p"> First name </Typography>
            <input required className="input" onInput={e => setFirstName(e.target.value)} />
          </Box>
          
          <Box sx={{my: 2, }} className="form-group">
            <Typography component="p"> Last name </Typography>
            <input required className="input" onInput={e => setLastName(e.target.value)} />
          </Box>

          <Box sx={{my: 2, }} className="form-group">
            <Typography component="p"> Email </Typography>
            <input required className="input" onInput={e => setEmail(e.target.value)} name="email" type="email" />
          </Box>
          
          <Box sx={{my: 2, }} className="form-group">
            <Typography component="p"> Password </Typography>
            <input required className="input" onInput={e => setPassword(e.target.value)} name="password" type="password" />
          </Box>

          <Box sx={{my: 2, }} className="form-group">
            <Typography component="p"> Business name </Typography>
            <input required className="input" onInput={e => setBusinessName(e.target.value)} />
          </Box>

          <IconButton onClick={submit} form="form" className="btn" sx={{width: '200px'}} > 
            <Typography component="p"> Signup </Typography>
          </IconButton>

          <Typography component="p" sx={{mt: 3}}>Already have an account? <Link to='/login'> Login </Link> </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default SignupPage;
