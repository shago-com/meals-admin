import React, {useEffect, useState, useContext} from 'react';
import GlobalStore, { BaseStore } from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {FormLoader} from '../../components/loaders';
import {BackButton, Page, ModalPopover, StyledButton, } from '../../components/index';
import Grid from '@mui/material/Grid';
import Save from '@mui/icons-material/Save';
import Cancel from '@mui/icons-material/Cancel';
import Stack from '@mui/material/Stack';
import { Divider, Input, MenuItem } from '@mui/material';
import SelectInput from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {Country, State } from 'country-state-city';


export const BranchAddPage = ({ ...props }) => {
	const {axios, notify, org, redirect} = useContext(GlobalStore);
	const {authData} = useContext(BaseStore);
	const [branchName, setBranchName] = useState("");
	const [inheritMenu, setInheritance] = useState(false);
	const [offerDineIn, setDineIn] = useState(false);
	const [offerDelivery, setDelivery] = useState(false);
	const [offerPickup, setPickup] = useState(false);
	const [country, setCountry] = useState("");
	const [currency, setCurrency] = useState("");
	const [menuSource, setMenuSource] = useState("");
	const [state, setState] = useState("");
	const [city, setCity] = useState("");
	const [loading, setLoadingState] = useState(true);
	const {branches} = authData;
	
	
	function perfromChecks(){
		if(!branchName) return false;
		return true
	}


	async function postData(){
		let passed = perfromChecks();

		try{

			const payload = JSON.stringify({
				currency,
				state,
				city,
				country,
				'offer_delivery': offerDelivery,
				'offer_dine_in': offerDineIn,
				'offer_pickup': offerPickup,
				'inherit_menu': inheritMenu,
				'inherit_source': menuSource,
				'branch_name': branchName,
				
			})
			const res = await axios.post('/branches/add/', payload, {
				headers: {'Content-Type': 'application/json'}
			})

			if(res.status === 200){
				notify('success', "Created new branch")
				let _authData = JSON.parse(localStorage.getItem('shago-auth-data'))
				let newBranch = res.data.branch
				_authData.branches.push({ branch_name: newBranch.branch_name, branch_id: newBranch.branch_id})
				localStorage.setItem('shago-auth-data', JSON.stringify(_authData))

				setTimeout(() => redirect('/branches'), 1200)
			}else{
				notify('error', res.data.message)
			}
		}catch(err){
			console.log("Error creating branch:", err)
			notify('error', err.message)
		}
	}


	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/branches/add/`);
			data = await res.data;

			if (res.status === 200){
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
				<Typography component="h2" className="heading"> Create New Branch </Typography>
			</Box>

			<BackButton path="/branches" />

			<Stack className="card" sx={{my: 2, mt: 4, maxWidth: "850px !important", minHeight: '100px',}}>
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Stack sx={{my: 3}} className="">
							<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Branch Name </Typography>
								
								<Input 
									value={branchName} fullWidth
									onChange={(e) => setBranchName(e.target.value)} 
									className="no-shadow input"
									disableUnderline
								/>
							</Box>


							<Box className="form-group" sx={{mb: 2}}>
								<Box className="d-flex" alignItems={'center'} sx={{mb: 2}}>
									<Checkbox onInput={(ev) => setDelivery(ev.target.checked)} sx={{mr: 1}} />
									
									<Box alignItems={'center'}>
										<Typography sx={{}}> Offers Delivery? </Typography>
										<Typography sx={{fontSize: 12}}> Does this branch provide delivery services </Typography>
									</Box>
								</Box>

								<Box className="d-flex" alignItems={'center'} sx={{mb: 2}}>
									<Checkbox onInput={(ev) => setPickup(ev.target.checked)} sx={{mr: 1}} />
									
									<Box alignItems={'center'}>
										<Typography sx={{}}> Offers Pickup? </Typography>
										<Typography sx={{fontSize: 12}}> Does this branch offer curbside pickup services </Typography>
									</Box>
								</Box>

								<Box className="d-flex" alignItems={'center'} sx={{mb: 2}}>
									<Checkbox onInput={(ev) => setDineIn(ev.target.checked)} sx={{mr: 1}} />
									
									<Box alignItems={'center'}>
										<Typography sx={{}}> Offers Dine-In? </Typography>
										<Typography sx={{fontSize: 12}}> Does this branch offer dining services </Typography>
									</Box>
								</Box>

								<Box className="d-flex" alignItems={'center'}>
									<Checkbox defaultValue={inheritMenu} onInput={(ev) => setInheritance(ev.target.checked)} sx={{mr: 1}} />
									
									<Box alignItems={'center'}>
										<Typography sx={{}}> Inherit Menu from Branch? </Typography>
										<Typography sx={{fontSize: 12}}> This will automatically copy all current and future menu items from the source branch to this one </Typography>
									</Box>
								</Box>
							</Box>

							{
								inheritMenu &&
								<Box className="form-group" sx={{mb: 2}}>
									<Typography sx={{mb: .3}}> Menu Source </Typography>
									
									<SelectInput 
										value={menuSource} fullWidth
										onChange={(e) => setMenuSource(e.target.value)} 
										className="no-shadow input"
										disableUnderline
									>
										{branches.map((_branch, idx) =>
											<MenuItem key={idx} value={_branch.branch_id}> {_branch.branch_name} </MenuItem>
										)}
									</SelectInput>
								</Box>
							}

							<Divider sx={{my: 3, borderColor: 'black'}} />

							<Typography sx={{mb: 2.3, fontSize: 19, opacity: .6, fontWeight: '600'}}> Branch Location </Typography>

							<Grid container spacing={3}>
								<Grid item xs={12} md={6} className="form-group" sx={{mb: 2}}>
									<Typography sx={{mb: .3}}> Country </Typography>
									
									<SelectInput 
										value={country} fullWidth
										onChange={(e) => setCountry(e.target.value)} 
										className="no-shadow input"
										disableUnderline
									>
										{Country.getAllCountries().map((_country, idx) =>
											<MenuItem key={idx} value={_country.isoCode}> {_country.name} </MenuItem>
										)}
									</SelectInput>
								</Grid>

								<Grid item xs={12} md={6} className="form-group" sx={{mb: 2}}> 
									<Typography sx={{mb: .3}}> State </Typography>
									<SelectInput 
										value={state} fullWidth
										onChange={(e) => setState(e.target.value)} 
										className="no-shadow input"
										disableUnderline
									>
										{State.getStatesOfCountry(country).map((_state, idx) =>
											<MenuItem size="small" key={idx} value={_state.name}> {_state.name} </MenuItem>
										)}
									</SelectInput>
									
								</Grid>

							</Grid>


							<Grid container spacing={3} className="form-group" sx={{mb: 2}}>
								<Grid item xs={12} md={6} className="form-group" sx={{mb: 2}}>
									<Typography sx={{mb: .3}}> City </Typography>
									
									<Input 
										value={city} fullWidth
										onChange={(e) => setCity(e.target.value)} 
										className="no-shadow input"
										disableUnderline
									/>
								</Grid>
								
								<Grid item xs={12} md={6} className="form-group" sx={{mb: 2}}>
									<Typography sx={{mb: .3}}> Currency </Typography>
									<SelectInput
										value={currency} fullWidth
										onChange={(e) => setCurrency(e.target.value)} 
										className="no-shadow input"
										disableUnderline
									>
										<MenuItem value={"USD"}> USD </MenuItem>
										{country &&
										<MenuItem value={Country.getCountryByCode(country).currency}>
											{Country.getCountryByCode(country).currency}
										</MenuItem>
										}
									</SelectInput>
								</Grid>
							</Grid>
						</Stack>

						<StyledButton variant="primary" onClick={postData} icon={<Save />}>							
							<Typography sx={{mx: 1, color: '#ffe'}}> Create new Branch </Typography>
						</StyledButton>
					</form>
				</Stack>
			</Stack>
		</Page>
	)
}


export default BranchAddPage;
