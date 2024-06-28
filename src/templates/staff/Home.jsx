import React, {useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import Add from '@mui/icons-material/Add';
import CopyIcon from '@mui/icons-material/ContentCopy';
import Stack from '@mui/material/Stack';
import {Link} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { IconButton, ButtonGroup } from '@mui/material';
import { Settings } from '@mui/icons-material';

export const StaffHomePage = ({ ...props }) => {
	const {axios, clipboardCopy, notify, AskConfirmation} = useContext(GlobalStore);
	const [data, setData] = useState([]);
	const [loading, setLoadingState] = useState(true);

	async function getData(){
		try{
			const res = await axios.get(`/staff/`);
			if (res.status === 200){
				setData(res.data.data)
				notify('success', "Got data")
			}else{
				console.log("Error fetching data:", res.data.message)
				notify('error', res.data.message)
			}
		}catch(err){
			notify('error', err.message);
			console.log("Error fetching data:", err);
		}
	}

	async function deleteStaff(id){
		const payload = JSON.stringify({
			action: 'remove'
		})
		async function deleteItem(){
			const res = await axios.post(`/staff/${id}/`, payload, {
				headers: {"Content-Type": "application/json"},
			})

			if(res.status === 200){
				notify('success', res.data.message)
				return getData()
			}
		}

		AskConfirmation({
			title: 'Delete Staff',
			message: "Are you sure you want to delete this staff account?",
			onApprove: () => deleteItem(),
			onCancel: () => notify('info', "Operation canceled.")
		})
	}

	function init(){
		if(!loading){
			setLoadingState(true)
		}
		getData();
		setTimeout(() => setLoadingState(false), 1200);
	}

	useEffect(() => {
		init();

	// eslint-disable-next-line
	}, [])

	if (loading){
		return(
			<Page>
				<StaffLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>
			<Box className="titlebar">
				<Typography component="h2" className="title"> Staff Account </Typography>
			</Box>

			<Grid container wrap="wrap" sx={{my: 2}}>
				<Link to="/staff/add">
					<StyledButton sx={{mr: 2, ml: 0}} icon={<Add />} variant="primary">
						<Typography sx={{mx: 1, color: '#ffe'}}> New Staff Account </Typography>
					</StyledButton>
				</Link>

				<Link to="/staff/roles">
					<StyledButton sx={{mr: 2, ml: 0}} icon={<Settings />} variant="secondary">
						<Typography sx={{mx: 1, color: '#ffe'}}> Manage Staff Roles </Typography>
					</StyledButton>
				</Link>
			</Grid>


			<Stack>
				<Box sx={{ width: '100%' }}>
				    <Paper className='card' sx={{ width: '100%', mb: 2 }}>
				      	
				        <TableContainer>
				          <Table
				          	className="table"
				            sx={{ minWidth: 850 }}
				            size='medium'
				          >
				          	<TableHead>
						      <TableRow>
						          <TableCell sx={{ fontWeight: 600}}> Name </TableCell>
						          <TableCell sx={{ fontWeight: 600}}> Role </TableCell>
						          <TableCell sx={{ fontWeight: 600}}> Branch </TableCell>
						          <TableCell sx={{ fontWeight: 600}}> Actions </TableCell>
						      </TableRow>
						    </TableHead>
				            
				            <TableBody>
				            	{data.length > 0 ?
				            		data.map((staff, idx) => (
							            <TableRow hover key={idx}>
							                <TableCell scope="row">
						                		<Typography>
													{staff.user.first_name + ' ' + staff.user.last_name}
												</Typography>
							                </TableCell>

							                <TableCell scope="row">
												<Box className="d-flex" sx={{alignItems: 'center'}}>
													<Typography> {staff.user.email} </Typography>
													<IconButton
														onClick={(ev) => clipboardCopy(staff.user.email)}
														color="secondary" 
														sx={{ml: 1}}
														> <CopyIcon sx={{fontSize: '20px !important'}} />
													</IconButton>
												</Box>
											</TableCell>

							                <TableCell scope="row">
						                		<Typography>
													{staff.branch_id}
												</Typography>
							                </TableCell>

							                <TableCell scope="row">
												<ButtonGroup>
													<Link to={`/staff/${staff?.staff_id}`}>
														<Button size="small" variant="contained" color="primary" sx={{ml: 1}}> Edit staff </Button>
													</Link>
													
													<Button onClick={() => deleteStaff(staff.staff_id)} size="small" variant="contained" color="secondary" sx={{ml: 1}}> Delete </Button>
												</ButtonGroup>
							                </TableCell>
							            </TableRow>
				            		))
				            		:
									<TableRow>
										<TableCell scope="row"> No staff accounts to show </TableCell>
									</TableRow>
				            	}
				            </TableBody>

				          </Table>
				        </TableContainer>
				    </Paper>
			    </Box>
			</Stack>
		</Page>
	)
}


export default StaffHomePage;
