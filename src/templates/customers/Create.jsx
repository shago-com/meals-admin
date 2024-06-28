import React, {useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FormLoader} from '../../components/loaders';
import {BackButton, Page, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import Save from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import { Input } from '@mui/material';


export const CustomersCreatePage = ({ ...props }) => {
	const {axios, notify,  redirect} = useContext(GlobalStore);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhoneNumber] = useState("");
	const [deliveryLocation, setDeliveryLocation] = useState("");
	const [address, setAddress] = useState("");
	const [loading, setLoadingState] = useState(true);

	function perfromChecks(){
		if (!email)	return false
		if (!firstName)	return false
		if (!lastName) return false
		if (!phone) return false
		if (!address) return false
		if (!deliveryLocation) return false
		return true
	}

	async function postData(){
		let passed = perfromChecks();
		if (passed){
			try{
				const payload = JSON.stringify({
					first_name: firstName,
					last_name: lastName,
					email,
					phone,
				})

				const res = await axios.post(`/customers/add/`, payload, {
					headers: {
						"Content-Type": "application/json"
					},
				});
				if (res.status === 201){
					notify('success', "Created new Customer")
					setTimeout(() => {
						return redirect('/customers')
					}, 2500)
				}else{
					console.log("Error fetching data:")
					return notify('error', "An error occurred")
				}
			}catch(err){
				console.log("Error fetching data:", err)
				return notify('error', err.message)
			}
		}else{
			notify("warning", "Please fill all the fields.")
		}
	}


	useEffect(() => {
		function init(){
			setLoadingState(false)
		};
		init()
	}, [])

	if (loading){
		return(
			<Page>
				<FormLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page px={3}>

			<BackButton path="/customers/" />

			<Box className="titlebar" sx={{my: 2}}>
				<Typography component="h2" className="heading"> Create a new Customer </Typography>
			</Box>

			<Stack sx={{my: 2, mt: 4, minHeight: '100px',}} className="card">
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Grid container sx={{my: 3}} className="" spacing={2}>
							<Grid item xs={12} md={6} wrap="wrap" sx={{mb: 2}}>
								<Box item className="form-group" xs={12}>
									<Typography sx={{mb: .3}}> First Name </Typography>
									<Input disableUnderline name="firstName" onInput={e => setFirstName(e.target.value)} className="input" type="text" value={firstName} />
								</Box>
							</Grid>

							<Grid item xs={12} md={6} wrap="wrap" sx={{mb: 2}}>
								<Box item className="form-group" xs={12}>
									<Typography sx={{mb: .3}}> Last Name </Typography>
									<Input disableUnderline name="lastName" onInput={e => setLastName(e.target.value)} className="input" type="text" value={lastName} />
								</Box>
							</Grid>
							
							<Grid item xs={12} md={6} wrap="wrap" sx={{mb: 2}}>
								<Box item className="form-group" xs={12}>
									<Typography sx={{mb: .3}}> Email address </Typography>
									<Input disableUnderline
									 name="email"
									 onInput={e => setEmail(e.target.value)}
									 className="input"
									 type="email"
									 value={email}
									/>
								</Box>
							</Grid>

							<Grid item xs={12} md={6} wrap="wrap" sx={{mb: 2}}>
								<Box item className="form-group" xs={12}>
									<Typography sx={{mb: .3}}> Phone number </Typography>
									<Input disableUnderline
									 name="phone"
									 onInput={e => setPhoneNumber(e.target.value)}
									 className="input"
									 type="tel"
									 value={phone}
									/>
								</Box>
							</Grid>
							
						</Grid>

						<StyledButton onClick={postData} sx={{m: 0}} icon={<Save />}>							
							<Typography sx={{color: '#fff'}}> Create Customer </Typography>
						</StyledButton>
					</form>
				</Stack>
			</Stack>
		</Page>
	)
}


export default CustomersCreatePage;
