import React from 'react';
import { Card, CardContent, Skeleton, Box, Grid } from '@mui/material';

export const DashboardSkeleton: React.FC = () => {
  return (
    <Box sx={{ py: 2 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={280} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={420} height={24} />
      </Box>

      {/* KPI Cards Skeleton */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[1, 2, 3].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 2, height: 180, borderRadius: '20px' }}>
              <CardContent>
                <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="70%" height={50} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 5 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chart and Lists Skeleton */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 3, height: 360, borderRadius: '20px', mb: 3 }}>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={260} sx={{ borderRadius: '14px' }} />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 3, height: 360, borderRadius: '20px' }}>
            <Skeleton variant="circular" width={180} height={180} sx={{ mx: 'auto', mb: 3 }} />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
