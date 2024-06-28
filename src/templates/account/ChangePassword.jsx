import * as React from 'react';
import {Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import ErrorIcon from '@mui/icons-material/Error'
import Typography from '@mui/material/Typography';
import TextInput from '@mui/material/Input'
import { BackButton } from '../../components';

// pages import 
import { BaseStore } from '../../store';
import axios from 'axios'
import { StyledButton } from '../../components';


export const LoginPage = ({ props }) => {
  const {apiUrl, onLoginSuccess, } = React.useContext(BaseStore);
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState(null)
  const [password, setPassword] = React.useState("")

  async function handleLogin(e){
    e.preventDefault();
    const credentials = {
      email,
      password
    }
    try{
      const res = await axios.post(`${apiUrl}/login/`, JSON.stringify(credentials),
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      const details = await res.data
      if (res.status === 200) {
        const {user, token} = details.data;
        setMessage({level: 'success', 'text': "Welcome to your store"})
        setTimeout(() =>
        onLoginSuccess({
          user,
          token,
          ...details.data
        }), 2000)
      }
    }catch(err){
      console.log("Error logging in...", err)
      setMessage({level: 'error', 'text': err.message})
    }
  }

  return(
    <Box className="page">
      <BackButton path={'/account'} />

      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto', my: 3}}>


        <Box sx={{p: 2}} className="form">
          <form>
            <Typography component="h1" sx={{mb: 4}} className="auth-form-header form-title"> Change Password </Typography>
            <Box sx={{my: 2, }} className="form-group">
              <Typography component="p"> Current Password </Typography>
              <TextInput disableUnderline className="input" onInput={e => setEmail(e.target.value)} name="email" type="password" />
            </Box>
            
            <Box sx={{my: 2, }} className="form-group">
              <Typography component="p"> New Password </Typography>
              <TextInput disableUnderline className="input" onInput={e => setPassword(e.target.value)} name="password" type="password" />
            </Box>

            <Box sx={{my: 2, }} className="form-group">
              <Typography component="p"> Confirm Password </Typography>
              <TextInput disableUnderline className="input" onInput={e => setPassword(e.target.value)} name="password" type="password" />
            </Box>

            <StyledButton fullwidth variant="warning" onClick={handleLogin} className="fullwidth" wrapperStyle={{width: '100%'}} sx={{px: 4, py: 1.5,}} > 
              <Typography> Change Password </Typography>
            </StyledButton>
          </form>
        </Box>
      </Box>
      
    </Box>
  )
}


export default LoginPage;