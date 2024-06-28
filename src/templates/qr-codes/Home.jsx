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
import { QRCode, } from 'react-qrcode-logo';

export const QRCodeHomePage = ({ ...props }) => {
	const {axios, AskConfirmation, notify, place} = useContext(GlobalStore);
	const [qrCodes, setQrCodeList] = useState([
		{value: `https://${place}.myshago.online/`,  logo: 'http://localhost/files/places/logo/the-ring_vqgPZaI.png'},
		{value: `https://${place}.myshago.online/`, logo: 'http://localhost/files/places/logo/the-ring_vqgPZaI.png'},
		{value: `https://${place}.myshago.online/`, logo: 'http://localhost/files/places/logo/the-ring_vqgPZaI.png'},
		{value: `https://${place}.myshago.online/`, logo: 'http://localhost/files/places/logo/the-ring_vqgPZaI.png'},
		{value: `https://${place}.myshago.online/`, logo: 'http://localhost/files/places/logo/the-ring_vqgPZaI.png'},
	]);
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
			res = await axios.get(`/qr-codes/`);
			data = await res.data;

			if (res.status === 200){
				setQrCodeList(data.qr_codes)
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
			// getData();
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
				<Typography component="h2" className="title"> QR Codes </Typography>
			</Box>

			<Grid container wrap="wrap" sx={{my: 2}}>
				<Link to="/coupones/add">
					<StyledButton variant='primary' icon={<AddIcon />}>
						<Typography sx={{color: '#fff'}}> New QR Code </Typography>
					</StyledButton>
				</Link>
			</Grid>

			<Stack>
				<Grid container spacing={8} columns={{ sx: 6, md: 6, lg: 10,}}>
                    {/* <Grow in={true} timeout={1000}> */}
                        {
							qrCodes.map((code, idx) => 
								<Grid display={'flex'} justifyContent={'center'} key={idx} item xs={6} sm={6} md={3} lg={3} xl={2}>
									<Box className="card" sx={{p: 2, minHeight: 150, maxWidth:'250px !important', display: 'block', borderRadius: '30px !important'}}>
										<Box className="d-flex qr-code-wrapper" p={0.5} justifyContent={'center'}>
											<QRCode
												enableCORS
												// style={{ width: '100%', height: '100%', maxWidth: '250px', borderRadius: '20px !important' }}
												size={200}
												value={code.value}
												id={`qr-code-${idx}`}
												// logoImage={code.logo}
												logoHeight={70}
												logoWidth={70}
												eyeRadius={[
													{ // top/left eye
														outer: [20, 20, 0, 20],
														inner: [0, 20, 20, 20],
													},
													[20, 20, 20, 0], // top/right eye
													[20, 0, 20, 20], // bottom/left
												]}
												// eyeColor={'#e3810a'}
												bgColor='#160d07'
												fgColor='white'
												qrStyle="squares"
												removeQrCodeBehindLogo
											/>
										</Box>
										
										<Box justifyContent={'center'} className="d-flex" sx={{mt: 1.25}}>
											<StyledButton onClick={(e) => e.preventDefault()} variant='secondary' icon={<SettingsIcon />}>
												<Typography sx={{ml: 1}}> Manage QR Code </Typography>
											</StyledButton>
										</Box>
									</Box>
								</Grid>
							)
						}					


                    {/* </Grow> */}
			    </Grid>
			</Stack>

		</Page>
	)
}

export default QRCodeHomePage;
