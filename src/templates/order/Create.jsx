import React, {useEffect, useState, useContext} from 'react';
import GlobalStore, { BaseStore } from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FormLoader} from '../../components/loaders';
import {BackButton, Page, ModalPopover, StyledButton} from '../../components/index';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Save from '@mui/icons-material/Save';
import Cancel from '@mui/icons-material/Cancel';
import TextInput from '@mui/material/Input';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Input, Stack } from '@mui/material';
import Divider from '@mui/material/Divider'
export const OrderCreatePage = ({ ...props }) => {
	const {axios, notify, redirect} = useContext(GlobalStore);
	const {authData} = useContext(BaseStore);
	const [customerList, setCustomerList] = useState([]);
	const [productList, setProductList] = useState([]);
	const [orderItems, setOrderItems] = useState([]);
	const [status, setStatus] = useState(""); // delivery status
	const [deliveryOption, setDeliveryOption] = useState(""); // delivery status
	const [deliveryLocation, setDeliveryLocation] = useState(""); // delivery location
	const [customer, setCustomer] = useState("");
	const [branch, setBranch] = useState("");
	const [paymentStatus, setPaymentStatus] = useState(false);
	const [pickupTime, setPickupTime] = useState("");
	const [timeOfOrder, setTimeOfOrder] = useState("");
	const [loading, setLoadingState] = useState(true);
	const [showModal, setModalState] = useState(false);
	const {branches} = authData;

	const ORDER_STATUS = [
		{key: 'pending', label: "Pending"},
		{key: 'confirmed', label: "Confirmed"},
		{key: 'ready', label: "Ready"},
		{key: 'on-route', label: "On-Route to Destination"},
		{key: 'delivered', label: "Delivered"},
		{key: 'picked-up', label: "Picked Up"},
 	]

	function perfromChecks(){
		if(!customer) return {passed: false, message: 'Please select a customer'};
		if(!status) return {passed: false, message: 'Please select the order status'};
		if(orderItems.length < 1) return {passed: false, message: 'Please add at least one order item'};
		return {passed: true, message: ''}
	}


	async function postData(){
		let {passed, message} = perfromChecks();
		function getOrderItems(){
			let _items = []
			for (let _item of orderItems){
				_items.push({ item: _item.item.slug, quantity: _item.quantity})
			}
			return _items
		}
		if (passed){
			try{
				const payload = JSON.stringify({
					customer,
					order_items: getOrderItems(),
					status,
					delivery_location: deliveryLocation,
					delivery_option: deliveryOption,
					branch,
					time_of_order: timeOfOrder,
					pickup_time: pickupTime,
					payment_status: paymentStatus
				})

				const res = await axios.post(`/orders/add/`, payload, {
					headers: {
						"Content-Type": "application/json"
					},
				});
				if (res.status === 201){
					notify('success', "Created new Order")
					setTimeout(() => {
						return redirect('/orders')
					}, 2500)
				}else{
					console.log("Error fetching data:")
					return notify('error', res.data.message)
				}
			}catch(err){
				console.log("Error fetching data:", err)
				return notify('error', err.message)
			}
		}else{
			notify('error', message, 5000);
		}
	}

	function addOrderItem(pkg){
		let pkgs = Array.from(orderItems);
		pkgs.push(pkg);
		setOrderItems(Array.from(pkgs))

		notify('info', "Package added")
	}

	function removeOrderItem(pkg){
		let pkgs = orderItems;
		pkgs.splice(pkg, 1);
		let orders = Array.from(pkgs)

		setOrderItems(orders);
		notify("info", `Food item removed`)
	}

	function closeModal(){
		setModalState(false);
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/orders/add/`);
			data = await res.data;

			if (res.status === 200){
				setCustomerList(data.customers);
				setProductList(data.products);
				setTimeout(() => setLoadingState(false), 1200);
				notify('success', "Got data")
			}
		}catch(err){
			notify('error', err.message)
		}
	}

	useEffect(() => {
		function init(){
			getData();
		}
		init();
	}, [])

	if (loading){
		return(
			<Page>
				<FormLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>

			<Box className="titlebar" sx={{my: 2}}>
				<Typography component="h2" className="heading"> Create New Order </Typography>
			</Box>

			<BackButton path="/orders" />

			<Stack className="card" sx={{my: 2, mt: 4, maxWidth: "850px !important", minHeight: '100px',}}>
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Manifest </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Stack sx={{my: 3}} className="">
							<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Customer </Typography>
								<Select className="" value={customer} fullWidth onChange={(e) => setCustomer(e.target.value)}>
									{
										customerList?.map((person, idx) => (
											<MenuItem value={person?.user?.email} key={idx}> {person?.user?.first_name + ' ' + person?.user?.last_name} </MenuItem>
										))
									} 
								</Select>
							</Box>

							<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Time of Order </Typography>
								<Input onInput={e => setTimeOfOrder(e.target.value)} value={timeOfOrder} className="input" fullWidth disableUnderline type="datetime-local"
								/>
							</Box>

							<Divider />
										
							<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Payment Status  </Typography>
								
								<Grid container justifyContent={'space-between'}>
									<Grid item xs={6}>
										<Box className="d-flex" sx={{alignItems: 'center'}}>
											<Input
												type='radio'
												sx={{p: 1, height: '40px', width: '40px'}}
												name="payment-status"
												className=""
												disableUnderline value={true}
												onInput={e => setPaymentStatus(true)}
												/>
											<Typography> Paid </Typography>
										</Box>
									</Grid>

									<Grid item xs={6}>
										<Box className="d-flex" sx={{alignItems: 'center'}}>
											<Input
												type='radio'
												sx={{p: 1, height: '40px', width: '40px'}}
												name="payment-status"
												className=""
												disableUnderline value={false}
												onInput={e => setPaymentStatus(false)}
												/>
											<Typography> Not Paid </Typography>
										</Box>
									</Grid>
								</Grid>
							</Box>

							<Divider />

							<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Order Status  </Typography>
								<Select 
								 value={status} fullWidth
								 onChange={(e) => setStatus(e.target.value)} 
								 className="no-shadow">
								 	{ORDER_STATUS.map((stat, idx) => <MenuItem value={stat.key} key={idx}> {stat.label} </MenuItem> )}
								 </Select>
							</Box>

							<Divider />

							<Box className="form-group">
								<Grid sx={{mb: .7}} className="flexbox" container wrap="wrap">
									<Typography sx={{mb: .3, flexGrow: 1}}> Order Items </Typography>

									<Button onClick={() => setModalState(true)} sx={{mb: .3}} size="small" variant="outlined" color="secondary"> Add Food Item  </Button>
								</Grid>

								<Paper sx={{ width: '100%'}}>
							        <TableContainer>
							          <Table
							          	className="table"
							            sx={{ minWidth: 370, maxHeight: 120 }}
							            size='medium'
							          >
							          	<TableHead>
									      <TableRow>
									          <TableCell sx={{ fontWeight: 600}}> Food Item </TableCell>
									          <TableCell sx={{ fontWeight: 600}}> Qty </TableCell>
									          <TableCell sx={{ fontWeight: 600}}> </TableCell>
									      </TableRow>
									    </TableHead>
							            
							            <TableBody>
							            	{ orderItems ?
							            		orderItems.map(({item, quantity}, idx) => (
										            <TableRow hover key={idx}>										                	
										                <TableCell scope="row"> 
										                	<Grid container sx={{ alignItems: 'center'}}>
										                		<img style={{ width: 70, height: 50, }} alt={item.name} src={item.image.url} />
										                		<Typography sx={{ ml: 2}}> {item.name} </Typography>
										                	</Grid>
										                </TableCell>
										                <TableCell scope="row"> {quantity} </TableCell>
										                <TableCell scope="row">
										                	<StyledButton
										                		sx={{ m: 0 }}
											                	variant="danger"
										                		onClick={() => removeOrderItem(item)}
										                		icon={<Cancel />}
										                	/>
										                </TableCell>
										            </TableRow>
							            		))
							            	: 
							            	<TableRow>
								                <TableCell scope="row"> No orderItems to show </TableCell>
							            	</TableRow>
							            }
							            </TableBody>

							          </Table>
							        </TableContainer>
							    </Paper>
							</Box>

							<Divider />
							
							<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Delivery Option  </Typography>
								
								<Grid container justifyContent={'space-between'}>
									<Grid item xs={6}>
										<Box className="d-flex" sx={{alignItems: 'center'}}>
											<Input
												type='radio'
												sx={{p: 1, height: '40px', width: '40px'}}
												name="delivery-option"
												className=""
												disableUnderline value={'delivery'}
												onInput={e => setDeliveryOption(e.target.value)}
												/>
											<Typography> Delivery </Typography>
										</Box>
									</Grid>

									<Grid item xs={6}>
										<Box className="d-flex" sx={{alignItems: 'center'}}>
											<Input
												type='radio'
												sx={{p: 1, height: '40px', width: '40px'}}
												name="delivery-option"
												className=""
												disableUnderline value={'pickup'}
												
												onInput={e => setDeliveryOption(e.target.value)}
												/>
											<Typography> Pick Up </Typography>
										</Box>
									</Grid>
								</Grid>
							</Box>
							
							<Divider />

							{
								deliveryOption === "delivery" ?
									<Box className="form-group" sx={{mb: 2}}>
										<Typography sx={{mb: .3}}> Delivery Location  </Typography>
										<Input type="text"
											value={deliveryLocation} fullWidth
											onChange={(e) => setDeliveryLocation(e.target.value)}
											className="input no-shadow" disableUnderline
											label={'Time of Pickup'}
										/>
									</Box>
								: deliveryOption === "pickup" ?
									<Box className="form-group" sx={{mb: 2}}>
										<Typography sx={{mb: .3}}> Pickup Time  </Typography>
										<Input type="time"
											value={pickupTime} fullWidth
											onChange={(e) => setPickupTime(e.target.value)}
											className="input no-shadow" disableUnderline
											label={'Time of Pickup'}
										/>
									</Box>
								: null
							}

						</Stack>

						<StyledButton variant="primary" onClick={postData} icon={<Save />}>							
							<Typography sx={{mx: 1, color: '#ffe'}}> Create Order </Typography>
						</StyledButton>
					</form>
				</Stack>
			</Stack>

			{ 
				showModal &&
				 <ModalPopover
				  render={
				  	<OrderFormModal
					  	menu={productList}
					    onSubmit={data => addOrderItem(data)}
					    onClose={closeModal} 
					/>
				 }
				 show={showModal}
				/>
			}
		</Page>
	)
}


const OrderFormModal = ({ onClose, onSubmit, menu }) =>{
	const {notify} = useContext(GlobalStore)
	const [item, setFoodItem] = useState()
	const [quantity, setQuantity] = useState()

	function handleSubmit(){
		if (!item || !quantity){
			return notify("error", "Please fill all the fields.")
		}
		onSubmit({
			item,
			quantity
		})
		onClose()
	}


	return(
		<Box className="overlay-inner">
		<Box className="card" sx={{px:  2, py: 3, maxWidth: '500px' }}>
      		<Typography component="h2" className="form-title"> Add Order Item </Typography>

		    <form onSubmit={e => e.preventDefault()}>
		        <Stack sx={{}} className="">
					<Box className="form-group" sx={{mb: 2}}>
						<Typography sx={{mb: .3}}> Select Food Item </Typography>
						<Select
							renderValue={({name}) => <Typography> {name} </Typography>}
							value={item}
							fullWidth
							onChange={(e) => setFoodItem(e.target.value)}
						 >
							{
								menu?.map((item, idx) => (
									<MenuItem value={item} key={idx}>
										<img alt="" src={item.image.url} style={{ width: 70, height: 50 }} />
										<Typography sx={{ ml: 2 }}> {item.name} </Typography>
									</MenuItem>
								))
							} 
						</Select>
					</Box>

					<Box className="form-group">
						<Typography> Quantity </Typography>
						<TextInput disableUnderline className="input" variant="contained" onChange={e => setQuantity(e.target.value)} value={quantity} type="number" min={1} />
					</Box>
				</Stack>
			</form>

			<Grid container>
				<StyledButton sx={{mr: 2}} onClick={handleSubmit} variant="primary" icon={<Save />}>
					<Typography> Add to Order </Typography>
				</StyledButton>

				<StyledButton icon={<Cancel />} onClick={onClose} variant="warning">
					<Typography> Cancel </Typography>
				</StyledButton>
			</Grid>

		</Box>
		</Box>
	)
}

export default OrderCreatePage;
