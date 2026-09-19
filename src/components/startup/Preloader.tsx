import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
  durationMs?: number;
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: (i * 17) % 100,
  y: (i * 23) % 100,
  size: (i % 3) * 4 + 4,
  duration: 3 + (i % 4) * 1.2,
  delay: (i % 5) * 0.3,
}));

const FLOATING_RUPEES = [
  { id: 'r1', x: '15%', y: '25%', delay: 0.1, rotate: -12, scale: 0.9 },
  { id: 'r2', x: '82%', y: '20%', delay: 0.4, rotate: 18, scale: 1.1 },
  { id: 'r3', x: '12%', y: '70%', delay: 0.7, rotate: -22, scale: 0.85 },
  { id: 'r4', x: '85%', y: '72%', delay: 0.3, rotate: 15, scale: 1.0 },
  { id: 'r5', x: '78%', y: '46%', delay: 0.6, rotate: -8, scale: 0.75 },
];

const TEXT_SEQUENCE = [
  { threshold: 0, text: 'Initializing AI...' },
  { threshold: 24, text: 'Reading receipts...' },
  { threshold: 48, text: 'Analyzing SMS...' },
  { threshold: 75, text: 'Preparing Dashboard...' },
  { threshold: 95, text: 'Ready!' },
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, durationMs = 3500 }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing AI...');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      // Find current stage text
      const matchingStage = [...TEXT_SEQUENCE].reverse().find((s) => pct >= s.threshold);
      if (matchingStage) {
        setCurrentText(matchingStage.text);
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <Box
      id="rupeemind-preloader-screen"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(47, 102, 246, 0.35) 0%, rgba(11, 18, 32, 0.95) 70%, #0B1220 100%), linear-gradient(145deg, #0B1220 0%, #162447 50%, #2F66F6 100%)',
        overflow: 'hidden',
        color: '#FFFFFF',
        userSelect: 'none',
      }}
    >
      {/* Ambient background particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0.15, 0.7, 0.15],
            y: [-20, 20, -20],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 209, 255, 0.8) 0%, rgba(47, 102, 246, 0.2) 100%)',
            pointerEvents: 'none',
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Floating Rupee Icons */}
      {FLOATING_RUPEES.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.35, 0.8, 0.35],
            y: [-12, 12, -12],
            rotate: [r.rotate - 8, r.rotate + 8, r.rotate - 8],
          }}
          transition={{
            duration: 4,
            delay: r.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              width: 44 * r.scale,
              height: 44 * r.scale,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(47, 102, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.35)',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: `${20 * r.scale}px`,
            }}
          >
            ₹
          </Box>
        </motion.div>
      ))}

      {/* Skip Button */}
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <Button
          id="skip-preloader-btn"
          variant="outlined"
          onClick={onComplete}
          size="small"
          endIcon={<ArrowRight size={14} />}
          sx={{
            color: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.06)',
            textTransform: 'none',
            fontSize: '0.8rem',
            px: 2,
            '&:hover': {
              borderColor: '#00D1FF',
              background: 'rgba(0, 209, 255, 0.12)',
            },
          }}
        >
          Skip Intro
        </Button>
      </Box>

      {/* Center Hero Visual */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 460,
          px: 3,
          zIndex: 5,
        }}
      >
        {/* Animated RupeeMind Logo with Circular Progress */}
        <Box sx={{ position: 'relative', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Circular Progress surrounding Logo */}
          <Box sx={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={130}
              thickness={2}
              sx={{ color: 'rgba(255, 255, 255, 0.1)', position: 'absolute' }}
            />
            <CircularProgress
              variant="determinate"
              value={progress}
              size={130}
              thickness={3}
              sx={{
                color: '#00D1FF',
                position: 'absolute',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                  transition: 'stroke-dashoffset 0.08s linear',
                },
              }}
            />

            {/* Logo Pulse Halo */}
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                inset: 5,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 209, 255, 0.45) 0%, rgba(47, 102, 246, 0) 70%)',
                filter: 'blur(12px)',
                pointerEvents: 'none',
              }}
            />

            {/* Core RupeeMind Emblem */}
            <motion.div
              animate={{
                scale: [0.96, 1.04, 0.96],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: '26px',
                  background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 16px 40px rgba(47, 102, 246, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  position: 'relative',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '2.8rem',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1,
                    textShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  ₹
                </Typography>

                {/* Floating AI Spark Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: 'linear-gradient(135deg, #FFB800 0%, #FF6B6B 100%)',
                    borderRadius: '50%',
                    p: 0.6,
                    display: 'flex',
                    boxShadow: '0 4px 12px rgba(255, 184, 0, 0.6)',
                  }}
                >
                  <Sparkles size={14} color="#FFFFFF" />
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* RupeeMind Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.03em',
              mb: 0.5,
              background: 'linear-gradient(135deg, #FFFFFF 30%, #90CAF9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            RupeeMind
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              fontWeight: 500,
              mb: 3.5,
            }}
          >
            AI Personal Finance Assistant
          </Typography>
        </motion.div>

        {/* Glowing Linear Progress Bar */}
        <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
          <Box
            sx={{
              width: '100%',
              height: 8,
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
            }}
          >
            <motion.div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2F66F6 0%, #00D1FF 80%, #FFFFFF 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 18px rgba(0, 209, 255, 0.9), 0 0 8px rgba(47, 102, 246, 0.8)',
                transition: 'width 0.08s linear',
              }}
            />
          </Box>
        </Box>

        {/* Text Sequence & Percentage */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            minHeight: 24,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: '#00D1FF',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                }}
              >
                <Zap size={13} />
                {currentText}
              </Typography>
            </motion.div>
          </AnimatePresence>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 800,
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            {progress}%
          </Typography>
        </Box>

        {/* Security badge at bottom */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.8,
              py: 0.6,
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <ShieldCheck size={14} color="#10B981" />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', fontWeight: 500, fontSize: '0.75rem' }}>
              Bank-Grade 256-bit Encryption • Gemini 2.5 Flash
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
