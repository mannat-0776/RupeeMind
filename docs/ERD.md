# RupeeMind Entity-Relationship (ER) Diagram

The database schema is designed for PostgreSQL with Supabase Row Level Security (RLS) enabled on all tables.

```mermaid
erDiagram
    USERS ||--o{ TRANSACTIONS : owns
    USERS ||--o{ BUDGETS : defines
    USERS ||--o{ GOALS : sets
    USERS ||--o{ INSIGHTS : receives
    USERS ||--o{ BANK_ACCOUNTS : links
    TRANSACTIONS ||--o{ TRANSACTION_ITEMS : contains

    USERS {
        uuid id PK "auth.uid()"
        varchar email "Unique user email"
        varchar full_name "Display name"
        varchar avatar_url "Profile image URL"
        varchar currency "Default: INR (₹)"
        timestamptz created_at "Account creation timestamp"
        timestamptz updated_at "Last modification timestamp"
    }

    TRANSACTIONS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "References users.id"
        numeric amount "Transaction amount in INR"
        varchar type "'expense' | 'income'"
        varchar category "'Food & Dining' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Healthcare' | 'Salary' | 'Investment' | 'Others'"
        varchar merchant "Merchant or payee name"
        varchar source "'receipt' | 'sms' | 'manual' | 'bank_sync'"
        text raw_text "Original SMS or OCR raw text"
        numeric confidence "AI parser confidence score (0.00 - 1.00)"
        numeric tax "GST / VAT component"
        text notes "Optional custom user memo"
        timestamptz created_at "Transaction timestamp"
    }

    TRANSACTION_ITEMS {
        uuid id PK "gen_random_uuid()"
        uuid transaction_id FK "References transactions.id ON DELETE CASCADE"
        varchar item_name "Product / service description"
        numeric price "Unit / total price"
        integer quantity "Item quantity (default: 1)"
    }

    BUDGETS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "References users.id"
        varchar category "Target category"
        numeric limit "Monthly spending cap in INR"
        numeric spent "Current tracked expenditure"
        varchar month "Target month in YYYY-MM format"
        timestamptz updated_at "Last recalculated"
    }

    GOALS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "References users.id"
        varchar title "Goal objective name"
        numeric target "Target amount in INR"
        numeric current "Accumulated savings"
        date target_date "Estimated completion milestone"
        varchar category "'Emergency' | 'Travel' | 'Electronics' | 'SIP' | 'Vehicle'"
        varchar icon "Lucide icon key"
        timestamptz created_at "Timestamp created"
    }

    INSIGHTS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "References users.id"
        text message "Actionable AI financial insight"
        varchar priority "'high' | 'medium' | 'low'"
        varchar category "Associated category"
        numeric potential_savings "Calculated monthly reduction"
        varchar action_text "CTA label"
        boolean is_dismissed "Default: false"
        timestamptz created_at "Timestamp generated"
    }

    BANK_ACCOUNTS {
        uuid id PK "gen_random_uuid()"
        uuid user_id FK "References users.id"
        varchar bank_name "Bank / Card issuer name"
        varchar last4 "Masked last 4 digits"
        numeric balance "Live linked balance"
        boolean is_connected "Sync connection status"
        timestamptz last_synced_at "Last sync timestamp"
    }
```

---

## Row Level Security (RLS) Policies

All tables enforce strict user isolation:
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read and mutate their own transactions"
ON transactions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```
