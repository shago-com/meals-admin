import React, {useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import Add from '@mui/icons-material/Add';
import {Link, useNavigate} from 'react-router-dom';
import Chip from '@mui/material/Chip';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Backdrop from '@mui/material/Backdrop';
import SortLabel from '@mui/material/TableSortLabel';
import { 
	sortDataById, sortDataByStatus, sortDataByPaymentStatus,
	sortDataByAlphabetical, getChipColor,
} from "../../utils";
import { Input } from '@mui/material';




export const OrderHomePage = ({ ...props }) => {
	const {axios, AskConfirmation, notify} = useContext(GlobalStore);
	const [showModal, setModalState] = useState(false);
	const [selection, setSelection] = useState([]);
	const [sorting, setSortingState] = useState(null);
	const [orderList, setOrderList] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const [sortMode, setSortingMode] = useState(true);
	const redirect = useNavigate()

	// redirect()

	function sortData(field='id'){
		setSortingState(field)
		let sorted;
		switch (field) {
			case 'status':
				sorted = sortDataByStatus(
					orderList, 
					(sortMode ? 'desc' : 'asc'),
					(sortMode ? ['pending', 'confirmed'] : ['delivered', 'picked-up']))
				setSortingMode(!sortMode)
				break;
			case 'payment':
				sorted = sortDataByPaymentStatus(orderList,(sortMode ?'asc' : 'desc'))
				setSortingMode(!sortMode)
				break;
			case 'customer':
				sorted = sortDataByAlphabetical(orderList, 'customer', (sortMode ?'asc' : 'desc'))
				setSortingMode(!sortMode)
				break;
			default:
				sorted = sortDataById(orderList, (sortMode ?'asc' : 'desc'))
				setSortingMode(!sortMode)
				break;
		}

		setOrderList(sorted);
	}


	function confirmOrder(orderId){
		notify("info", "Order status changed to Confirmed")
	}

	function toggleSelectAll(){
		let _select = []
		let boxes = document.querySelectorAll(`.checkbox`)

		if (selection.length === orderList.length){
			boxes.forEach( box => {
				box.children[0].checked = false
			})
			setSelection([ ..._select])
		}else{
			for (let i=0; i < orderList.length; i++){
				_select.push(orderList[i].order_id);
				boxes.forEach( box => {
					box.children[0].checked = true
				})
			}
			setSelection([ ..._select])
		}

	}

	function deleteOrder(id){
		async function deleteItem(){
			let res, data;

			const payload  = JSON.stringify({
				items: [id],
				action: 'delete'
			})
			res = await axios.post(`/orders/`, payload, {
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

		AskConfirmation({
			topic: "Delete Order",
			message: "Are you sure you want to delete this order?",
			onCancel: () => notify('info', "Operation canceled"),
			onApprove: () => deleteItem(),
		})
	}

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/orders/`);
			data = await res.data;

			if (res.status === 200){
				setOrderList(data.orders)
				notify('success', "Got data")
			}else{
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message);
			console.log("Error fetching data:", err);
		}
	}

	function toggleSelection(id){
		let _select = selection
		if (selection.includes(id)){
			let idx = selection.indexOf(id)
			selection.splice(idx, 1)
			setSelection([..._select])
		}else{
			selection.push(id)
			setSelection([..._select])
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
			<Box className="titlebar d-flex" justifyContent={'space-between'}>
				<Typography component="h2" className="title"> Customer Orders </Typography>
			</Box>

			<Grid container wrap="wrap" sx={{my: 2}}>
				<Link to="/orders/add">
					<StyledButton sx={{ml: 0}} variant='primary' icon={<Add />}>
						<Typography sx={{mx: 1, color: '#fff'}}> New Order </Typography>
					</StyledButton>
				</Link>
			</Grid>

			<Stack>
				<Box sx={{ width: '100%' }}>

					<Typography> {selection.length} of {orderList.length} selected </Typography>

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
										<Input className='checkbox' disableUnderline onInput={toggleSelectAll} type='checkbox'  />
									</TableCell>

									<TableCell sx={{ fontWeight: 600}}>
										Order ID
									</TableCell>


									<TableCell sx={{ fontWeight: 600}}>
										<SortLabel
											active={sorting === 'customer'}
											onClick={() => sortData('customer')} 
											hideSortIcon={false}
											direction={sortMode === false ? 'asc' : 'desc'}
										> Customer </SortLabel>
									</TableCell>


									<TableCell sx={{ fontWeight: 600}}>
										<SortLabel
											active={sorting === 'created'}
											onClick={() => sortData('created')} 
											hideSortIcon={false}
											direction={sortMode === false ? 'asc' : 'desc'}
										> Created </SortLabel>
									</TableCell>

									<TableCell sx={{ fontWeight: 600}}>
										<SortLabel
											active={sorting === 'payment'}
											onClick={() => sortData('payment')} 
											hideSortIcon={false}
											direction={sortMode === false ? 'asc' : 'desc'}
										> Transaction </SortLabel>
									</TableCell>


									<TableCell sx={{ fontWeight: 600}}>
										<SortLabel
											active={sorting === 'status'}
											onClick={() => sortData('status')} 
											hideSortIcon={false}
											direction={sortMode === false ? 'asc' : 'desc'}
										> Status </SortLabel>
									</TableCell>


									<TableCell sx={{ fontWeight: 600}}> Actions </TableCell>
						      </TableRow>
						    </TableHead>
				            
				            <TableBody>
				            	{ orderList.length > 0 ?
				            		orderList.map((order, idx) => (
							            <TableRow hover key={idx}>
								            <TableCell scope="row">
						                		<Input disableUnderline size='medium' onInput={() => toggleSelection(order?.order_id)} className='checkbox' id={`select-box-${idx}`} type='checkbox' />
							                </TableCell>

								            <TableCell scope="row">
						                		<Link to={`/orders/${order?.order_id}`}>
						                		 <Typography>
						                		 	{order?.order_id?.toUpperCase()}
						                		 </Typography>
						                		</Link>
							                </TableCell>

							                <TableCell scope="row"> <Typography> {order?.customer.user.first_name} {order?.customer.user.last_name} </Typography> </TableCell>
							                <TableCell scope="row"> <Typography> {order?.created_on} ago </Typography> </TableCell>
							                <TableCell scope="row">
												<Chip
													sx={{mr: 1.5}}
													color={order?.payment_status? "success" : "error"}
													label={order?.payment_status ? "Paid" : "Not Paid"}
												/>
											</TableCell>
							                <TableCell scope="row">
												<Chip
													color={getChipColor(order.status)}
													label={order?.status}
												/>
											</TableCell>

							                <TableCell scope="row">
							                	<ButtonGroup>
								                	{order?.status === 'pending' && <Button variant="contained" disabled={order?.status === 'pending' ? false : true} onClick={() => confirmOrder(order?.order_id)} size="small" color="primary" sx={{ml: 1}}> Confirm order </Button>}
								                	<Button variant="contained" onClick={() => redirect(`/orders/${order?.order_id}`)} size="small" color="warning" sx={{ml: 1}}> Edit </Button>
								                	<Button variant="contained" onClick={() => deleteOrder(order?.order_id)} size="small" color="secondary" sx={{ml: 1}}> Delete </Button>
							                	</ButtonGroup>
							                </TableCell>
							            </TableRow>
				            		))
				            	: 
				            	<TableRow>
					                <TableCell scope="row"> No orders to show </TableCell>
				            	</TableRow>
				            }
				            </TableBody>

				          </Table>
				        </TableContainer>
				    </Paper>
			    </Box>
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

export default OrderHomePage;
