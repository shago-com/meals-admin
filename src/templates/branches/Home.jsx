import React, {useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeliveryIcon from '@mui/icons-material/DeliveryDining';
import PickupIcon from '@mui/icons-material/ShoppingBag';
import DineInIcon from '@mui/icons-material/Dining';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {Link, useNavigate} from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import { Badge, Chip, Grow, Button, ButtonGroup, MenuList, MenuListItem, Menu } from '@mui/material';
import { ArrowDropDown, Storefront, StoreOutlined } from '@mui/icons-material';
// import axios from 'axios';

export const BranchHomePage = ({ ...props }) => {
	const {axios, AskConfirmation, switchNavView, notify, setActiveBranch} = useContext(GlobalStore);
	const [showModal, setModalState] = useState(false);
	const [branchList, setBranchList] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const navigate = useNavigate();

	function deleteBranch(id){
		async function deleteItem(){
			let res, data;

			const payload  = {
				action: 'remove',
				branch: id
			}
			res = await axios.post(`/branches/`, payload)
			data = await res.data;

			if (res.status === 200){
				getData();
				notify("success", "Successfully Deleted order")
			}else{
				notify("warning", data.message)				
			}
		}

		AskConfirmation({
			title: "Delete Branch",
			message: "Are you sure you want to delete this branch?",
			onCancel: () => notify('info', "Operation canceled"),
			onApprove: () => deleteItem(),
		})
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/branches/`);
			data = await res.data;

			if (res.status === 200){
				setBranchList(data.branches)
				console.log("Got Data:", data)
				notify('success', "Got data")
			}else{
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message);
			console.log("Error fetching data:", err);
		}
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
		<Page px={3}>
			<Box className="titlebar">
				<Typography component="h2" className="title"> Store Locations </Typography>
			</Box>

			<Grid container wrap="wrap" sx={{my: 2}}>
				<Link to="/branches/add">
					<StyledButton variant='primary' icon={<AddIcon />}>
						<Typography sx={{mx: 1, color: '#fff'}}> New Location </Typography>
					</StyledButton>
				</Link>
			</Grid>

			<Stack>
				<Grid container spacing={4}>
					{
						branchList.map((branch, idx) =>
							<BranchCard branch={branch} onDelete={deleteBranch} key={idx} />
						)
					}
			    </Grid>
			</Stack>

			{
				showModal && 
				<Backdrop
				 className="overlay"
				 open={showModal} // show the component 
				 invisibe="true" // show the backdrop i.e overlay
				>
					{/* <AssignmentModal deliveryId={selectedDelivery} onClose={() => setModalState(false)}/>	 */}
				</Backdrop>
			}
		</Page>
	)
}



const BranchCard = ({ branch, onDelete, key, ...props }) => {
	const navigate = useNavigate();
	const [showOptions, setOptionState] = useState(false)

	function gotoBranch(branch){
		// setActiveBranch(branch)
		// switchNavView()
		return navigate(`/branches/${branch.branch_id}`)
	}

	function deleteBranch(id){
		onDelete(id)
	}


	return(
		<Grow in={true} key={key} timeout={1000}>
			<Grid item xs={12} md={6} xl={4} mb={4}>
				<Box className="card" sx={{py: 3, px: 4, minHeight: 150, display: 'block', borderRadius: '20px !important' }}>
					{
						branch.is_main_branch &&
						<Chip
							label={"Main"}
							color='error'
							sx={{
							display: 'inline',
							ml: 'auto',
							float: 'right', 
							height: 'max-content'
							}}
						/>
					}

					<Typography className='d-flex align-center bold' sx={{mt: 0, fontSize: 20}}>
						<Storefront sx={{marginRight: 2}} />
						{ branch?.branch_name }
					</Typography>
					
					<hr className='sep' />

					<Typography sx={{mt: .25, opacity: .7, fontWeight: '600', fontSize: 14}}>Branch ID: { branch?.branch_id } </Typography>
					
					<Grid container justifyContent={'start'} gap={2}>
						<Box className="d-flex" alignItems={'center'} sx={{color: branch?.offer_dine_in ? '#ff6104' : 'grey', mt: 2}}>
							<DineInIcon />
							<Typography sx={{ml: 0.25}}> Dine-In</Typography>
						</Box>

						<Box className="d-flex" alignItems={'center'} sx={{color: branch?.offer_pickup ? '#ff6104' : 'grey', mt: 2}}>
							<PickupIcon />
							<Typography sx={{ml: 0.25}}> Pickup </Typography>
						</Box>

						<Box className="d-flex" alignItems={'center'} sx={{color: branch?.offer_delivery ? '#ff6104' : 'grey', mt: 2}}>
							<DeliveryIcon />
							<Typography sx={{ml: 0.25}}> Delivery </Typography>
						</Box>
					</Grid>
					
					<Box justifyContent={'flex-end'} className="d-flex" sx={{mt: 3,}}>
						
						<Box gap={2} className="d-flex" variant='contained' alignItems={'center'} mr={2}>
							<StyledButton sx={{mx: 0}} onClick={(e) => gotoBranch(branch)} variant='secondary' icon={<StoreOutlined />}>
								<Typography sx={{ml: 0}}> Go to Branch </Typography>
							</StyledButton>

							<StyledButton sx={{mx: 0}} onClick={(e) => gotoBranch(branch)} variant='warning' icon={<SettingsIcon />}>
								<Typography sx={{ml: 0}}> Manage </Typography>
							</StyledButton>
						</Box>
					</Box>
				</Box>
			</Grid>
		</Grow>
	)
}



export default BranchHomePage;
