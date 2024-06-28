import React, {useEffect, useState, useContext, useRef} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextInput from '@mui/material/Input';
import {FormLoader} from '../../components/loaders';
import {BackButton, Page, ModalPopover, StyledButton, CustomizationForm, RichTextField} from '../../components/index';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import {Paper, TableContainer, Table, TableHead, TableBody, TableRow, Tooltip, TableCell,} from '@mui/material';
import Fade from '@mui/material/Fade';
import RadioSelect from '@mui/material/Radio';
import {getCookie} from '../../utils';
import { Form } from 'react-router-dom';
import { Add, DeleteForever, PlusOne, Star } from '@mui/icons-material';


export const MenuCreatePage = ({ ...props }) => {
	const {axios, notify, redirect} = useContext(GlobalStore);
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("");
	const [about, setAbout] = useState("");
	// const [availability, setAvailability] = useState("all-stores");
	// const [stores, setStores] = useState([]);
	// const [branches, setBranches] = useState([]);
	const [showOverlay, setOverlayState] = useState(false);
	const [categories, setCategories] = useState([]);
	const [customizations, setCustomizations] = useState([]);
	const [images, setImages] = useState([]);
	const [loading, setLoadingState] = useState(true);
	const uploader = useRef();

	function addCustomization(data){
		setCustomizations([...customizations, data])
	}

	function removeCustomization(id){
		let _options = customizations
		_options.splice(id, 1)
		setCustomizations([..._options])
	}

	async function getCategories(){
		let res, info;
		try{
			res = await axios.get(`/res/?target=Categories`)
			info = await res.data

			if (res.status === 200){
				setCategories(info.data)
				setTimeout(() => setLoadingState(false), 1200);
			}else{
				notify('warning', "Something went wrong!")
			}
		}catch(err){
			notify('error', "Something went wrong!")
			setTimeout(() => setLoadingState(false), 1200);
		}
	}

	//  v2.0
	// async function getBranches(){
	// 	let res, info;
	// 	try{
	// 		res = await axios.get(`/res/?target=RestaurantBranch`)
	// 		info = await res.data

	// 		if (res.status === 200){
	// 			setBranches(info.data)
	// 			setTimeout(() => setLoadingState(false), 1200);
	// 		}else{
	// 			notify('warning', "Something went wrong!")
	// 		}
	// 	}catch(err){
	// 		notify('error', "Something went wrong!")
	// 		setTimeout(() => setLoadingState(false), 1200);
	// 	}
	// }

	function perfromChecks(){
		if (!name)	return false
		if (!price)	return false
		if (!images) return false
		if (!category) return false
		return true
	}

	async function postData(){
		let passed = perfromChecks();
		let res, _data, payload;

		if (passed){
			payload = new FormData();
			let csrftoken = getCookie('csrftoken');

			try{
				payload.append('name', name)
				payload.append('about', about)
				payload.append('price', price)
				payload.append('category', category)
				// payload.append('availability', availability)
				// payload.append('stores', stores)
				payload.append('customizations', JSON.stringify(customizations))

				for (let img of images){
					payload.append('image', img, img.name)					
				}

				console.log("Add Food", payload)

				res = await axios.post(`/menu/add/`, payload, {
					headers: {
						'X-CSRFToken': csrftoken,
						'Content-Type': 'multipart/form-data'
					},
				});

				_data = await res.data;
				if (res.status === 201){
					notify('success', "Created new food item")
					setTimeout(() => {
						return redirect('/menu')
					}, 2500)
				}else{
					console.log("Error fetching data:")
					return notify('error', _data.message)
				}
			}catch(err){
				console.log("Error fetching data:", err)
				return notify('error', err.message)
			}
		}else{
			notify("warning", "Please fill all the fields.")
		}
	}

	function addImage(img){
		let uploads = Array.from(images);
		uploads.push(img)
		setImages(uploads)
	}

	function removeImage(src){
		let _imgs, imgs = Array.from(images);
		imgs.splice(src, 1);
		_imgs = imgs
		setImages(_imgs)
	}

	function init(){
		getCategories();
		// getBranches();
	};

	useEffect(() => {		
		init()
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

			<BackButton path="/menu/" />

			<Box className="namebar" sx={{my: 2}}>
				<Typography component="h2" className="heading"> Create Menu Item </Typography>
			</Box>

			<Stack className="card" sx={{my: 2, mt: 4, minHeight: '100px',}}>
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Grid container spacing={2} sx={{my: 3}} className="">
							<Grid xs={12} md={6} lg={4} item>
								<Box className="form-group" sx={{mb: .2}}>
									<Typography sx={{mb: .3}}> Item name </Typography>
									<TextInput disableUnderline name="name" variant="contained" onChange={e => setName(e.target.value)} className="input" type="text" value={name} />
								</Box>
							</Grid>

							<Grid xs={12} md={6} lg={4} item>
								<Box className="form-group" sx={{mb: 2}}>
									<Typography sx={{mb: .3}}> Price </Typography>
									<TextInput disableUnderline name="price" variant="contained" onChange={e => setPrice(e.target.value)} className="input" type="number" value={price} />
								</Box>
							</Grid>

							<Grid xs={12} md={6} lg={4} item>
								<Box className="form-group" sx={{mb: 2}}>
									<Typography component="label" id="sel-cat" sx={{mb: .3}}> Category </Typography>
									<Select
										className=""
										sx={{ py: '0 !important'}}
										value={category}
										fullWidth
										onChange={(ev) => setCategory(ev.target.value)}
									>
										{categories?.map(({name}, idx) => <MenuItem key={idx} value={name}> {name} </MenuItem> )}
									</Select>
								</Box>
							</Grid>
							
							{/* 
								Moved to v2.0
								<Grid xs={12} md={6} lg={4} item>
									<Box className="form-group" sx={{mt: 2}}>
										<Typography component="label" id="sel-cat" sx={{mb: .3}}> Availability </Typography>
										<Select
											className=""
											sx={{ py: '0 !important'}}
											value={availability}
											fullWidth
											onChange={(ev) => setAvailability(ev.target.value)}
										>
											<MenuItem value={'all-stores'}> All Stores </MenuItem>
											<MenuItem value={'select-stores'}> In Select Stores Only </MenuItem>
										</Select>
									</Box>
								</Grid>


								{
									availability === 'select-stores' && 
									<Fade in>
										<Grid item xs={12} lg={8}>
											<Box className="form-group" sx={{mt: 2}}>
												<Typography component="label" id="sel-cat" sx={{mb: .3}}> Select Available  Stores <small> *select multiple</small></Typography>
												<Select
													className=""
													sx={{ py: '0 !important'}}
													value={stores}
													fullWidth
													multiple
													onChange={(ev) => setStores(ev.target.value)}
												>
													{branches.map((branch, idx) => <MenuItem key={idx} value={branch?.branch_id}> {branch?.branch_name} </MenuItem>)}
												</Select>
											</Box>
										</Grid>
									</Fade>
								}
							*/}

							<Grid item xs={12} lg={12}>
								<Box className="form-group" sx={{mb: 2}}>
									<Typography sx={{mb: .3}}> Describe this item </Typography>
									<RichTextField content={about} onChange={data => setAbout(data)}  />
								</Box>
							</Grid>

							<Grid item xs={12}>
								<Box className="form-group" sx={{mb: 2}}>
									<Box className="d-flex align-center just-between">
										<Typography sx={{mb: 2}}> Order Options </Typography>
										<StyledButton onClick={() => setOverlayState(true)} size="small" variant='secondary' icon={<Add />}> </StyledButton>
									</Box>
									<Paper sx={{ width: '100%', mb: 2 }}>
										<TableContainer>
											<Table>
												<TableHead>
													<TableRow>
														<TableCell sx={{ fontWeight: 600}}> Customization </TableCell>
														<TableCell sx={{ fontWeight: 600}}> Available Options </TableCell>
														<TableCell sx={{ fontWeight: 600}}> </TableCell>
													</TableRow>
												</TableHead>

												<TableBody>
													{
														customizations.length > 0 ? (
															customizations.map((custom, idx) => 
																<TableRow hover>
																	<TableCell scope="row">
																		<Typography sx={{ml: 2}}> {custom.name} </Typography>
																	</TableCell>

																	<TableCell scope="row">
																		<Typography>
																			{custom.choices.map(({ name, price }, idx)=> `${name} ${price > 0 && `+ ${price}`}${(idx + 1) === custom.choices.length ? '.' : ',' } ` )}
																		</Typography>
																	</TableCell>

																	<TableCell scope="row"> <StyledButton onClick={() => removeCustomization(idx)} size="small" variant='danger' icon={<CancelIcon />}> </StyledButton> </TableCell>
																</TableRow>	           		
															)
														) : (
															<TableRow hover>
																<TableCell scope="row" colSpan={3}>
																	<Typography sx={{ml: 2}}> {"Nothing to show here, Click the + button to add a customizable choice menu."} </Typography>
																</TableCell>
															</TableRow>	           		
														)
													}
												</TableBody>

											</Table>
										</TableContainer>
									</Paper>
								</Box>
							</Grid>

							<Grid item>
								<Box className="form-group" sx={{mt: 2}}>
									<Grid container className="flexbox just-between align-center" sx={{mb: 1}}>
										<Typography sx={{mb: .3}}> Images <small> (Max. 3) </small> </Typography>
									</Grid>

									<ImageList cols={12} sx={{ borderRadius: 2, border: 'dashed 3px lavender', p: 2}} gap={10}>
										<input onChange={(e) => addImage(e.target.files[0])} ref={uploader} type="file" accepts="image/jpeg;image/png;image/jpg" className="d-none" />
										{
											images?.map((img, idx) => 
												<ImageListItem sx={{width: 150, height: 150, border: '1px dashed grey'}}>
													<img alt="" width='100%' height='120px' style={{}} src={URL.createObjectURL(img)} /> 
													<Button onClick={() => removeImage(idx)}> <CancelIcon /> </Button>
												</ImageListItem>
											)
										}

										{
											/* The Uploader Widget */
											images?.length < 3 &&
											<ImageListItem sx={{width: 150, height: 150}}>
												<Button variant="outlined" color="secondary" sx={{ textAlign: 'center', display: 'block', height: 150, width: 150 }} onClick={() => uploader.current.click()}>
													<UploadIcon sx={{ fontSize: 35}} /> 
													<Typography sx={{display: 'block'}}> Upload </Typography>
												</Button>
											</ImageListItem>
										}
									</ImageList>
								</Box>
							</Grid>

						</Grid>

						<hr />

						<IconButton onClick={postData} sx={{
							borderRadius: '5px',
							background: 'cornflowerblue',
							color: '#ffe',
							':hover': {background: 'cornflowerblue', opacity: .8},
							mt: 1
						}}>
							<SaveIcon />
							<Typography sx={{mx: 1, color: '#ffe'}}> Create Food Item </Typography>
						</IconButton>
					</form>
				</Stack>
			</Stack>
			
			{

				showOverlay &&
				<ModalPopover 
					render={
						<CustomizationForm
							onSubmit={(data) => addCustomization(data)} 
							onClose={() => setOverlayState(false)}  
						/>
					} 
					show={showOverlay}
				/>
			}
		</Page>
	)
}





export default MenuCreatePage;
