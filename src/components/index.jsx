import React, {useContext, useRef, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Stack, Input as TextInput, Alert, AlertTitle, ClickAwayListener,} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Rating from '@mui/material/Rating';
import useMediaQuery from '@mui/material/useMediaQuery';
import GlobalStore from '../store';
import { Icon, TextField, CircularProgress, Tooltip } from "@mui/material";
import { Cancel, Check, Refresh } from '@mui/icons-material';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import UploadIcon from '@mui/icons-material/Upload';
import RadioSelect from '@mui/material/Radio';
import { Add, DeleteForever, PlusOne, Star } from '@mui/icons-material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import InfoIcon from '@mui/icons-material/InfoOutlined';





export const RichTextField = ({ content, onChange }) => {
	const [editor, setWYSIWYG] = useState(null)


  return(
    <CKEditor
      editor={ ClassicEditor }
      config={{
        toolbar: [	
          "undo",	"redo",	"|", "heading",	"|", "bold", "italic", "underline",	"|",
          "link",	"insertTable", "blockQuote","|",
          "bulletedList",	"numberedList", "outdent",	"indent"
        ]
      }}
      data={content}
      sx={{
        minHeight: '400px !important',
      }}
      onReady={ editor => {
          // You can store the "editor" and use when it is needed.				
          setWYSIWYG(editor)
      }}
      onChange={( event, editor ) => {
        const data = editor.getData();
        onChange(data)
      }}
    />
  )
}



export const ChartComponent = ({ data, choices, type, ...props }) => {
  const {navIsOpen} = useContext(GlobalStore)

  const chartRef = useRef(null);

  return (
    <Box
      id="chart-container" className=""
      sx={{
        p: 3, width: '100% !important',
        maxWidth: '-webkit-fill-available'
      }}
     >
      <Chart type={type} {...props} choices={choices} ref={chartRef} data={data} />
    </Box>
  );
};


export const AskConfirmationModal = ({ title, message, onCancel, onApprove, setOverlayState }) =>{
  const {notify} = useContext(GlobalStore);
  // console.log("Choices", choices)

  function onProceed(){
    setOverlayState(false);
    try{
      onApprove()
    }catch(error){
      notify('error', error.message)
    }
  }

  function onAbort(){
    setOverlayState(false);
    onCancel()
  }

  return(
    <Box className="overlay-inner">
      <Box className="card" sx={{width: '95%', maxWidth: 500 }}>
        <Box className="card-header" sx={{p: 2, borderBottom: "1px solid lavender"}}>
          <Typography sx={{fontSize: 17, fontWeight: 600}}> {title} </Typography>
        </Box>

        <Box className="card-body" sx={{px: 2, py: 3}}>
          <Typography> {message} </Typography>
        </Box>

        <Grid container className="" sx={{p: 2,}}>
          <StyledButton icon={<Check />} type="contained" variant="primary" onClick={onProceed}> <Typography> Proceed </Typography></StyledButton>
          <StyledButton icon={<Cancel />} type="contained" variant="warning" onClick={onAbort}> <Typography> Cancel </Typography></StyledButton>
        </Grid>
      </Box>
    </Box>
  )
}


export const ModalPopover = ({ render, show }) => {
  const [open, setVisibleState] = useState(show)
  return(
    <Backdrop className="overlay" open={open}> 
        <Box py={5} onLoad={(e) => e.target.focus()} className="overlay-inner">
          <ClickAwayListener onClickAway={() => setVisibleState(false)}>
          {render}
          </ClickAwayListener>
        </Box>
    </Backdrop> 
  )
}

export const Overlay = ModalPopover;


export const StyledButton = ({ sx, variant='primary', onClick, type, icon, ...props }) => {
  const self = useRef();
  const [clicked, setClickState] = useState(false);

  const BG_COLORS = {
    'primary': 'cornflowerblue',
    'dark': 'black',
    'secondary': 'purple',
    'danger': 'red',
    'info': 'teal',
    'warning': 'orange',
    'success': 'limegreen',
  }

  function handleClick(event){
    setClickState(true);
    setTimeout(() => setClickState(false), 500)

    if (onClick){
      onClick()
    }
  }

  return(
    <IconButton variant={type|| 'contained'} ref={self} sx={{
       borderRadius: '5px',
       background: BG_COLORS[variant],
       color: '#fff',
       m: 1,
       ml: 0,
       display: 'flex',
       alignItems: 'center',
       ':hover': {background: BG_COLORS[variant], opacity: .7},
       '.disabled': {pointerEvents: 'none', opacity: .75},
       ...sx
      }} onClick={handleClick} disabled={clicked? true: false} {...props}>
        <span style={{padding: '0px 5px', fontSize: '0px'}}>
          {
            clicked ?
            <CircularProgress indeterminate sx={{color: "black !important"}} size={20} />
            :
            icon
          }
        </span>
        {props.children}
      </IconButton>
  )
}


