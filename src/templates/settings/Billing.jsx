import React, {useEffect, useState, useContext} from 'react';
import {BarChart, StyledButton} from '../../components'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import {Typography, Divider, Grid} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {DashboardLoader} from '../../components/loaders';
import EditIcon from '@mui/icons-material/Edit';
import {Page} from '../../components/index';
import Stack from '@mui/material/Stack';
import logo from '../../logo.svg'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageIcon from '@mui/icons-material/Filter';
import { ChangeCircle, ChangeHistory, ConnectWithoutContact } from '@mui/icons-material';


export const BillingControls = ({ data, ...props}) => {
	const {token, apiUrl, notify, org, parseDate} = useContext(GlobalStore);

	return(
		<Box {...props}>
			<Box className="shadow titlebar" sx={{my: 2, backgroundColor: '#fff', borderRadius: 2, p: 2}}>
				<Typography component="h2" className="title"> Billing Info </Typography>
			</Box>

			<Stack>
				<Box className="card" sx={{p: 3, my: 3.5}}>
					<Typography component="h2" className="bold"> Billing Plan </Typography>
					<Typography component="h2" sx={{mt: 1}}> {data?.billing_plan} </Typography>
				</Box>

				<Box className="card" sx={{p: 3, my: 3.5}}>
					<Typography component="h2" className="bold"> Billing Method </Typography>
					
				</Box>

				<Box className="card" sx={{p: 3, my: 3.5}}>
					<Typography component="h2" className="bold"> Current Billing Date </Typography>
					<Typography component="h2" sx={{mt: 1, mb: 2}}> {data?.current_billing_period} ({data?.billing_start}) </Typography>

					<Divider />

					<Typography component="h2" className="bold"> Next Billing Date </Typography>
					<Typography component="h2" sx={{mt: 1}}> {data?.next_billing_period} ({data?.billing_end}) </Typography>
				</Box>
			</Stack>

			<Box className="shadow titlebar" sx={{my: 2, backgroundColor: '#fff', borderRadius: 2, p: 2}}>
				<Typography component="h2" className="title"> Payment Info </Typography>
			</Box>

			<Stack>
				<Box className="card" sx={{p: 3, my: 3.5}}>
					<Typography component="h2" className="bold"> Bank Information </Typography>
					<Typography component="h2" sx={{mt: 1}}> {data?.billing_plan} </Typography>
				</Box>

				<Box className="card" sx={{p: 3, my: 3.5}}>
					<Typography component="h2" className="bold"> Payment Schedule </Typography>
					
				</Box>
			</Stack>
		</Box>
	)
}


export default BillingControls;
