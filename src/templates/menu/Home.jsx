"use client"
import React, {Fragment, useEffect, useState, useContext} from 'react';
import GlobalStore, { BaseStore } from '../../store';
import {CurrencyMaps} from '../../App';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import UpArrow from '@mui/icons-material/ArrowUpward';
import DownArrow from '@mui/icons-material/ArrowDownward';
import {Link} from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {sortDataByAlphabetical} from '../../utils';
import { Card, Icon } from '@mui/material';
import { Info } from '@mui/icons-material';
import { BranchSelector } from '../../components/nav';

export const MenuHomePage = ({ ...props }) => {
	const {
		getUserData, AskConfirmation, place,
		redirect, axios, notify, normalizeDigits, // branch,
	} = useContext(GlobalStore);
	const [showModal, setModalState] = useState(false);
	const [data, setData] = useState([]);
	const [sortMode, setSortMode] = useState(true);
	const [activeBranch, setActiveBranch] = useState('');
	// const [branch, setBranch] = useState(null);
	const [sorting, setSortingState] = useState('');
	const [loading, setLoadingState] = useState(true);
	const {authData} = React.useContext(BaseStore)
	

	function deleteFoodItem(id){
		async function deleteItem(){
			let res, data;

			res = await axios.delete(`/menu/${id}/`)
			data = await res.data;

			if (res.status === 200){
				notify("success", "Deleted Food Item")
				getData();
			}else{
				notify("warning", data.message)				
			}
		}

		AskConfirmation({
			title: "Delete Food Item",
			message: "Are you sure you want to delete this food item?",
			onCancel: () => notify('info', "Operation canceled"),
			onApprove: () => deleteItem(),
		})
	}

	async function getData(){
		try{

			const res = await axios.get(`/menu/${activeBranch && `?branch=${activeBranch}`}`)
			console.log("Got Data:", res)
			if (res.status === 200){
				setData(res.data.data)
				notify('success', "Got data")
			}else{
				console.log("Error fetching data:")
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message);
			console.log("Error fetching data:", err);
		}
	}

	function sortData(field='name'){
		const sortedData = sortDataByAlphabetical(data, field, (sortMode ? 'asc' : 'desc'))
		setSortingState(field)
		setSortMode(!sortMode)
		setData(sortedData)
	}

	async function init(){
		await getData();
		console.log("branch", activeBranch)
		setTimeout(() => setLoadingState(false), 1200);
	}

	function handleBranchSelect(branchId){
		if(branchId === 'all'){
			setActiveBranch('')
		}else{
			setActiveBranch(branchId)
		}
	}

	useEffect(() => {
		init();
	}, [activeBranch])

	if (loading){
		return(
			<Page>
				<StaffLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>

			<Grid container className="titlebar d-flex" justifyContent={'space-between'} sx={{my: 2}}>
				<Grid item xs={12} md={9}>
					<Typography component="h2" className="title"> Food Menu </Typography>
				</Grid>
			</Grid>
			{/* 
				Moved to 2.0
				<Card  className='warning'>
					<Info  sx={{fontSize: 40}} />
					<Typography>
						This branch inherits some menu items from "{"Main Branch"}"
					</Typography>
				</Card> 
			
			*/}


			<Grid container wrap="wrap" sx={{my: 2}}>
				<Link to="/menu/add">
					<StyledButton sx={{ml: 0, mr: 2}} variant="primary" icon={<AddIcon />}>
						<Typography sx={{mx: 1, color: '#fff'}}> New Food Item </Typography>
					</StyledButton>
				</Link>

				<Link to="/menu/categories">
					<StyledButton icon={<SettingsIcon />} variant="secondary">
						<Typography sx={{mx: 1, color: '#fff'}}> Manage Categories </Typography>
					</StyledButton>
				</Link>
			</Grid>

			<Stack>
				<Box sx={{ width: '100%' }}>
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
										<SortLabel direction={sortMode === false ? 'asc' : 'desc'} active={sorting === 'name'} onClick={e => sortData('name')}> Food Item </SortLabel> 
									</TableCell>
									<TableCell sx={{ fontWeight: 600}}>
										<SortLabel direction={sortMode === false ? 'asc' : 'desc'} active={sorting === 'category'} onClick={e => sortData('category')}> Category  </SortLabel>
									</TableCell>
									<TableCell sx={{ fontWeight: 600}}> Price ({place?.currency}) </TableCell>
									<TableCell sx={{ fontWeight: 600}}> Actions </TableCell>
						      </TableRow>
						    </TableHead>
				            
				            <TableBody>
				            	{ data ?
				            		data.map((food, idx) => (
							            <TableRow hover key={idx}>
								            <TableCell scope="row">
						                		<Link to={`/menu/${food?.slug}`}>
													<Grid display={'flex'} alignItems={'center'} justifyContent={'safe flex-start'}>
														<img alt="" src={food?.image?.url} style={{ borderRadius: 10, width: 60, height: 50}}/>
														<Typography sx={{ml: 2}} component="h4"> {food?.name} </Typography>
													</Grid>
						                		</Link>
							                </TableCell>

							                <TableCell scope="row">
						                		<Typography component="h4"> {food?.category || "Not assigned"} </Typography>
							                </TableCell>

							                 <TableCell scope="row">
						                		 <Typography component="h4"> {CurrencyMaps[place?.currency]} {normalizeDigits(food?.price)} </Typography>
							                </TableCell>

							                <TableCell scope="row">
							                	<ButtonGroup orientation='horizontal'>
							                		<Button onClick={() => redirect(`/menu/${food?.slug}`)} variant="contained" size="small" color="warning"> Edit </Button>
								                	<Button onClick={() => deleteFoodItem(food?.slug)} variant="contained" size="small" color="secondary" sx={{ml: 1}}> Delete </Button>
								                </ButtonGroup>
							                </TableCell>
							            </TableRow>
				            		))
				            	: 
				            	<TableRow>
					                <TableCell scope="row"> No food items to show </TableCell>
				            	</TableRow>
				            }
				            </TableBody>

				          </Table>
				        </TableContainer>
				    </Paper>
			    </Box>
			</Stack>
		</Page>
	)
}


export default MenuHomePage;
