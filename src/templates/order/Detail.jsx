import React, {Fragment, useEffect, useState, useContext} from 'react';
import {BarChart, StyledButton} from '../../components'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {DashboardLoader} from '../../components/loaders';
import {BackButton, Page} from '../../components/index';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
import { InputLabel } from '@mui/material';
import { 
	Print as PrintIcon,
	ReceiptLong as InvoiceIcon,
	DeleteForever as DeleteIcon,
	Cancel as CancelIcon
} from '@mui/icons-material';



const ORDER_STATUS = [
	{key: 'pending', label: 'Pending'},
	{key: 'confirmed', label: 'Confirmed'},
	{key: 'ready', label: 'Ready'},
	{key: 'on-route', label: 'On Route'},
	{key: 'delivered', label: 'Delivered'},
	{key: 'picked-up', label: 'Picked Up'},
]


export const OrderDetailPage = ({ ...props }) => {
	const {notify, normalizeDigits, axios} = useContext(GlobalStore);
	const [order, setOrder] = useState(null);
	const [orderStatus, setOrderStatus] = useState("pending");
	const [paymentStatus, setPaymentStatus] = useState("not-paid");
	const [loading, setLoadingState] = useState(true);
	const router = useNavigate();
	const {orderId} = useParams();

	function printObject(){
		window.print()
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/orders/${orderId}/`);
			data = await res.data;
			
			if (res.status === 200 && res.data.order){
				setOrder(data.order);
				setOrderStatus(data.order.status);
				setPaymentStatus(data.order.payment_status ? 'paid' : 'not-paid');
				setTimeout(() => setLoadingState(false), 1200);
				console.log("ORDER", res.data)
				notify('success', "Got data")
			}else{
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message)
			console.log("Error fetching data:", err)
		}
	}

	async function changeOrderStatus(status){
		const payload = JSON.stringify({
			action: 'change-order-status',
			status
		})
		const res = await axios.post(`/orders/${orderId}/`, payload, {
			headers: {'Content-Type': 'application/json'}
		})
		if (res.status === 200){
			setOrderStatus(status)
			notify('info', `Order status changed to "${status}"`)
		}else{
			notify('error', `Order status couldn't be changed to "${status}"`)
		}
	}

	async function changePaymentStatus(){
		const payload = JSON.stringify({
			action: 'change-payment-status',
		})
		const res = await axios.post(`/orders/${orderId}/`, payload, {
			headers: {'Content-Type': 'application/json'}
		})
		if (res.status === 200){
			setPaymentStatus('paid')
			// getData()
			notify('info', `Order Payment status changed to "paid"`)
		}else{
			notify('error', `Order payment status couldn't be changed!`)
		}
	}

	function colorize(stat){
		switch (stat){
			case 'pending': return 'cornflowerblue'
			case 'confirmed': return 'orange'
			case 'ready': return 'cyan'
			case 'on-route': return 'limegreen'
			case 'delivered': return 'green'
			default: return 'lavender'
		}
	}

	useEffect(() => {
		getData();
	}, [paymentStatus])

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>

			<BackButton sx={{ml: 0}} path="/orders" />

			<Grid container wrap="wrap" sx={{my: 1, justifyContent: 'space-between', alignItems: 'center'}}>
				<Typography component="h2" className="heading">Customer Order detail </Typography>

				
				<Grid flexGrow={1} container wrap="wrap" sx={{my: 1, width: 'auto', justifyContent: 'flex-end', alignItems: 'center'}}>
					{
						order?.payment_status ?
						<Chip
							sx={{
								px: 3.25,
								py: 2.5,
								mr: 2, borderRadius: 30
							}}
							label={"Paid"}
							color={"success"}
						/>
						:
						<Select
							color={order?.payment_status ? "success" : "error"}
							variant='standard'
							disableUnderline
							value={paymentStatus}
							onChange={changePaymentStatus}
							sx={{
								background: order?.paid ? "green" : "red",
								borderRadius: 40,
								px: 3.25,
								py: 0.25,
								height: '40px !important',
								fontSize: '14px',
								fontWeight: 'bold',
								mr: 2,
							}}
						>
							<MenuItem selected disabled fullwidth sx={{ fontSize: '13px', fontWeight: '600'}} p={0} value={'not-paid'}> Not Paid </MenuItem>
							<MenuItem fullwidth sx={{ fontSize: '13px', fontWeight: '600'}} p={0} value={'paid'}> Paid </MenuItem>
						</Select>
					}



					<Select
						color='secondary'
						variant='standard'
						disableUnderline
						value={orderStatus}
						onChange={(e) => changeOrderStatus(e.target.value)}
						sx={{
							background: colorize(orderStatus),
							borderRadius: 40,
							px: 3.25,
							py: 0.25,
							height: '40px !important',
							fontSize: '14px',
							fontWeight: 'bold',
						}}
					>
						{
							ORDER_STATUS.map(({ key, label}) => 
								<MenuItem fullwidth sx={{ fontSize: '13px', fontWeight: '600'}} key={key} p={0} value={key}> {label} </MenuItem>
							)
						}
					</Select>
				</Grid>
			</Grid>

			<Stack sx={{py: 5}}>

				<Box sx={{ width: '100%' }}>

				    <Paper sx={{ width: '100%', mb: 2 }}>
				    	<TableContainer>
				          	<Table
					          	className="table"
					            sx={{ minWidth: 850 }}
					            size='medium'
					          >
							    <TableHead>
							      <TableRow>
							          <TableCell sx={{ fontWeight: 600}}> Customer Name </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Phone number </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Email </TableCell>
							      </TableRow>
							    </TableHead>
					            
					            <TableBody>
						            <TableRow hover>
				                        <TableCell scope="row">
										{order?.customer?.user?.first_name} {order?.customer?.user?.last_name}
										</TableCell>
				                        <TableCell scope="row"> {order?.customer?.phone} </TableCell>
				                        <TableCell scope="row"> {order?.customer?.user?.email} </TableCell>
						            </TableRow>		            		
					            </TableBody>
					        </Table>
				        </TableContainer>
				    </Paper>

					<Typography component="h2" className="title bold" sx={{mt: 3, mb: 2}}> Order info </Typography>
				    
					<Paper sx={{ width: '100%', mb: 2 }}>
				    	<TableContainer>
				          	<Table
					          	className="table"
					            sx={{ minWidth: 850 }}
					            size='medium'
					          >
					            <TableHead>
							      <TableRow>
							          <TableCell sx={{ fontWeight: 600}}> Order ID </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Creation time </TableCell>
							      </TableRow>
							    </TableHead>

							    <TableBody>
						            <TableRow hover>
						                <TableCell scope="row"> {order?.order_id} </TableCell>
						                <TableCell scope="row"> {order?.created_on} ago</TableCell>
						            </TableRow>		            		
					            </TableBody>
					        </Table>
				        </TableContainer>
				    </Paper>


					<Typography component="h2" className="title bold" sx={{mt: 3, mb: 2}}> Order items </Typography>

				    <Paper sx={{ width: '100%', mb: 2 }}>
						<TableContainer>
				          	<Table>
							    <TableHead>
							      <TableRow>
							          <TableCell sx={{ fontWeight: 600}}> Food Item </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Quantity </TableCell>
							          <TableCell sx={{ fontWeight: 600}}> Sub total </TableCell>
							      </TableRow>
							    </TableHead>

							    <TableBody>
							     {order?.items?.map((item, idx) => (
						            <TableRow hover>
						                <TableCell scope="row"> 
						                	<Grid container sx={{ alignItems: 'center' }}>
						                		<img src={item?.item?.image?.url} alt="" style={{ width: 60, height: 50, borderRadius: 10 }}/>
						                		<Typography sx={{ml: 2}} className='bold'> {item.item.name} </Typography>
						                	</Grid>
						                </TableCell>

						                <TableCell className='bold' scope="row"> {item.quantity}</TableCell>
						                <TableCell className='bold' scope="row"> {normalizeDigits(String(item.total))} </TableCell>
						            </TableRow>	
						         ))}	            		
					            </TableBody>

				          	</Table>
				        </TableContainer>
				    </Paper>

					<Box sx={{p: 3}} className="card no-print">
						<Typography className='bold'> Actions </Typography>

						<Grid container>
							<StyledButton icon={<InvoiceIcon />} variant='success'> <Typography> Send Invoice </Typography> </StyledButton>
							<StyledButton onClick={printObject} icon={<PrintIcon />} variant='secondary'> <Typography> Print Order </Typography> </StyledButton>
							<StyledButton icon={<CancelIcon />} variant='warning'> <Typography> Cancel Order </Typography> </StyledButton>
							<StyledButton icon={<DeleteIcon />} variant='danger'> <Typography> Delete Order </Typography> </StyledButton>
						</Grid>
					</Box>
			    </Box>
			</Stack>

		</Page>
	)
}


export default OrderDetailPage;
