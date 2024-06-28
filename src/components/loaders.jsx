import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';


export function ContactLoader(props) {
  const { loading = false } = props;

  return (
    <Grid container wrap="nowrap">
      {[0,0, 0].map((item, index) => (
        <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
         <Skeleton variant="rectangular" width={210} height={118} />
          <Box sx={{ pt: 0.5 }}>
            <Skeleton />
            <Skeleton width="60%" />
          </Box>

        </Box>
      ))}
    </Grid>
  );
}


export function DashboardLoader(props) {
  const { loading = false } = props;

  return (
    <Stack>
      <Skeleton width="100%" height="50px" />

      <Grid container wrap="wrap" className="flexbox boards">
        {[0,0,0,0].map((item, index) => (
            <Box className="board" key={index} sx={{ my: 3 }}>
              <Skeleton variant="rectangular" sx={{borderRadius: '5px'}} width="100%" height={118} />
            </Box>
          )
        )}
      </Grid>

      <Grid container wrap="wrap" className="flexbox boards" sx={{ my: 1.5}}>
        <Box width="49%">
          <Skeleton variant="rectangular" sx={{borderRadius: '5px'}} width="100%" height={300} />
        </Box>

        <Box width="49%">
          <Skeleton variant="rectangular" sx={{borderRadius: '5px'}} width="100%" height={300} />
        </Box>
      </Grid>
    </Stack>
  );
}


export function StaffLoader(props) {
  const { loading = false } = props;

  return (
    <Stack>
      <Skeleton width="100%" height="50px" />

      <Grid container wrap="wrap" sx={{my: 2}} className="flexbox">
        <Skeleton variant="rectangular" sx={{borderRadius: '5px'}} width="100px" height={35} />
        <Skeleton variant="rectangular" sx={{borderRadius: '5px', ml: 2}} width="100px" height={35} />
      </Grid>

      <Grid container wrap="wrap" className="flexbox boards" sx={{ my: 1.5}}>
        <Skeleton variant="rectangular" sx={{borderRadius: '5px', mb: 2}} width="100%" height={250} />
      </Grid>
    </Stack>
  );
}

export function FormLoader(props) {
  const { loading = false } = props;

  return (
    <Stack>
      <Grid container wrap="wrap" sx={{my: 2}} className="flexbox">
        <Skeleton variant="rectangular" sx={{borderRadius: '5px'}} width="100px" height={35} />
      </Grid>

      <Skeleton sx={{mb: 1}} width="100%" height="50px" />

      <Grid container wrap="wrap" className="flexbox boards" sx={{ my: 1.5}}>
        <Skeleton variant="rectangular" sx={{borderRadius: '5px', mb: 2}} width="100%" height={250} />
      </Grid>
    </Stack>
  );
}
