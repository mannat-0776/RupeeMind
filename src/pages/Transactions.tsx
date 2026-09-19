import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  TextField,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Download,
  Plus,
  Trash2,
  Edit2,
  Receipt,
  FileText,
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { CategoryType, Transaction } from '../types';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { EmptyState } from '../components/common/EmptyState';
import { PullToRefresh } from '../components/common/PullToRefresh';

interface TransactionsProps {
  onOpenAddTx: () => void;
  onOpenScanReceipt: () => void;
  onOpenParseSms: () => void;
}

const ALL_CATEGORIES: CategoryType[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Salary',
  'Investment',
  'Others',
];

export const Transactions: React.FC<TransactionsProps> = ({
  onOpenAddTx,
  onOpenScanReceipt,
  onOpenParseSms,
}) => {
  const { transactions, deleteTransaction, updateTransaction, fetchAiInsights } = useFinanceStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  const handleRefresh = async () => {
    // Refresh insights & state
    await fetchAiInsights();
  };

  // Edit Modal State
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Filter Logic
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesSource = selectedSource === 'all' || tx.source === selectedSource;

    return matchesSearch && matchesCategory && matchesType && matchesSource;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Date,Merchant,Category,Type,Amount,Source,Notes\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.id}","${t.created_at}","${t.merchant}","${t.category}","${t.type}",${t.amount},"${t.source}","${t.notes || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RupeeMind_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            All Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage, search, and export your categorized expenses & income logs.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            id="export-csv-btn"
            variant="outlined"
            onClick={handleExportCSV}
            startIcon={<Download size={18} />}
            sx={{ borderRadius: '14px', px: 2, fontWeight: 700 }}
          >
            Export CSV
          </Button>
          <Button
            id="new-tx-btn"
            variant="contained"
            onClick={onOpenAddTx}
            startIcon={<Plus size={18} />}
            sx={{
              borderRadius: '14px',
              px: 2.5,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
            }}
          >
            New Transaction
          </Button>
        </Box>
      </Box>

      {/* Filter Bar */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* Search Field */}
          <TextField
            id="tx-search-input"
            placeholder="Search merchant, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: 220 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#64748B" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Category Filter */}
          <TextField
            id="tx-filter-category"
            select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {ALL_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Type Filter */}
          <TextField
            id="tx-filter-type"
            select
            label="Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </TextField>

          {/* Source Filter */}
          <TextField
            id="tx-filter-source"
            select
            label="Source"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            size="small"
            sx={{ minWidth: 130 }}
          >
            <MenuItem value="all">All Sources</MenuItem>
            <MenuItem value="receipt">Receipt OCR</MenuItem>
            <MenuItem value="sms">Bank SMS</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
            <MenuItem value="bank_sync">Bank Sync</MenuItem>
          </TextField>
        </Box>
      </Card>

      {/* Transactions Table or Empty State */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={transactions.length === 0 ? 'No Transactions Recorded' : 'No Matching Transactions'}
          description={
            transactions.length === 0
              ? 'Start by adding a manual expense, scanning a receipt with Gemini Vision OCR, or pasting bank SMS transaction text.'
              : 'No transactions matched your current search filters. Try clearing your search keyword or changing category filters.'
          }
          actionText={transactions.length === 0 ? 'Add Transaction' : 'Clear Filters'}
          onAction={
            transactions.length === 0
              ? onOpenAddTx
              : () => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedSource('all');
                }
          }
          secondaryActionText={transactions.length === 0 ? 'Scan Receipt' : undefined}
          onSecondaryAction={transactions.length === 0 ? onOpenScanReceipt : undefined}
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Merchant / Details</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {formatDate(tx.created_at)}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {tx.merchant}
                      </Typography>
                      {tx.notes && (
                        <Typography variant="caption" color="text.secondary">
                          {tx.notes}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.category}
                      size="small"
                      sx={{
                        bgcolor: `${getCategoryColor(tx.category)}18`,
                        color: getCategoryColor(tx.category),
                        fontWeight: 700,
                        border: `1px solid ${getCategoryColor(tx.category)}40`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.source.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 800,
                        color: tx.type === 'income' ? '#10B981' : 'text.primary',
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Transaction">
                      <IconButton size="small" aria-label="Edit transaction" onClick={() => setEditingTx(tx)}>
                        <Edit2 size={16} color="#64748B" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Transaction">
                      <IconButton size="small" aria-label="Delete transaction" onClick={() => deleteTransaction(tx.id)}>
                        <Trash2 size={16} color="#EF4444" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      {editingTx && (
        <Dialog
          open={Boolean(editingTx)}
          onClose={() => setEditingTx(null)}
          maxWidth="xs"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: '24px', p: 1 } } }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Edit Transaction</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              id="edit-tx-merchant"
              label="Merchant"
              value={editingTx.merchant}
              onChange={(e) => setEditingTx({ ...editingTx, merchant: e.target.value })}
              fullWidth
            />
            <TextField
              id="edit-tx-amount"
              label="Amount (₹)"
              type="number"
              value={editingTx.amount}
              onChange={(e) => setEditingTx({ ...editingTx, amount: parseFloat(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              id="edit-tx-category"
              select
              label="Category"
              value={editingTx.category}
              onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value as CategoryType })}
              fullWidth
            >
              {ALL_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="edit-tx-notes"
              label="Notes"
              value={editingTx.notes || ''}
              onChange={(e) => setEditingTx({ ...editingTx, notes: e.target.value })}
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setEditingTx(null)} variant="outlined" sx={{ borderRadius: '14px' }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateTransaction(editingTx.id, editingTx);
                setEditingTx(null);
              }}
              variant="contained"
              sx={{
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2F66F6 0%, #00D1FF 100%)',
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
    </PullToRefresh>
  );
};

