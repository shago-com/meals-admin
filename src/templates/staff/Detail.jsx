import React, {useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FormLoader} from '../../components/loaders';
import {BackButton, Page, StyledButton} from '../../components/index';
import CancelIcon from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Input } from '@mui/material';
import { useParams } from 'react-router-dom';


export const StaffDetailPage = ({ ...props }) => {
	const {axios, notify, redirect} = useContext(GlobalStore);
	const [branch, setBranch] = useState("");
	const [staff, setStaff] = useState(null);
	const [role, setRole] = useState("");
	const [roles, setRoles] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const [branches, setBranchList] = useState([]) 
	const {staffId} = useParams();


	async function getData(){
		try{
			const res = await axios.get(`/staff/${staffId}/`)

			if (res.status === 200){
				setStaff(res.data.staff)
				
				const assigned_branch = res.data?.staff?.assigned_branch

				if (assigned_branch){
					const _brObj = Array.from(res.data.branches).find(({ branch_name }) => branch_name === assigned_branch)
					setBranch(_brObj.branch_id)
				}

				setRoles(res.data.roles)
				setRole(res.data.staff.role)
				setBranchList(res.data.branches)
				notify('success', "Got data");
				setTimeout(() => setLoadingState(false), 1200);
			}else{
				setTimeout(() => setLoadingState(false), 1200);
				notify('warning', "Something went wrong!")
			}
		}catch(err){
			notify('error', "Something went wrong!")
		}
	}

	function perfromChecks(){
		if (!role)	return true
		if (!role === 'Admin' && !branch)	return true
		return true
	}

	async function postData(){
		let passed = perfromChecks();
		if (passed){
			try{
				const payload = JSON.stringify({
					action: 'change',
					role,
					branch
				})

				const res = await axios.post(`/staff/${staffId}/`, payload, {
					headers: {
						"Content-Type": "application/json"
					},
				});
				if (res.status === 200){
					notify('success', "Successfully changed staff")
					setTimeout(() => {
						return redirect('/staff')
					}, 1700)
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
	}, [])

	if (loading){
		return(
			<Page>
				<FormLoader loading={loading} />
			</Page>
		)
	}

	const {last_name:lastName, first_name:firstName, email} = staff?.user;

	return(
		<Page>

			<BackButton path="/staff/" />

			<Box className="titlebar" sx={{my: 2}}>
				<Typography component="h2" className="heading"> Change Staff User </Typography>
			</Box>

			<Stack sx={{my: 2, mt: 4, maxWidth: "700px", minHeight: '100px',}} className="card">
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Stack sx={{my: 3}} className="">
							<Grid container spacing={2} wrap="wrap" sx={{mb: 2}}>
								<Grid xs={12} md={6} item className="form-group" sx={{mt: 2, width: '100%'}}>
									<Typography sx={{mb: .3}}> First Name </Typography>
									<Input disabled contentEditable={false} variant="contained" disableUnderline type="text" value={firstName} className='input' />
								</Grid>

								<Grid xs={12} md={6} item className="form-group" sx={{mt: 2, width: '100%'}}>
									<Typography sx={{mb: .3}}> Last Name </Typography>
									<Input disabled contentEditable={false} variant="contained" disableUnderline value={lastName} className='input' />
								</Grid>
							</Grid>

							<Box className="form-group" sx={{mt: 2}}>
								<Typography sx={{mb: .3}}> Email </Typography>
								<Input disabled contentEditable={false} variant="contained" disableUnderline value={email} className='input' />
							</Box>

							<Box className="form-group" sx={{mt: 2}}>
								<Typography sx={{mb: .3}}> Select Role </Typography>
								<Select value={role} onChange={e => setRole(e.target.value)} fullWidth>
									{roles?.map((_role, idx) => <MenuItem selected={staff?.role === _role.role} key={idx} value={_role.role}> {_role.label} </MenuItem>)}
								</Select>
							</Box>

							<Box className="form-group" sx={{mt: 2}}>
								<Typography sx={{mb: .3}}> Assigned Location </Typography>
								<Select	
									value={branch} onChange={e => setBranch(e.target.value)} fullWidth>
									{branches?.map((_branch, idx) => <MenuItem value={_branch.branch_id}> {_branch?.branch_name} </MenuItem>)}
								</Select>
							</Box>
						</Stack>

					</form>

					<Grid container display={'flex'}>
						<StyledButton onClick={postData} icon={<SaveIcon />}>							
							<Typography sx={{color: '#fff'}}> Save Changes </Typography>
						</StyledButton>
						<StyledButton onClick={() => redirect('/staff')} variant="warning" icon={<CancelIcon />}>
							<Typography> Cancel Changes </Typography>
						</StyledButton>
					</Grid>
				</Stack>
			</Stack>
		</Page>
	)
}


export default StaffDetailPage;
