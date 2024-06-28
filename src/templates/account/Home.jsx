import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import { Typography, Avatar } from '@mui/material';
import ShieldIcon from '@mui/icons-material/ShieldTwoTone';
import FaceIcon from '@mui/icons-material/Face';
import { Page, StyledButton } from '../../components';
import GlobalStore from '../../store';
import {useNavigate, Link} from 'react-router-dom'


export const ProfileHome = ({ }) => {
	const {getUserData} = useContext(GlobalStore)
	const {user, token} = getUserData()
	const redirect = useNavigate()

	return(
		<Page>
			<Box className="titlebar">
				<Typography className="title"> Account Settings </Typography>
			</Box>

			<Box sx={{maxWidth: 900}}>
				<Box className="card" sx={{p: 3, my: 3}}>
					<Avatar icon={<FaceIcon />} sx={{width: 120, height: 120, my: 3}}></Avatar>

					<Typography sx={{my: 2, fontSize: 20}}>
						{`${user?.first_name} ${user?.last_name}`}
					</Typography>

					<Typography sx={{my: 2, fontSize: 18}}> {user?.email} </Typography>

					<Link to="/account/change-password">
						<StyledButton variant="warning" onClick={redirect('/account/change-password')} sx={{ml: 0, px: 1.5}} icon={<ShieldIcon sx={{mr: 1.25}}/>}>
							<Typography> Change Password </Typography>
						</StyledButton>
					</Link>
				</Box>
			</Box>

		</Page>
	)
}

export default ProfileHome;