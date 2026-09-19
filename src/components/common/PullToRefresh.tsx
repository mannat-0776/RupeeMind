import React, { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { RefreshCw, ArrowDown, Sparkles } from 'lucide-react';
import { Box, Typography } from '@mui/material';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  pullThreshold?: number; // Distance in pixels to trigger refresh (default: 75)
  maxPullDistance?: number; // Max allowed drag distance (default: 130)
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  pullThreshold = 75,
  maxPullDistance = 130,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // 0 to 1
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  // Transform values based on pull distance
  const opacity = useTransform(y, [0, 30, pullThreshold], [0, 0.6, 1]);
  const scale = useTransform(y, [0, pullThreshold], [0.7, 1]);
  const rotate = useTransform(y, [0, pullThreshold, maxPullDistance], [0, 180, 360]);

  const handleTouchStart = () => {
    // Check if container is at the very top
    const scrollTop = window.scrollY || document.documentElement.scrollTop || containerRef.current?.scrollTop || 0;
    return scrollTop <= 2;
  };

  const handleDrag = (_: any, info: any) => {
    if (isRefreshing) return;
    const currentY = Math.max(0, info.offset.y);
    const progress = Math.min(1, currentY / pullThreshold);
    setPullProgress(progress);
  };

  const handleDragEnd = async (_: any, info: any) => {
    if (isRefreshing) return;

    if (info.offset.y >= pullThreshold) {
      setIsRefreshing(true);
      // Animate to holding position while refreshing
      animate(y, 65, { type: 'spring', stiffness: 400, damping: 25 });

      try {
        await Promise.resolve(onRefresh());
      } catch (err) {
        console.error('Error during pull to refresh:', err);
      } finally {
        // Small delay for smooth feedback
        setTimeout(() => {
          setIsRefreshing(false);
          setPullProgress(0);
          animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
        }, 500);
      }
    } else {
      setPullProgress(0);
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Pull Indicator Pill */}
      <motion.div
        style={{
          position: 'absolute',
          top: 8,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 40,
          opacity: isRefreshing ? 1 : opacity,
          scale: isRefreshing ? 1 : scale,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.8,
            borderRadius: '24px',
            bgcolor: 'background.paper',
            color: 'primary.main',
            boxShadow: '0 8px 24px rgba(47, 102, 246, 0.25)',
            border: '1px solid',
            borderColor: 'primary.main',
            backdropFilter: 'blur(8px)',
          }}
        >
          {isRefreshing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <RefreshCw size={16} color="#2F66F6" />
              </motion.div>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Updating RupeeMind AI...
              </Typography>
            </>
          ) : pullProgress >= 1 ? (
            <>
              <Sparkles size={16} color="#00D1FF" />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#00D1FF' }}>
                Release to refresh
              </Typography>
            </>
          ) : (
            <>
              <motion.div style={{ rotate, display: 'flex', alignItems: 'center' }}>
                <ArrowDown size={16} color="#2F66F6" />
              </motion.div>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Pull down to sync
              </Typography>
            </>
          )}
        </Box>
      </motion.div>

      {/* Draggable Content Container */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.65, bottom: 0 }}
        style={{ y }}
        onDragStart={handleTouchStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </Box>
  );
};
