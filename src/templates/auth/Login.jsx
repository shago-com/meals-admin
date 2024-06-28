import * as React from 'react';
import {Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import HelloIcon from '@mui/icons-material/StoreMallDirectoryRounded';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextInput from '@mui/material/Input';

// pages import 
import { BaseStore } from '../../store';
import axios from 'axios'
import { StyledButton } from '../../components';


export const LoginPage = ({ props }) => {
  const {apiUrl, onLoginSuccess, } = React.useContext(BaseStore);
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState(null)
  const [password, setPassword] = React.useState("")

  async function handleLogin(event){
    // event.preventDefault();
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
        const {user, token, role} = details.data;
        setMessage({level: 'success', 'text': "Welcome to your store"})

        setTimeout(() =>
        onLoginSuccess({
          user,
          token,
          role,
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
      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto', my: 3}}>
        <Box sx={{p: 3,  color: message?.level === 'success' ? 'limegreen' : 'orange' }} display={'flex'} alignItems={'center'}>
          { message?.level === 'error' ? <ErrorIcon  sx={{fontSize: 35, mr: 1.25}}/> : <HelloIcon sx={{fontSize: 35, mr: 1.25}} />}
          <Box>
            <Typography fontSize={17} fontWeight={'600'}> {message?.level === 'error' ? "Login Error" : "Welcome Back To Your Store!"}</Typography>
            <Typography fontSize={16.4} fontWeight={'400'}> { message?.level === 'error' ? `${message.text}` : "Manage your orders and menu."}</Typography>
          </Box>
        </Box>
      </Box>

      <Box className="card" sx={{width: '95%', maxWidth: 500, mx: 'auto', my: 3}}>
        <Box sx={{p: 2}} className="form">
          <form>
            <Typography component="h1" sx={{mb: 4}} className="auth-form-header form-title"> Login </Typography>
            <Box sx={{my: 2, }} className="form-group">
              <Typography component="p"> Email </Typography>
              <TextInput disableUnderline className="input" onInput={e => setEmail(e.target.value)} placeholder="Your email" name="email" type="email" />
            </Box>
            
            <Box sx={{my: 2, }} className="form-group">
              <Typography component="p"> Password </Typography>
              <TextInput disableUnderline className="input" onInput={e => setPassword(e.target.value)} name="password" type="password" />
            </Box>

            <StyledButton fullwidth variant="warning" onClick={handleLogin} className="fullwidth" wrapperStyle={{width: '100%'}} sx={{px: 4, py: 1.5,}} > 
              <Typography> Log in </Typography>
            </StyledButton>
          </form>
          <hr style={{marginTop: 20}} />

          <Typography component="auth-form-header" sx={{mt: 2}}> Forgot your password? <Link to='/reset-password'> Reset your password </Link> </Typography>

        </Box>
      </Box>
      
    </Box>
  )
}


export default LoginPage;