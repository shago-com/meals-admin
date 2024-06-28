import React, {useEffect, useState, useContext} from 'react';
import {useNavigation, useLocation} from 'react-router-dom'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, StyledButton, BackButton} from '../../components';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import {Link} from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import { Badge, Chip } from '@mui/material';


export const NotificationsHomePage = ({ ...props }) => {
	const {axios, notify} = useContext(GlobalStore);
	const [notifications, setNotifications] = useState([]);
	const [loading, setLoadingState] = useState(true);

	async function deleteNotification(id){
        let res, data;

        const payload  = JSON.stringify({
            items: [id]
        })
        res = await axios.delete(`/orders/`, payload, {
            headers: { "Content-Type": "application/json" }
        })
        data = await res.data;

        if (res.status === 200){
            getData();
            notify("success", "Deleted order")
        }else{
            notify("warning", data.message)				
        }
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/notifications/`);
			data = await res.data;

			if (res.status === 200){
				setNotifications(data.notifications)
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

	const nav = useLocation()

	if (loading){
		return(
			<Page>
				<StaffLoader loading={loading} />
			</Page>
		)
	}

	console.log("Navigations:", nav)

	return(
		<Page>
			<Box className="titlebar" sx={{mb: 3}}>
				<Typography component="h2" className="title"> Notifications </Typography>
			</Box>

			<BackButton />

			<Stack sx={{my: 3}}>
				<Grid container spacing={8}>
					{
						notifications.map((notice, idx) => 
							<Grid item key={idx} xs={12}>
								<Box className="card" sx={{p: 2, minHeight: 50, display: 'block' }}>
									<Typography className='bold'> {notice?.title} </Typography>
									<Typography className='small'> {notice?.message} </Typography>

									<StyledButton variant='secondary' size="small"> Read More </StyledButton>
								</Box>
							</Grid>
						)
					}
			    </Grid>
			</Stack>

		</Page>
	)
}

export default NotificationsHomePage;