// Moved to v 2.0

export const CustomizationForm = ({ onSubmit, onClose }) => {

	const choicesField = useRef();
	const {notify} = useContext(GlobalStore);
	const [name, setName] = useState("");
	const [choices, setChoices] = useState([
		{idx: 0, name: '', price: 1.00, is_default: true},
		{idx: 1, name: '', price: 1.00, is_default: false},
	]);
	

	function perfromChecks(){
		if(!name) return false;
		if(!choices) return false;
		return true
	}

	function changeOptionName(idx, val){
		let _choices = choices;
		const opt = _choices[idx]
		opt.name = val;
		_choices[idx] = opt
		setChoices([..._choices])
	}
	
	function setDefaultOption(idx){
		let _choices = choices;

		let old = _choices.find(val => val.is_default === true)
		const opt = _choices[idx]
		old.is_default = false
		opt.is_default = true;
		_choices[idx] = opt
		setChoices([..._choices])
	}
	
	function changeOptionPrice(idx, val){
		let _choices = choices;
		const opt = _choices[idx]
		opt.price = val;
		_choices[idx] = opt
		setChoices([..._choices])
	}

	function addOption(){
		setChoices([...choices, {idx: choices.length-1, name:'', price: '1.00', is_default: false}])
	}

	function removeOption(idx){
		let _choices = choices;
		_choices.splice(idx, 1)
		setChoices([..._choices])
	}

	function handleSubmit(){
		const passed = perfromChecks();

		if (passed){
			onSubmit({
				name,
				choices,
			})
			return onClose()
		}
		return notify("warning", "Please fill all fields.")
	}

	return(
		<Box className="card" sx={{maxWidth: '700px', width: '90%', p: 2, mt: 3}}>
			<Typography component="h2" py={3}  className="form-title"> Add Customization </Typography>

      <hr />

			<form onSubmit={e => e.preventDefault()}>
				<Stack sx={{}} className="">

					<Box className="form-group" sx={{mb: 2}}>
						<Typography sx={{mb: .3}}> Customization name </Typography>
						<TextInput disableUnderline type="text" value={name} onInput={e => setName(e.target.value)} className="input"  />
					</Box>

					<Box className="form-group" sx={{mb: 2}}>
						<Grid className="d-flex just-between align-center">
							<Typography sx={{mb: .3}}> Available Choices </Typography>
							<StyledButton size="small" variant='secondary' px={2} onClick={addOption} icon={<Add />}></StyledButton>
						</Grid>

						<Stack ref={choicesField} className="" sx={{mt: 2}}>
							<Typography sx={{mb: .3, color: 'orangered'}}> At least 2 choices are required </Typography>

							{
								choices.map((item, idx) => (
									<Box className="form-group input" sx={{mb: 1}}>
											<Box justifyContent={'space-between'} display={'flex'}>
												<Grid container wrap="wrap" className="align-center" sx={{mt: .2}}>
												<Tooltip arrow placement='right' title="Set as default option">
												<RadioSelect
													 icon={<Star />}
													 size='small'
													 checked={item.is_default}
													 color='warning'
													 checkedIcon={<Star />}
													//  value={defaultOption}
													 name="default-option"
													 onInput={(e) => setDefaultOption(idx)}
													 /> 
													</Tooltip>
												</Grid>
												{
													choices.length > 2 &&
													<IconButton color='error' onClick={(e) => removeOption(idx)}> <DeleteForever /> </IconButton>
												}
											</Box>

										<Grid container spacing={2} className="flexbox align-center just-between">
											<Grid item xs={6}>
												<Box className="form-group" sx={{mb: .25}}>
													<Typography sx={{mb: .3}}> Option </Typography>
													<TextInput disableUnderline type="text" value={item.name} onInput={e => changeOptionName(idx, e.target.value)} className="input"  />
												</Box>
											</Grid>

											<Grid item xs={6}>
												<Box className="form-group" sx={{mb: .25}}>
													<Typography sx={{mb: .3}}> Extra Price </Typography>
													<TextInput disableUnderline defaultValue={1.00} type="number" step={0.01} min={1.00} value={item.price} onInput={e => changeOptionPrice(idx, e.target.value)} className="input"  />
												</Box>
											</Grid>
										</Grid>
									</Box>
									)
								)
							}
						</Stack>
					</Box>
				</Stack>
        
        <hr />

				<IconButton onClick={handleSubmit} sx={{
					 borderRadius: '5px',
					 background: 'cornflowerblue',
					 color: '#ffe',
					 ':hover': {background: 'cornflowerblue', opacity: .8},
					 mt: 1,
					 mr: 1
					}}
				 >
					<SaveIcon />
					<Typography sx={{mx: 1, color: '#ffe'}}> Add Customization </Typography>
				</IconButton>

				<IconButton onClick={onClose} sx={{
					 borderRadius: '5px',
					 background: 'orange',
					 color: '#ffe',
					 ':hover': {background: 'orange', opacity: .8},
					 mt: 1
					}}
				 >
					<CancelIcon />
					<Typography sx={{mx: 1, color: '#ffe'}}> Cancel </Typography>
				</IconButton>
			</form>
		</Box>
	)
}



