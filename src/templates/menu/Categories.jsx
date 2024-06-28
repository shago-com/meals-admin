import React, {Fragment, useEffect, useState, useContext} from 'react';
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {StaffLoader} from '../../components/loaders';
import {Page, BackButton, StyledButton} from '../../components/index';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TextInput from '@mui/material/Input';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Save from '@mui/icons-material/Save';


export const CategoriesPage = ({ ...props }) => {
	const {apiUrl, notify, AskConfirmation, org, axios} = useContext(GlobalStore);
	const [showModal, setModalState] = useState(false);
	const [ModalForm, setModalForm] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoadingState] = useState(true);

	async function changeCategory({ object_id, name }){
		let res, data;

		try{
			res = await axios.post(`/menu/cats/`, {
				action: 'change',
				object_id,
				name
			})
			data = res.data

			if (res.status === 200){
				notify("success", `Changed Category ${name}`)
				getData();
				hideForm()
			}else{
				console.log("Error:", data.message)
				notify('error', 'Something went wrong')
			}
		}catch(err){
			notify('error', 'Something went wrong')	
		}
	}

	function deleteCategory(name){
		async function deleteItem(){
			const payload = JSON.stringify({
				action: 'remove',
				name
			})
			const res = await axios.post(`/menu/cats/`, payload, {
				headers: { "Content-Type": "application/json" }
			})
			if (res.status === 200){
				notify("success", "Deleted category")
				return getData();
			}else{
				notify("warning", res.data.message)				
			}
		}

		AskConfirmation({
			topic: "Delete Category",
			message: `Are you sure you want to delete this category? \n\n
			Items in this category will no longer be available under menu/search in your storefront
			until you reassign them to a new category`,
			onCancel: () => notify('info', "Operation canceled"),
			onApprove: () => deleteItem(),
		})
	}

	async function getData(){
		try{
			const res = await axios.get("/menu/cats/");
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

	function hideForm(){
		setModalState(false)
	}

	function showForm(){
		setModalState(true)
	}

	function showAddForm(){
		setModalForm(<CategoryAddForm onClose={hideForm} onSubmit={addCategory} />)
		showForm()
	}

	function showEditForm(obj){
		setModalForm(<CategoryChangeForm object={obj} onClose={hideForm} onSubmit={changeCategory} />)
		showForm()
	}

	async function addCategory({ name }){
		const payload = JSON.stringify({
			action: 'add',
			name
		})

		try{
			const res = await axios.post(`/menu/cats/`, payload, {
				headers: { "Content-Type": "application/json" },
			})
	
			
			const data = await res.data;
			if (res.status === 200){
				notify("success", "Created new Category")
				getData()
				hideForm();
			}else{
				notify("warning", data.message)				
				hideForm();
			}
			return getData()
		}catch(err){
			notify('error', err.message)
			console.error("Error adding category", err)
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
			<Box sx={{my: 2}} className="titlebar">
				<Typography component="h2" className="title"> Menu Categories </Typography>
			</Box>

			<Grid container wrap="wrap" sx={{my: 2}}>
				<BackButton sx={{ml: 0}} path="/menu/" />
				<StyledButton onClick={showAddForm} icon={<AddIcon />} variant="primary">
					<Typography sx={{mx: 1, color: '#fff'}}> New Category </Typography>

				</StyledButton>
			</Grid>

			<Stack>
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
						          <TableCell sx={{ fontWeight: 600 }}> SN </TableCell>
						          <TableCell sx={{ fontWeight: 600 }}> Name </TableCell>
						          <TableCell sx={{ fontWeight: 600 }}> Actions </TableCell>
						      </TableRow>
						    </TableHead>
				            
				            <TableBody>
				            	{ data ?
				            		data.map((cat, idx) => (
							            <TableRow id={cat?.name} hover key={idx}>
								            <TableCell scope="row">
						                		<Typography component="h4"> {idx + 1} </Typography>
							                </TableCell>

							                <TableCell scope="row">
						                		{cat?.name}
							                </TableCell>

							                <TableCell scope="row">
							                	<Button onClick={() => showEditForm(cat)} size="small" variant="text" color="primary" sx={{ml: 1}}> Edit </Button>
							                	<Button onClick={() => deleteCategory(cat?.name)} size="small" variant="text" color="secondary" sx={{ml: 1}}> Delete </Button>
							                </TableCell>
							            </TableRow>
				            		))
					            	: 
					            	<TableRow>
						                <TableCell scope="row"> No categories to show </TableCell>
					            	</TableRow>
					            }
				            </TableBody>

				          </Table>
				        </TableContainer>
				    </Paper>
			    </Box>
			</Stack>

			{showModal && <Backdrop open={showModal} className="overlay">{ModalForm}</Backdrop> }
		</Page>
	)
}


const CategoryAddForm = ({ onClose, onSubmit }) => {
	const [name, setName] = useState("");
	const {notify} = useContext(GlobalStore);

	function handleSubmit(){
		if (!name){
			return notify("error", "Please provide a category name")
		}

		onSubmit({ name })
	}

	return(
		<Box className="overlay-inner">
			<Stack sx={{my: 2, mt: 4, maxWidth: "700px", minHeight: '100px',}} className="card">
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Stack sx={{my: 3}} className="">
							<Box className="form-group" sx={{mb: .2}}>
								<Typography sx={{mb: .3}}> Category name </Typography>
								<TextInput disableUnderline name="name" variant="contained" onChange={e => setName(e.target.value)} className="input" type="text" value={name} />
							</Box>
						</Stack>
					</form>

					<Grid container display={'flex'}>
						<StyledButton onClick={handleSubmit} variant="success" icon={<SaveIcon />} > <Typography sx={{ml: 2}}> Save Category </Typography> </StyledButton>
						<StyledButton onClick={onClose} variant="warning" icon={<CancelIcon />} > <Typography sx={{ml: 2}}> Cancel </Typography> </StyledButton>
					</Grid>
				</Stack>		
			</Stack>
		</Box>
	)
}


const CategoryChangeForm = ({ object, onClose, onSubmit }) => {
	const [name, setName] = useState(object?.name);
	const object_id = object?.id
	const {notify} = useContext(GlobalStore);

	function handleSubmit(){
		if (!name){
			return notify("error", "Please provide a category name")
		}

		onSubmit({ object_id, name })
	}

	return(
		<Box className="overlay-inner">
			<ClickAwayListener onClickAway={onClose}>
			<Stack sx={{my: 2, mt: 4, maxWidth: "700px", minHeight: '100px',}} className="card">
				<Stack sx={{ px: 3, py: 3 }}>
					<Typography component="h1" className="form-title"> Please Fill This Form </Typography>

					<form onSubmit={e => e.preventDefault()}>
						<Stack sx={{my: 3}} className="">
							<Box className="form-group" sx={{mb: .2}}>
								<Typography sx={{mb: .3}}> Category name </Typography>
								<TextInput disableUnderline name="name" variant="contained" onChange={e => setName(e.target.value)} className="input" type="text" value={name} />
							</Box>
						</Stack>
					</form>

					<Grid container>
						<StyledButton onClick={handleSubmit} variant="success" icon={<SaveIcon />} >
						 <Typography> Save Category </Typography>
						</StyledButton>

						<StyledButton onClick={onClose} variant="warning" icon={<CancelIcon />} >
						 <Typography> Cancel </Typography>
						</StyledButton>
					</Grid>
				</Stack>		
			</Stack>
			</ClickAwayListener>
		</Box>
	)
}


export default CategoriesPage;
