import React, {Fragment, useEffect, useState, useContext} from 'react';
import {BarChart, StyledButton} from '../../components'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {DashboardLoader} from '../../components/loaders';
import {BackButton, Page} from '../../components/index';
import MenuItem from '@mui/material/MenuItem';
import CheckIcon from '@mui/icons-material/CheckCircle';
import UncheckIcon from '@mui/icons-material/CancelRounded';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate, useParams } from 'react-router-dom';
import { AdsClick, ContentCopy, CopyAll, DeleteForever, Edit, Stars } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';



export const BranchDetailPage = ({ ...props }) => {
	const {notify, AskConfirmation, axios, clipboardCopy} = useContext(GlobalStore);
	const [branch, setBranch] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const router = useNavigate();
	const {branchId} = useParams();

	async function init(){
		let res, data;

		try{
			res = await axios.get(`/branches/${branchId}/`);
			
			if (res.status === 200){
				console.log("BRANCH DATA: ", res.data)
				setBranch(res.data.branch);
				setTimeout(() => setLoadingState(false), 1200);
				notify('success', "Got data")
			}else{
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message)
			console.log("Error fetching data:", err)
		}
	}

	async function changebranchStatus(status){
		notify('info', `branch status changed to "${status}"`)
	}

	async function switchLiveMode(mode){
		// axios.post('')
	}

	async function makeBranchPrimary(branchId){
		async function deleteBranch(){
			await axios.post(`/branches/${branchId}/delete/`)
		}
		
		AskConfirmation({
			onCancel: () => notify('info', "Operation Canceled"),
			onApprove: () => deleteBranch()
		})
	}

	useEffect(() => {
		init();
	}, [])

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>

			<BackButton sx={{ml: 0}} path="/branches" />

			<Grid container wrap="wrap" sx={{my: 2, justifyContent: 'space-between', alignItems: 'center'}}>
				<Typography component="h2" className="heading">Branch Location Detail </Typography>

				<Grid item >
					{
						branch?.live_mode ?
						<StyledButton onClick={() => switchLiveMode(false)} variant='warning' icon={<AdsClick />}>
							<Typography> Go to Test Mode! </Typography>
						</StyledButton>
						:
						<StyledButton onClick={() => switchLiveMode(true)} variant='success' icon={<AdsClick />}>
							<Typography> Go Live! </Typography>
						</StyledButton>
					}

				</Grid>
			</Grid>

			<Stack sx={{pb: 5,}}>

				<Box sx={{ width: '100%', mb: 4 }}>

				    <Paper sx={{ width: '100%', mb: 2 }} className='card'> 
				    	<TableContainer>
				          	<Table
					          	className="table"
					            sx={{ minWidth: 850 }}
					            size='medium'
					          >
							    <TableHead>
							      <TableRow>
							          <TableCell sx={{ fontWeight: 600}}> Branch Name </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Branch Id </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Store mode </TableCell>
							      </TableRow>
							    </TableHead>
					            
					            <TableBody>
						            <TableRow hover>
				                        <TableCell scope="row"> {branch?.branch_name} </TableCell>
				                        <TableCell scope="row"> {branch?.branch_id} <IconButton size='small' onClick={() => clipboardCopy(branch?.branch_id)}> <ContentCopy size="small" /> </IconButton> </TableCell>
				                        <TableCell scope="row">
											<Chip label={ branch?.live_mode ? 'Live': 'Test'} color={
												branch?.live_mode ? "success" : "warning"
											} /> 
											</TableCell>
						            </TableRow>		            		
					            </TableBody>
					        
					            <TableHead>
							      <TableRow>
							          <TableCell sx={{ fontWeight: 600}}> Offers Dine In </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Offers Pickup </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Offers Delivery </TableCell>
							      </TableRow>
							    </TableHead>

							    <TableBody>
						            <TableRow hover>
						                <TableCell scope="row"> {branch?.offer_dine_in ? <CheckIcon color='success' /> : <UncheckIcon color='error' /> } </TableCell>
						                <TableCell scope="row"> {branch?.offer_pickup ? <CheckIcon color='success' /> : <UncheckIcon color='error' /> } </TableCell>
						                <TableCell scope="row"> {branch?.offer_delivery ? <CheckIcon color='success' /> : <UncheckIcon color='error' /> } </TableCell>
						            </TableRow>		            		
					            </TableBody>
					        </Table>
				        </TableContainer>
				    </Paper>
			    </Box>

				<Box className="card" sx={{p: 3}}>
					Branch Actions 
					<Grid container>
						<StyledButton variant="secondary" icon={<Stars />} onCLick={changebranchStatus}> <Typography>Set as main branch </Typography> </StyledButton>
						<StyledButton variant='info' icon={<Edit />} onCLick={changebranchStatus}> <Typography>Rename branch </Typography> </StyledButton>
						<StyledButton variant='danger' icon={<DeleteForever />} onCLick={changebranchStatus}> <Typography> Delete Branch </Typography> </StyledButton>
					</Grid>
				</Box>
			</Stack>

		</Page>
	)
}


export default BranchDetailPage;
