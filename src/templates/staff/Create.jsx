import React, {useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FormLoader} from '../../components/loaders';
import {BackButton, Page, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import Save from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Input } from '@mui/material';


export const StaffCreatePage = ({ ...props }) => {
	const {axios, notify, redirect} = useContext(GlobalStore);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [branch, setBranch] = useState("");
	const [role, setRole] = useState("");
	const [roles, setRoles] = useState([]);
	const [permissions, setPermissions] = useState([]);
	const [allowedPermissions, setAllowedPermissions] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const [branches, setBranchList] = useState([]) 


	async function getData(){
		try{
			const res = await axios.get(`/staff/add/`)

			
			if (res.status === 200){
				console.log("Data:", res.data)
				setRoles(res.data.roles)
				setPermissions(res.data.permissions)
				setBranchList(res.data.branches)
				notify('success', "Got data");
				setTimeout(() => setLoadingState(false), 1200);
			}else{
				notify('warning', "Something went wrong!")
			}
		}catch(err){
			notify('error', "Something went wrong!")
		}
	}

	function perfromChecks(){
		if (!email)	return false
		if (!firstName)	return false
		if (!lastName)	return false
		if (!role)	return true
		if (!role === 'Admin' && !branch)	return true
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
					role,
					branch
				})

				const res = await axios.post(`/staff/add/`, payload, {
					headers: {
						"Content-Type": "application/json"
					},
				});
				if (res.status === 201){
					notify('success', "Created new staff")
					setTimeout(() => {
						return redirect('/staff')
					}, 2500)
				}else{
					console.log("Error fetching data:", res.data.message)
					return notify('error', res.data.message)
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
			getData();
		};
		init()

	// eslint-disable-next-line
	}, [])

	if (loading){
		return(
			<Page>
				<FormLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>

			<BackButton path="/staff/" />

			<Box className="titlebar" sx={{my: 2}}>
				<Typography component="h2" className="heading"> Create a new staff </Typography>
			</Box>

			<Stack sx={{my: 2, mt: 4, maxWidth: "700px", minHeight: '100px',}} className="card">
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Stack sx={{my: 3}} className="">
							<Grid container spacing={2} wrap="wrap" sx={{mb: 2}}>
								<Grid xs={12} md={6} item className="form-group" sx={{mt: 2, width: '100%'}}>
									<Typography sx={{mb: .3}}> First Name </Typography>
									<Input variant="contained" disableUnderline name="firstName" onInput={e => setFirstName(e.target.value)} type="text" value={firstName} className='input' />
								</Grid>

								<Grid xs={12} md={6} item className="form-group" sx={{mt: 2, width: '100%'}}>
									<Typography sx={{mb: .3}}> Last Name </Typography>
									<Input variant="contained" disableUnderline name="lastName" onInput={e => setLastName(e.target.value)} type="text" value={lastName} className='input' />
								</Grid>
							</Grid>

							<Box className="form-group" sx={{mt: 2}}>
								<Typography sx={{mb: .3}}> Email </Typography>
								<Input variant="contained" disableUnderline name="email" onInput={e => setEmail(e.target.value)} type="email" value={email} className='input' />
								<Typography> <small> They will receive an email to set up their account </small> </Typography>
							</Box>

							<Box className="form-group" sx={{mt: 2}}>
								<Typography sx={{mb: .3}}> Select Role </Typography>
								<Select value={role} onChange={e => setRole(e.target.value)} fullWidth>
									{roles?.map((_role, idx) => <MenuItem key={idx} value={_role.role}> {_role.label} </MenuItem>)}
								</Select>

								<Select multiple multiline value={allowedPermissions} onChange={e => setAllowedPermissions(e.target.value)} fullWidth>
									{permissions?.map((perm, idx) => <MenuItem key={idx} value={perm.codename}> {perm.name} </MenuItem>)}
								</Select>
							</Box>

							<Box className="form-group" sx={{mt: 2}}>
								<Typography sx={{mb: .3}}> Assigned Location </Typography>
								<Select
									// renderValue={()}
									value={branch} onChange={e => setBranch(e.target.value)} fullWidth>
									{branches?.map((_branch, idx) => <MenuItem value={_branch.branch_id}> {_branch?.branch_name} </MenuItem>)}
								</Select>
							</Box>
						</Stack>

						<StyledButton onClick={postData} icon={<Save />}>							
							<Typography sx={{mx: 1, color: '#fff'}}> Create Staff </Typography>
						</StyledButton>
					</form>
				</Stack>
			</Stack>
		</Page>
	)
}


export default StaffCreatePage;
