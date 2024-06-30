import React, {Fragment, useEffect, useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import GlobalStore from '../store';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PendingIcon from '@mui/icons-material/PendingActions';
import SavingsIcon from '@mui/icons-material/Savings';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import DeliveryIcon from '@mui/icons-material/DeliveryDining';
import RightArrowIcon from '@mui/icons-material/ArrowForward';
import Typography from '@mui/material/Typography';
import {
	Table, TableContainer, Paper, TableHead,
	TableRow, TableCell, TableSortLabel as SortLabel,
	TableBody, Chip,

} from '@mui/material';
import {DashboardLoader} from '../components/loaders';
import {
	sortDataByStatus,
	sortDataByPaymentStatus,
	sortDataByAlphabetical,
	sortDataById,
	getChipColor
} from '../utils'
import {Page, ChartComponent, StyledButton} from '../components';
import Chart from "react-apexcharts";


const DashCard = ({ title, icon, ctx, sx, level, ...props }) =>{
	function getLevelColor(){
		switch(level){
			case "success":
				return "#28ad28"
			case "error":
				return "red"
			case "warning":
				return "#ed6c02"
			default:
				return "inherit"
		}
	}

	return(
		<Box sx={{maxWidth: '-webkit-fill-available;'}} className="card">
			<Box sx={{p: 2}}>
				<Typography component="h3" sx={{
					fontSize: '16px', fontWeight: '600',
					mb: 2, p: 1.5, background: 'lavenderblush',
					borderRadius: '5px'
				}}> {title} </Typography>
				<Grid container className="just-between align-center">
					{icon && icon}
					<Typography sx={{color: getLevelColor(), fontSize: 20}} component="p" >{ctx}</Typography>
				</Grid>
			</Box>
		</Box>
	)
}


const DashboardPage = ({ ...props }) => {
	const {theme, notify, getUserData, axios, normalizeDigits} = useContext(GlobalStore);
	const [data, setData] = useState(null);
	const [loading, setLoadingState] = useState(false);
	const [chartData, setChartData] = useState();
	const [orderList, setOrderList] = useState([]);
	const [chartOptions, setChartOptions] = useState();
	const [sortMode, setSortingMode] = useState(true);
	const [sorting, setSortingState] = useState(null);
	const {user} = getUserData()

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

	function makeCharts(){	
		setChartData([
			{
				name: 'Weekly Sales',
				data: [22, 10, 20, 30, 50, 60, 70],
			}
		])

		setChartOptions({
			chart: {id: 'salesChart'},
			stroke: {width: .4},
			theme: {
				mode: theme
			},
			fill: {
				colors: ['#1ac', "#fff"]
			},
			xaxis: {
				categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			},
			dataLabels: { enabled: true }
		})
	}

	async function getData(){
		let res;

		try{
			res = await axios.get(`/dashboard`)
			if (res.status === 200){
				console.log("GOT DATA:", res.data)
				setData(res.data)
				setOrderList(res.data.recent_orders)
			}else{
				notify('error', 'Something went wrong!')
			}
			setTimeout(() => setLoadingState(false), 1200);
		}catch(err){
			notify('error', err.message)
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	
	function getTimeOfDay(){
		const now = Date().match(/[0-9]+:[0-9]+/)[0]
		const times = now.split(':');
		const hour = Number(times[0]);
	
		if( hour < 17 && hour >= 12){
		  return 'Afternoon'
		}
		if(hour < 12){
		  return 'Morning'
		}
		if(hour > 16){
			return 'Evening'
		}
	} 
	
	const greeting = getTimeOfDay();

	useEffect(() => {
		function init(){
			getData();
			// makeCharts();
		}
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
		<Page px={3}>

			<Typography fontSize={30} fontWeight={'900'} sx={{
				textShadow: '2px 2px 2px tomato',
				color: '#00aaff',
			}}> Good {greeting} {user?.first_name} </Typography>

			<Grid container spacing={3} sx={{ my: 3}}>
				<Grid item xs={12} sm={6} md={6} lg={3}>
					<DashCard
						level="warning"
						icon={<PendingIcon sx={{fontSize: '32px',}} color="warning" />}
						title="Pending Orders" ctx={data?.pending_orders}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={6} lg={3}>
					<DashCard
						level="warning"
						icon={<DeliveryIcon sx={{fontSize: '32px',}} color="warning" />}
						title="Completed Orders" ctx={data?.completed_orders}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={6} lg={3}>
					<DashCard
						level="warning"
						icon={<CarCrashIcon sx={{fontSize: '32px',}} color="warning" />}
						title="Canceled Orders" ctx={data?.canceled_orders}
					/>
				</Grid>

				<Grid item xs={12} sm={6} md={6} lg={3}>
					<DashCard
						level="warning"
						icon={<SavingsIcon sx={{fontSize: '32px',}} color="warning" />}
						title="Total Revenue" ctx={normalizeDigits(`${data?.revenue}`||0)}
					/>
				</Grid>
			</Grid>


			<Grid sx={{my: 4}} container spacing={2}>
				<Grid item xs={12} sx={{my: 2}} md={6}>
					<Box className="card" fullWidth py={2} px={2} borderRadius={'10px !important'}>
						<Typography mb={3} fontWeight={'600'}> Weekly Sales Chart</Typography>
						{/*
							<Chart
								series={chartData}
								options={chartOptions}
								type="bar"
								width={'100%'}
							/>
						*/}
					</Box>
				</Grid>

				<Grid item xs={12} sx={{my: 2}} md={6}>
					<Box className="card" fullWidth py={2} px={2} borderRadius={'10px !important'}>
						<Typography mb={3} fontWeight={'600'}> Weekly Sales Chart</Typography>
						{/*
							<Chart
								series={[
									{
										name: 'Weekly Sales',
										data: [22, 10, 20, 30, 50, 60, 70],
									}
								]}
								options={{
									chart: {id: 'performance'},
									xaxis: {
										categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
										
									},
								}}
								type="line"
								width={'100%'}
							/>

						*/}
					</Box>
				</Grid>
			</Grid>

			<Grid sx={{my: 4}} container spacing={2}>
				<Grid item xs={12} md={12} lg={8}>
					<Box className="card" sx={{p: 3, maxWidth: '-webkit-fill-available'}}>
						<Box className="" sx={{}}>
							<Typography fontSize={20}> Recent Orders </Typography>
						</Box>

						<Box sx={{ width: '100%' }}>

							<TableContainer>
								<Table
									className="table"
									sx={{ minWidth: 850 }}
									size='medium'
									>
									<TableHead>
										<TableRow>
											<TableCell sx={{ fontWeight: 600}}>
												<SortLabel
													active={sorting === 'id'}
													onClick={() => sortData('id')} 
													hideSortIcon={false}
													direction={sortMode === false ? 'asc' : 'desc'}
												> Order ID </SortLabel>
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
										</TableRow>
									</TableHead>
									
									<TableBody>
										{ orderList ?

											orderList?.map((order, idx) => (
												<TableRow hover key={idx}>
													<TableCell scope="row">
														<Link to={`/orders/${order?.order_id}`}>
														<Typography>
															{order?.order_id?.toUpperCase()}
														</Typography>
														</Link>
													</TableCell>

													<TableCell scope="row"> <Typography> {order?.customer} </Typography> </TableCell>
													<TableCell scope="row"> <Typography> {order?.created_on} ago </Typography> </TableCell>
													<TableCell scope="row">
														<Chip
															sx={{mr: 1.5}}
															color={order?.paid? "success" : "error"}
															label={order?.paid ? "Paid" : "Not Paid"}
														/>
													</TableCell>
													<TableCell scope="row">
														<Chip
															color={getChipColor(order.status)}
															label={order?.status}
														/>
													</TableCell>
												</TableRow>
											))
											: 
											<TableRow>
												<TableCell colSpan={5} scope="row"> No orders to show </TableCell>
											</TableRow>
										}
									</TableBody>

								</Table>
							</TableContainer>
						</Box>

						<Link to={'/orders/'}>
							<StyledButton variant="info" sx={{mt: 3}}>
								<Typography> View all Orders </Typography>
								<RightArrowIcon />
							</StyledButton>
						</Link>
					</Box>
				</Grid>

				<Grid item xs={12} md={6} lg={4}>
					<Box className="card" sx={{p: 3, maxWidth: '-webkit-fill-available'}}>
						<Box className="" sx={{}}>
							<Typography fontSize={20}> Performing Items </Typography>
						</Box>

						<Box sx={{ width: '100%' }}>

							<TableContainer>
								<Table
									className="table"
									sx={{ minWidth: '100%' }}
									size='medium'
									>
									<TableHead>
										<TableRow>
											<TableCell sx={{ fontWeight: 600}}>
												<SortLabel
													active={sorting === 'id'}
													onClick={() => sortData('id')} 
													hideSortIcon={false}
													direction={sortMode === false ? 'asc' : 'desc'}
												> Food Item </SortLabel>
											</TableCell>
										</TableRow>
									</TableHead>
									
									<TableBody>
										{ orderList ?

											orderList?.map((order, idx) => (
												<TableRow hover key={idx}>
													<TableCell scope="row">
														<Link to={`/orders/${order?.order_id}`}>
														<Typography>
															{order?.order_id?.toUpperCase()}
														</Typography>
														</Link>
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
						</Box>
					
					</Box>
				</Grid>
			</Grid>


			<Box px={2} py={5}>
				<Typography> To see all analytics and details go to Analytics  </Typography>
			</Box>

		</Page>
	)
}


export default DashboardPage;
