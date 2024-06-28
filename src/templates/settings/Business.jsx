import React, {useEffect, useState, useContext, useRef} from 'react';
import {BarChart, StyledButton} from '../../components'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import {Typography, Divider, Grid} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {DashboardLoader} from '../../components/loaders';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {Page} from '../../components/index';
import Stack from '@mui/material/Stack';
import logo from '../../logo.svg'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageIcon from '@mui/icons-material/Filter';
import { ChangeCircle, ChangeHistory, ConnectWithoutContact } from '@mui/icons-material';

// import axios from 'axios'


export const BusinessControls = ({ data, initFunc, ...props}) => {
	const {
		axios, notify
	} = useContext(GlobalStore);
	const [storeDescription, setStoreDescription] = useState("");
	const [storeLogo, setStoreLogo] = useState("");
	const [image, setImage] = useState(null)
	const [editor, setWYSIWYG] = useState(null)
	const uploader = useRef()

	async function changeDescription(){
		try {
			const desc = editor.getData();
			const payload = {
				about: desc
			}
			const res = await axios.post(`/manage/?target=restaurant:description`, payload)
			if(res.status === 200){
				notify('success', "Successfully change your logo")
			}else{
				notify('error', "Something went wrong")			
			}
		} catch (error) {
			notify('error', "Something went wrong")
		}
	}


	async function changeImage(){
		try {
			const file = image.image;
			const payload = new FormData()
			payload.append('logo', file, file.name)
			payload.append('action', 'change_logo')

			const res = await axios.post(`/manage/?target=restaurant&object=logo`, payload, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			if(res.status === 200){
				notify('success', "Successfully change your logo")
				setImage(null)
				initFunc()
			}else{
				notify('error', "Something went wrong")			
			}
		}catch(error){
			console.log("Error changing image:", error)
			notify('error', "Something went wrong")
		}
	}


	function uploadImage(file){
		setImage({
			image: file,
			url: URL.createObjectURL(file)
		})
	}

	return(
		<Box {...props}>
			<Box className="shadow titlebar" sx={{my: 2, backgroundColor: '#fff', borderRadius: 2, p: 2}}>
				<Typography component="h2" className="title"> Business Info </Typography>
			</Box>

			<Box className="card" sx={{p: 3, my: 5}}>
				<Typography sx={{mb: 3}} component="h2" className="bold"> Business Logo </Typography>
				
				<Box
					sx={{
						borderRadius: 2,
						border: '3px dashed lavender',
						p: 1,
						width: 200,
						height: 200,
						justifyContent: 'center',
						alignItems: 'center',
						display: 'flex'
					}}
				>
				 	<img width={'100%'} alt="Logo Display" src={ image ? image.url : data?.logo_url} style={{width: '100% !important', height: '100% !important'}} />
				</Box>

				<input ref={uploader} type="file" accept="image/*" className="d-none" onInput={(ev) => uploadImage(ev.target.files[0])} />

				<Grid container>
					<StyledButton onClick={() => uploader.current.click()} sx={{mt: 3}} icon={<ImageIcon />} variant={'secondary'}> <Typography> Change Image </Typography> </StyledButton>
					{image && <StyledButton onClick={changeImage} sx={{mt: 3}} icon={<SaveIcon />} variant={'success'}> <Typography> Save Image </Typography> </StyledButton>}
				</Grid>
			</Box>

			<Box className="card" sx={{p: 3, my: 5}}>
				<Typography component="h2" className="bold"> Business Name </Typography>
				<Typography component="h2" sx={{mt: 1, mb: 2}}> {data?.name} </Typography>
				
				<Divider />

				<Box className="" sx={{mt: 3}}>
					<Typography component="h2" className="bold"> Store Domain URL </Typography>
					<Typography component="h2" sx={{mt: 1}}> {data?.slug}.shago.online </Typography>

					<Grid container sx={{mt: 3}}>
						<StyledButton variant="warning" icon={<EditIcon />}> <Typography> Customize your site link </Typography> </StyledButton>
						<StyledButton variant="success" icon={<ConnectWithoutContact />}> <Typography> Connect your domain </Typography> </StyledButton>
					</Grid>
				</Box>
			</Box>

			<Box className="card" sx={{p: 3, my: 5}}>
				<Typography sx={{mb: 3}} component="h2" className="bold"> Business Info </Typography>

				<CKEditor
					editor={ ClassicEditor }
					config={{
						toolbar: [	
							"undo",	"redo",	"|", "heading",	"|", "bold", "italic",	"|",
							"link",	"insertTable", "blockQuote","mediaEmbed","|",
							"bulletedList",	"numberedList", "outdent",	"indent"
						]
					}}
                    data={data?.about}
					sx={{
						minHeight: '400px !important',
					}}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
						window.editor = editor						
                        setWYSIWYG(editor)
                    }}
                    onChange={( event, editor ) => {
                        const data = editor.getData();
						setStoreDescription(data)
                    }}
				/>
				{/* <Typography component="h2" sx={{mt: 1}}> {data?.about || "Nothing yet"} </Typography> */}

				<StyledButton onClick={changeDescription} sx={{ml: 0, mt: 3}} variant='success' icon={<SaveIcon />}>
					<Typography> Save Changes </Typography>
				</StyledButton>
			</Box>

			<Box className="card" sx={{p: 3, my: 5}}>
				<Typography component="h2" className="bold"> Date Joined </Typography>
				<Typography component="h2" sx={{mt: 1}}> {data?.date_created} </Typography>
			</Box>
		</Box>
	)
}


export default BusinessControls;