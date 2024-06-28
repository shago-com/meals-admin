import { Box, Grid, Typography } from "@mui/material";

const { Page, BackButton } = require("../../../components")



export const StaffRolesListPage = ({ props })=>{

    return(

        <Page>
            <BackButton path={'/staff'} />

            <Box className="titlebar">
				<Typography component="h2" className="title"> Staff Roles </Typography>
			</Box>

            <Typography
             component="h2"
             sx={{ my: 5, p: 2, background: 'lavender', fontSize: '18px'}}
             borderRadius={3}
            > Default Roles </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Box className="card" sx={{ p: 2 }}>
                        <Typography> Administrator </Typography>
                        <hr />
                        <Typography> Has administrative access to all routes and resources. </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Box className="card" sx={{ p: 2 }}>
                        <Typography> Branch Manager </Typography>
                        <hr />
                        <Typography> Has administrative control over assigned branches. </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Box className="card" sx={{ p: 2 }}>
                        <Typography> Customer Response </Typography>
                        <hr />
                        <Typography> Only allowed to manage orders and view customers. </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Typography
             component="h2"
             sx={{ my: 5, p: 2, background: 'lavender', fontSize: '18px'}}
             borderRadius={3}
            > Custom Roles </Typography>


        </Page>
    )
}



export default StaffRolesListPage;