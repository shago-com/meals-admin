import React, {Fragment, useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, StyledButton} from '../../components/index';
import SortLabel from '@mui/material/TableSortLabel';
import Grid from '@mui/material/Grid';
import Settings from '@mui/icons-material/Settings';
import ButtonGroup from '@mui/material/ButtonGroup';
import Add from '@mui/icons-material/Add';
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
import {sortDataByAlphabetical} from '../../utils';



export const CustomerHomePage = ({ ...props }) => {
	const {axios, clipboardCopy, notify, AskConfirmation} = useContext(GlobalStore);
	const [data, setData] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const [sorting, setSortingState] = useState(false);
	const [sortMode, setSortMode] = useState(true);

	async function getData(){
		try{
			const res = await axios.get(`/customers/`);
			if (res.status === 200){
				console.log("Customers:", res.data)
				setData(res.data.data)
				notify('success', "Got data")
			}else{
				console.log(res.data.message)
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message);
			console.log("Error fetching data:", err);
		}
	}

	async function deleteCustomer(id){
		async function deleteItem(){
			const payload = JSON.stringify({
				action: 'remove'
			})
			await axios.post(`/customer/:${id}/`, payload, {
				headers: {"Content-Type": "application/json"},
			})
		}

		AskConfirmation({
			topic: 'Delete Customer',
			message: "Are you sure you want to delete this customer account?",
			onApprove: () => deleteItem(),
			onCancel: () => notify('info', "Operation canceled.")
		})
	}

	function sortData(){
		if(!sorting){
			setSortingState(true)
		}
		const sortedData = sortDataByAlphabetical(data, 'name', (sortMode ? 'asc' : 'desc'));
		setData(sortedData)
		setSortMode(!sortMode)
	}

	useEffect(() => {
		function init(){
			getData();
			setTimeout(() => setLoadingState(false), 1200);
		}
		init();
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
			<Typography component="h2" className="title"> Customer Account </Typography>
		</Box>

		<Grid container wrap="wrap" sx={{my: 2}}>
			<Link to="/customers/add">
				<StyledButton sx={{ml: 0}} icon={<Add />} variant="primary">
					<Typography sx={{mx: 1, color: '#ffe'}}> New Customer </Typography>
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
									<TableCell sx={{ fontWeight: 600}}>
										<SortLabel onClick={sortData} active={sorting} direction={ sortMode ? 'desc' : "asc"}> Name </SortLabel>
									</TableCell>
						          <TableCell sx={{ fontWeight: 600}}> Phone number </TableCell>
						          <TableCell sx={{ fontWeight: 600}}> Email </TableCell>
						          <TableCell sx={{ fontWeight: 600}}> Actions </TableCell>
						      </TableRow>
						    </TableHead>
				            
				            <TableBody>
				            	{data ?
				            		data.map((customer, idx) => 
							            <TableRow hover key={idx}>
							                <TableCell scope="row"><Typography> {customer.user.first_name} {customer.user.last_name} </Typography> </TableCell>

							                <TableCell scope="row"> <Typography> {customer.phone} </Typography> </TableCell>
							                <TableCell scope="row"> <Typography> {customer.user.email} </Typography> </TableCell>

							                <TableCell scope="row"> 
							                	<ButtonGroup>
								                	<Button onClick={(ev) => clipboardCopy(customer.user.email)}
								                	 size="small"
								                	 variant="text"
								                	 color="primary"
								                	 sx={{m: 0}}
								                	> Copy email </Button>

								                	<Button onClick={(ev) => clipboardCopy(customer.phone)}
								                	 size="small"
								                	 variant="text"
								                	 color="primary"
								                	 sx={{m: 0}}
								                	> Copy phone number </Button>
							                	</ButtonGroup>
							                </TableCell>
							            </TableRow>
				            		):(
							            <TableRow>
							                <TableCell scope="row"> No customers to show </TableCell>
							            </TableRow>
			            		)}
				            </TableBody>
				        </Table>
			        </TableContainer>
			    </Paper>
		    </Box>
		</Stack>
	</Page>
)}


export default CustomerHomePage;
