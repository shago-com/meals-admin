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
import { Badge, Chip, Grow } from '@mui/material';
// import axios from 'axios';

export const CouponHomePage = ({ ...props }) => {
	const {axios, AskConfirmation, notify} = useContext(GlobalStore);
	const [coupons, setCouponsList] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const navigate = useNavigate();

	function performAction({ action, objectIds, destructive=false }){
		async function doAction(){
			let res, data;

			const payload  = {
				action,
				objects: objectIds
			}
			res = await axios.post(`/coupons/`, payload)
			data = await res.data;

			if (res.status === 200){
				getData();
				notify("success", `Operation was Successful`)
			}else{
				notify("warning", data.message)				
			}
		}

        if (destructive){
            AskConfirmation({
                title: "Delete Branch",
                message: "Are you sure you want to delete this coupon?",
                onCancel: () => notify('info', "Operation canceled"),
                onApprove: () => doAction(),
            })
        }else{
            doAction()
        }
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/coupons/`);
			data = await res.data;

			if (res.status === 200){
				setCouponsList(data.coupones)
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
		<Page>
			<Box className="titlebar">
				<Typography component="h2" className="title"> Store Branch Locations </Typography>
			</Box>

			<Grid container wrap="wrap" sx={{my: 2}}>
				<Link to="/coupones/add">
					<StyledButton variant='primary' icon={<AddIcon />}>
						<Typography sx={{mx: 1, color: '#fff'}}> New Branch Location </Typography>
					</StyledButton>
				</Link>
			</Grid>

			<Stack>
				<Grid container spacing={8}>
					{
						coupons.map((coupon, idx) =>
							<Grow in={true} timeout={1000}>
								<Grid item key={idx} xs={12} md={6}>
									<Box className="card" sx={{p: 2, minHeight: 150, display: 'block' }}>
										{
											coupon.is_expired &&
											<Chip label={"Expired"} color='error' sx={{
												display: 'inline',
												ml: 'auto'
											}} />
										}

										<Typography sx={{mt: 0, fontSize: 25}}> { coupon?.name } </Typography>
										<Typography sx={{mt: .25, opacity: .7, fontWeight: '600', fontSize: 14}}>{ coupon?.code } </Typography>
										
										<Grid container justifyContent={'start'} gap={2}>
											<Box className="d-flex" sx={{color:'#ff6104', mt: 2}}>
												<DineInIcon />
												<Typography sx={{ml: 1.25}}> {coupon?.value} </Typography>
											</Box>
										</Grid>
										
										<Box justifyContent={'end'} className="d-flex" sx={{mt: 3,}}>
											
											<StyledButton onClick={(e) => e.preventDefault()} variant='secondary' icon={<SettingsIcon />}>
												<Typography sx={{ml: 1}}> Edit Coupon </Typography>
											</StyledButton>

											<StyledButton onClick={() => console.log(coupon?.coupon_id)} variant='warning' icon={<DeleteIcon />} />
										</Box>
									</Box>
								</Grid>
							</Grow>
						)
					}
			    </Grid>
			</Stack>

		</Page>
	)
}

export default CouponHomePage;
