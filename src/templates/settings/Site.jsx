import React, {useState, useContext, useRef} from 'react';
import {BarChart, StyledButton} from '../../components'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import {Typography, Divider, Grid} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {DashboardLoader} from '../../components/loaders';
import EditIcon from '@mui/icons-material/Edit';
import {Page} from '../../components/index';
import Stack from '@mui/material/Stack';
import logo from '../../logo.svg'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageIcon from '@mui/icons-material/Filter';
import { Save as SaveIcon, ChangeHistory, ConnectWithoutContact } from '@mui/icons-material';


export const SiteControls = ({ data, ...props}) => {
	const isLargeDisplay = useMediaQuery('(min-width: 768px)')
	const {axios, notify, org, parseDate} = useContext(GlobalStore);
	const uploader = useRef()
	const [image, setImage] = useState(null)

	async function changeImage(){
		try {
			const file = image.image;
			const payload = new FormData()
			payload.append('banner', file, file.name)

			const res = await axios.post(`/manage/?target=restaurant:banner`, payload, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			if(res.status === 200){
				notify('success', "Successfully change your logo")
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
				<Typography component="h2" className="title"> Site Information </Typography>
			</Box>

			<Stack>
				<Box className="card" sx={{p: 3, my: 5}}>
					<Typography component="h2" sx={{mb: 3}} className="bold"> Banner Image </Typography>
					<Box
						sx={{
							borderRadius: 2,
							border: '3px dashed lavender',
							p: 1,
							width: '-webkit-fill-available',
							height: isLargeDisplay ? 400 : 220,
							justifyContent: 'center',
							alignItems: 'center',
							display: 'flex'
						}}
					>
						<img  height={'100%'} width={'100%'} alt="Logo Display" src={image? image.url : data?.banner_url	} />
					</Box>

					<input ref={uploader} type="file" accept="image/*" className="d-none" onInput={(ev) => uploadImage(ev.target.files[0])} />

					<Grid container>
						<StyledButton onClick={() => uploader.current.click()} sx={{mt: 3}} icon={<ImageIcon />} variant={'secondary'}> <Typography> Change Image </Typography> </StyledButton>
						{image && <StyledButton onClick={changeImage} sx={{mt: 3}} icon={<SaveIcon />} variant={'success'}> <Typography> Save Image </Typography> </StyledButton>}
					</Grid>
				</Box>

				<Box className="card" sx={{p: 3, my: 3.5}}>
					<Typography component="h2" sx={{mb: 3}} className="bold"> Featured Items </Typography>
					

					<Box>
					
					</Box>
				</Box>
			</Stack>
		</Box>
	)
}


export default SiteControls;