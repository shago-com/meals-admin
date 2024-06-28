import React, {useRef, useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {DashboardLoader} from '../../components/loaders';
import {BackButton, CustomizationForm, ModalPopover, Page, RichTextField, StyledButton} from '../../components/index';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import CancelIcon from '@mui/icons-material/Cancel';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import InputLabel from '@mui/material/InputLabel';
import Fade from '@mui/material/Fade';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextInput from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import {Chip, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {setCookie, getCookie} from '../../utils';
import { useNavigate, useParams } from 'react-router-dom';
import { Add } from '@mui/icons-material';



export const MenuDetailPage = ({ itemSlug, ...props }) => {
	const {notify, redirect, axios} = useContext(GlobalStore);
	const { itemId } = useParams();
	const [item, setFoodItem] = useState(null);
	const [loading, setLoadingState] = useState(true);
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("");
	const [about, setAbout] = useState("");
	const [categories, setCategories] = useState([]);
	const [images, setImages] = useState([]);
	const [newImages, setNewImages] = useState([]);
	// const [availability, setAvailability] = useState("all-stores");
	// const [stores, setStores] = useState([]);
	// const [branches, setBranches] = useState([]);
	const [customizations, setCustomizations] = useState([]);
	const [showOverlay, setOverlayState] = useState(false);
	const uploader = useRef();
	const router = useNavigate();
	

	function addCustomization(data){
		setCustomizations([...customizations, data])
	}

	async function removeCustomization(id){
		const self = item.custom_choices[id]
		console.log("Deleting", self)

		function removeFromList(){
			let _options = customizations
			_options.splice(id, 1)
			setCustomizations([..._options])
		}

		if (self && self.id){ // if id exists then it exists in the db, so delete from db
			console.log("removing", self)
			const payload = {
				action: 'remove-custom-choice',
				object_id: self.id
			}
	
			const res = await axios.post(`/menu/${itemId}/`, payload)
			if (res.status === 200){
				removeFromList()
			}else{
				notify('error', 'Error', res?.data?.message || "Something went terribly wrong!")
			}
		}else{
			// if id doesn't exists then just remove from the array state
			removeFromList()
		}


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

	// v2.0
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

	async function getData(){
		let res, data;

		try{
			res = await axios.get(`/menu/${itemId}/`);
			data = await res.data;
			console.log("FOOD_ITEM:", res.data)
			
			if (res.status === 200){
				setFoodItem(data);
				setName(data.name)
				setPrice(data.price)
				setCategory(data.category)
				setAbout(data.about)
				setCustomizations(data.custom_choices)
				setImages(data.images)
				setTimeout(() => setLoadingState(false), 1200);
			}else{
				notify('error', "An error occurred")
			}
		}catch(err){
			notify('error', err.message)
			console.log("Error fetching data:", err)
		}
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

				for (let img of newImages){
					payload.append('image', img, img.name)					
				}

				res = await axios.post(`/menu/${itemId}/`, payload, {
					headers: {
						'X-CSRFToken': csrftoken,
						'Content-Type': 'multipart/form-data'
					},
				});

				_data = await res.data;
				if (res.status === 200){
					notify('success', "Successfully changed food item")
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
		let _img = {
			img,
			url: URL.createObjectURL(img)
		}
		let uploads = Array.from(images);
		uploads.push(_img)
		setImages(uploads)

		uploads = Array.from(newImages);
		uploads.push(img)
		setNewImages(uploads)

	}

	async function removeImage(img){
		console.log(`removing image ${JSON.stringify(img)}`)
		if (img.id){
			const payload = JSON.stringify({
				action: 'remove-image',
				object_id: img.id
			});
			let res = await axios.post(`/menu/${itemId}/`, payload, {
				headers: {
					"Content-Type": "application/json"
				}
			})

			if (res.status === 200){
				notify('success', 'Removed Item Image')
			}else{
				return notify('error', 'Something went wrong')
			}
		}
		let _imgs, imgs = Array.from(images);
		imgs.splice(imgs.indexOf(img), 1);
		_imgs = imgs
	
		setImages(_imgs)
	}

	function getChipColor(){
		let color;
		notify("info", color)
		return 'warning'
	}

	function init(){
		getData();
		getCategories();
		// getBranches();
	};


	useEffect(() => {
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
		<Page>
			<BackButton sx={{ml: 0}} path="/menu" />
			
			<Box sx={{my: 2, ml: 0}} className="titlebar">
				<Typography component="h2" className="heading"> Edit Food Item </Typography>
			</Box>

			<Stack sx={{minHeight: '100px',}} className="card">
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Grid container spacing={2} sx={{my: 3}} className="">
							<Grid item xs={12} md={6} lg={4}>
								<Box className="form-group" sx={{mb: .2}}>
								<Typography sx={{mb: .3}}> Item name </Typography>
								<TextInput disableUnderline name="name" variant="contained" onChange={e => setName(e.target.value)} className="input" type="text" value={name} />
								</Box>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<Box className="form-group" sx={{mb: 2}}>
								<Typography sx={{mb: .3}}> Price </Typography>
								<TextInput disableUnderline name="price" variant="contained" onChange={e => setPrice(e.target.value)} className="input" type="number" value={price} />
								</Box>
							</Grid>

							<Grid item xs={12} md={6} lg={4}>
								<Box className="form-group" sx={{mb: 2}}>
								<InputLabel component="label" id="sel-cat" sx={{mb: .3}}> Category </InputLabel>
								<Select
									className=""
									fullWidth
									sx={{ py: '0 !important'}}
									value={category}
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
											<Table sx={{ minWidth: '400px'}}>
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
															customizations?.map((custom, idx) => 
																<TableRow hover>
																	<TableCell scope="row">
																		<Typography sx={{ml: 2}}> {custom.name} </Typography>
																	</TableCell>

																	<TableCell scope="row">
																		<Typography>
																			{custom?.choices?.map(({ name }, idx)=> `${name}${(custom?.choices?.length - 1) === (idx) ? '' : ','} ` )}
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

							<Grid item xs={12} lg={12}>
								<Box className="form-group" sx={{mt: 2}}>
								<Grid container className="flexbox just-between align-center" sx={{mb: 1}}>
									<Typography sx={{mb: .3}}> Images <small> (Max. 3) </small> </Typography>
								</Grid>

								<ImageList cols={12} sx={{ borderRadius: 2, border: 'dashed 3px lavender', p: 2}} gap={10}>
									<input onChange={(e) => addImage(e.target.files[0])} ref={uploader} type="file" accepts="image/jpeg;image/png;image/jpg" className="d-none" />
									{
										images?.map((img, idx) => 
											<ImageListItem sx={{width: 150, height: 150, border: '1px dashed grey'}}>
												<img alt="" style={{width: '100%', height: '120px'}} src={img.url} /> 
												<Button onClick={() => removeImage(img)}> <CancelIcon /> </Button>
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
					</form>

					<Grid container display={'flex'}>
						<StyledButton onClick={postData} variant="success" icon={<SaveIcon />} > <Typography> Save Changes </Typography> </StyledButton>
						<StyledButton onClick={() => redirect('/menu')} variant="warning" icon={<CancelIcon />} > <Typography> Cancel </Typography> </StyledButton>
					</Grid>
				</Stack>
				
				{
				// moved to version 2.0
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

			</Stack>
		</Page>
	)
}

export default MenuDetailPage;