export const ErrorUI = () => {
  const [message, setMessage] = React.useState("Something went wrong.");

  const handleRefresh = () => {
    setMessage("");
    document.location.reload()
  };

  return (
    <Page>
      <Icon color="error" size="large">
        error
      </Icon>

      <Typography
        sx={{ m: 10 }}
      > {message} </Typography>

      <StyledButton variant="secondary" size="small" icon={<Refresh />} onClick={handleRefresh}>
        <Typography> Refresh Page </Typography>
      </StyledButton>
    </Page>
  );
};



export function BackButton({ path, className, label, onClick, sx, ...props }){
  const navigate = useNavigate()

  function goBack(){
    if (onClick){
      return onClick()
    }
    if(path && path !== null){
      navigate(path)
    }else{
      window.history.back(-1)
    }
  }

  return(
    <IconButton sx={{
       borderRadius: '5px',
       fontWeight: 600,
       background: 'black',
       m: 1,
       opacity: .8,
       ':hover': {background: 'black', opacity: .7},
       ...sx
      }}
      onClick={goBack}
      className={`no-print ${className}`} {...props}>
        <ChevronLeft sx={{color: '#ffe'}} />
        <Typography sx={{mx: 1, color: '#ffe'}}> {label === '' || label ? label : 'Go Back'} </Typography>
    </IconButton>
  )
}


export function Page({children, ...props}){
  const self = useRef();
  const store = {is_active: false}
  function scrollToTop() {
    try{
      if(self.current){
        window.scrollTo({
          behavior: 'smooth',
          top: self.current.offsetTop - 100
        })
      }
    }catch(error){
      console.log("Error scrolling:", error.message)
    }
  }

  useEffect(() => {
    setTimeout(() => scrollToTop(), 400)
  }, []);

  return (
    <Box ref={self} className="page" sx={{ px: 3}} {...props}>
      {!store.is_active && 
        <KYCAlert />
      }

      {children}
    </Box>
  )
}


export function KYCAlert(){
  return(
    <Alert icon={<InfoIcon  />} severity='warning' sx={{borderRadius: 2, py: 1}}>
      <AlertTitle fontSize={'inherit'} className='bold'> Your Store is Disabled  </AlertTitle>
      <Typography fontSize={'inherit'}>
        You have not completed your KYC verification. <br />
        Until you complete your verification, your store won't be accessible to your customers.
      </Typography>
      
      <Button variant='contained' color={'warning'} disableElevation fontSize={'inherit'} sx={{ flex: 1, mt: 2}} size="small"> Complete KYC Verification </Button>
    </Alert>
  )
}


export function MediaQueryRender({ element }){
  const matches = useMediaQuery('(min-width:600px)');

  if(matches)
    return(
      <React.Fragment>
        {element}
      </React.Fragment>
    )
}


export function BasicRating() {
  const [value, setValue] = React.useState(2);

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
    >
      <Typography component="legend">Controlled</Typography>
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}


export function TabNavigation({links, value}){
  function handleChange(){

  }

  return(
    <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
      <LinkTab label="Page One" href="/drafts" />
      <LinkTab label="Page Two" href="/trash" />
      <LinkTab label="Page Three" href="/spam" />
    </Tabs>
  )
}

export function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

// export function DatePickerWidget (props){
//   return(
//     <DesktopDatePicker
//       label="Date desktop"
//       inputFormat="MM/dd/yyyy"
//       value={value}
//       onChange={handleChange}
//       renderInput={(params) => <TextField {...params} />}
//     />
//   )
// }


// export function TimePickerWidget (props){
//   return(
//     <TimePicker
//       label="Time"
//       value={value}
//       onChange={handleChange}
//       renderInput={(params) => <TextField {...params} />}
//     />
//   )
// }
