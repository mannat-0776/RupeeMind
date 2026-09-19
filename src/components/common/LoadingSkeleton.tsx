import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

export const MetricCardSkeleton: React.FC = () => (
  <Card sx={{ p: 1 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
      <Skeleton variant="rectangular" width="60%" height={36} sx={{ borderRadius: '8px', mb: 1.5 }} />
      <Skeleton variant="text" width="80%" height={18} />
    </CardContent>
  </Card>
);

export const DashboardSkeleton: React.FC = () => (
  <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Skeleton variant="text" width={240} height={40} />
        <Skeleton variant="text" width={320} height={22} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Skeleton variant="rectangular" width={110} height={42} sx={{ borderRadius: '14px' }} />
        <Skeleton variant="rectangular" width={130} height={42} sx={{ borderRadius: '14px' }} />
      </Box>
    </Box>

    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCardSkeleton />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCardSkeleton />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCardSkeleton />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCardSkeleton />
      </Grid>
    </Grid>

    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 2.5 }}>
          <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={260} sx={{ borderRadius: '16px' }} />
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2.5 }}>
          <Skeleton variant="text" width={160} height={28} sx={{ mb: 2 }} />
          <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', my: 2 }} />
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Card sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="rectangular" width={220} height={40} sx={{ borderRadius: '12px' }} />
      <Skeleton variant="rectangular" width={140} height={40} sx={{ borderRadius: '12px' }} />
    </Box>
    {Array.from({ length: rows }).map((_, idx) => (
      <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Skeleton variant="text" width={90} height={24} />
        <Skeleton variant="text" width={180} height={24} />
        <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: '12px' }} />
        <Skeleton variant="text" width={80} height={24} />
      </Box>
    ))}
  </Card>
);

export const CardListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <Grid container spacing={2.5}>
    {Array.from({ length: count }).map((_, idx) => (
      <Grid key={idx} size={{ xs: 12, md: 4 }}>
        <Card sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={44} height={44} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="70%" height={24} />
              <Skeleton variant="text" width="40%" height={18} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width="100%" height={12} sx={{ borderRadius: '6px', mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={38} sx={{ borderRadius: '12px' }} />
        </Card>
      </Grid>
    ))}
  </Grid>
);
