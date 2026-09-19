# RupeeMind API & Architecture Documentation

Comprehensive developer guide detailing the database schema, Supabase Edge Functions, backend Express API endpoints, and Google Gemini AI interaction flow for **RupeeMind**.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema (Supabase PostgreSQL)](#database-schema-supabase-postgresql)
   - [Tables & Field Specifications](#tables--field-specifications)
   - [Row-Level Security (RLS) Policies](#row-level-security-rls-policies)
   - [Database Triggers & Functions](#database-triggers--functions)
3. [Supabase Edge Functions](#supabase-edge-functions)
   - [`parse-receipt` (Multimodal Vision OCR)](#1-parse-receipt-multimodal-vision-ocr)
   - [`parse-sms` (Bank Transactional SMS NLP)](#2-parse-sms-bank-transactional-sms-nlp)
4. [Backend Express API Endpoints](#backend-express-api-endpoints)
   - [`POST /api/parse-receipt`](#post-apiparse-receipt)
   - [`POST /api/parse-sms`](#post-apiparse-sms)
   - [`POST /api/generate-insights`](#post-apigenerate-insights)
   - [`GET /api/health`](#get-apihealth)
5. [Gemini AI Interaction Flow](#gemini-ai-interaction-flow)
   - [SDK & Model Configuration](#sdk--model-configuration)
   - [Request & Response Sequence](#request--response-sequence)
   - [Structured JSON Schema Enforcement](#structured-json-schema-enforcement)
   - [Security & Key Management](#security--key-management)

---

## Architecture Overview

RupeeMind follows a hybrid client-server and serverless cloud architecture designed for high security, low latency, and full Indian financial context awareness:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          RupeeMind React Frontend                      │
│                  (Vite + Tailwind CSS + Material UI + Zustand)         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        Node.js Express Server        │  │   Supabase Edge Functions    │
│             (Port 3000)              │  │        (Deno Runtime)        │
└───────────────────┬──────────────────┘  └──────────────┬───────────────┘
                    │                                    │
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Google Gemini 3.6 Flash API                        │
│                   (@google/genai TypeScript SDK)                       │
└────────────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Supabase PostgreSQL Database                         │
│               (Row-Level Security + Realtime + Triggers)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Supabase PostgreSQL)

The database schema is defined in `supabase/migrations/20260918000001_initial_schema.sql` and enforces strict relational integrity with foreign keys and Row-Level Security (RLS).

### Tables & Field Specifications

#### 1. `public.users`
Linked 1:1 with `auth.users`.
| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE` | - | Unique user identifier |
| `email` | `TEXT` | `NOT NULL, UNIQUE` | - | Primary email address |
| `name` | `TEXT` | `NOT NULL` | - | Display name |
| `avatar_url` | `TEXT` | - | - | Profile image URL |
| `monthly_income` | `NUMERIC(14,2)` | - | `125000.00` | Estimated monthly income in INR |
| `monthly_budget_target` | `NUMERIC(14,2)` | - | `75000.00` | Target monthly spending limit |
| `currency` | `VARCHAR(5)` | - | `'₹'` | Preferred currency symbol |
| `created_at` | `TIMESTAMPTZ` | - | `NOW()` | Timestamp |
| `updated_at` | `TIMESTAMPTZ` | - | `NOW()` | Timestamp |

#### 2. `public.bank_accounts`
Stores connected bank accounts, credit cards, and digital wallets.
| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | `uuid_generate_v4()` | Account ID |
| `user_id` | `UUID` | `REFERENCES public.users(id) ON DELETE CASCADE` | - | Owner user ID |
| `bank_name` | `TEXT` | `NOT NULL` | - | e.g. HDFC Bank, ICICI Bank, SBI, Axis |
| `account_type` | `TEXT` | `CHECK (IN ('savings', 'current', 'credit_card', 'wallet', 'investment'))` | - | Type of account |
| `account_number_last4`| `VARCHAR(8)` | `NOT NULL` | - | Last 4 digits |
| `current_balance` | `NUMERIC(14,2)` | - | `0.00` | Account balance |
| `credit_limit` | `NUMERIC(14,2)` | - | `0.00` | Credit limit (for credit cards) |
| `is_primary` | `BOOLEAN` | - | `FALSE` | Primary payment account flag |
| `color_hex` | `VARCHAR(10)` | - | `'#2F66F6'` | UI theme accent color |

#### 3. `public.transactions`
Financial transaction log containing metadata from OCR and SMS parsing.
| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | `uuid_generate_v4()` | Transaction ID |
| `user_id` | `UUID` | `REFERENCES public.users(id) ON DELETE CASCADE` | - | Owner user ID |
| `bank_account_id` | `UUID` | `REFERENCES public.bank_accounts(id) ON DELETE SET NULL` | `NULL` | Associated account |
| `type` | `TEXT` | `CHECK (IN ('expense', 'income', 'transfer', 'investment'))` | - | Movement direction |
| `amount` | `NUMERIC(14,2)` | `NOT NULL` | - | Value in INR |
| `category` | `TEXT` | `NOT NULL` | - | Category (e.g. Food & Dining) |
| `merchant_name` | `TEXT` | `NOT NULL` | - | Payee or Merchant |
| `description` | `TEXT` | - | `NULL` | Optional details |
| `date` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Transaction timestamp |
| `source` | `TEXT` | `CHECK (IN ('manual', 'receipt_scan', 'sms_parse', 'api_sync'))` | - | Origin method |
| `status` | `TEXT` | `CHECK (IN ('completed', 'pending', 'cancelled'))` | `'completed'` | Execution status |
| `receipt_image_url` | `TEXT` | - | `NULL` | Stored receipt scan link |
| `receipt_raw_text` | `TEXT` | - | `NULL` | Raw extracted OCR text |
| `receipt_tax_amount` | `NUMERIC(10,2)` | - | `NULL` | GST/Tax extracted |
| `receipt_confidence` | `NUMERIC(5,2)` | - | `NULL` | AI confidence score (e.g. 98.50) |
| `raw_sms_body` | `TEXT` | - | `NULL` | Original SMS text |
| `sms_sender_header` | `VARCHAR(20)` | - | `NULL` | Sender header (e.g. AD-HDFCBK) |
| `is_recurring` | `BOOLEAN` | - | `FALSE` | Subscription or recurring indicator |
| `is_tax_deductible` | `BOOLEAN` | - | `FALSE` | Tax deduction eligibility |

#### 4. `public.budgets`
Monthly spending caps per category.
| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | `uuid_generate_v4()` | Budget ID |
| `user_id` | `UUID` | `REFERENCES public.users(id) ON DELETE CASCADE` | - | Owner user ID |
| `category` | `TEXT` | `NOT NULL` | - | Spending category |
| `allocated_amount` | `NUMERIC(14,2)` | `NOT NULL` | - | Allocated monthly cap |
| `period` | `TEXT` | `CHECK (IN ('weekly', 'monthly', 'quarterly', 'yearly'))` | `'monthly'` | Recurrence period |
| `alert_threshold_percent` | `INT` | - | `80` | Warning alert trigger percentage |

#### 5. `public.goals`
Financial goals and SIP investment targets.
| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | `uuid_generate_v4()` | Goal ID |
| `user_id` | `UUID` | `REFERENCES public.users(id) ON DELETE CASCADE` | - | Owner user ID |
| `title` | `TEXT` | `NOT NULL` | - | Goal name (e.g. Emergency Fund) |
| `category` | `TEXT` | `CHECK (IN ('emergency_fund', 'investment', 'vacation', 'vehicle', 'real_estate', 'gadget', 'other'))` | - | Target classification |
| `target_amount` | `NUMERIC(14,2)` | `NOT NULL` | - | Target monetary amount |
| `current_amount` | `NUMERIC(14,2)` | - | `0.00` | Accumulated amount |
| `monthly_sip_contribution` | `NUMERIC(14,2)` | - | `0.00` | Planned monthly contribution |
| `target_date` | `DATE` | - | `NULL` | Completion target date |
| `expected_annual_return_pct` | `NUMERIC(5,2)` | - | `12.00` | Projected ROI percentage |

#### 6. `public.insights`
AI-generated financial coaching recommendations.
| Column | Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | `uuid_generate_v4()` | Insight ID |
| `user_id` | `UUID` | `REFERENCES public.users(id) ON DELETE CASCADE` | - | Target user ID |
| `title` | `TEXT` | `NOT NULL` | - | Recommendation headline |
| `description` | `TEXT` | `NOT NULL` | - | Deep financial advice |
| `category` | `TEXT` | `NOT NULL` | - | e.g. `subscription_alert`, `tax_saving` |
| `severity` | `TEXT` | `CHECK (IN ('tip', 'warning', 'opportunity', 'critical'))` | - | Importance rank |
| `potential_monthly_savings` | `NUMERIC(14,2)` | - | `0.00` | Savings potential |

---

### Row-Level Security (RLS) Policies

All tables explicitly enforce `ENABLE ROW LEVEL SECURITY`. RLS guarantees that authenticated users can only access and modify their own records.

```sql
-- Example RLS Policy for Transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);
```

### Database Triggers & Functions

#### `handle_new_user()`
Automatically creates a profile in `public.users` whenever a new user registers through Supabase Auth (`auth.users`).

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Supabase Edge Functions

Located in `/supabase/functions/`, these serverless Deno functions run close to users and use `GoogleGenAI` from `npm:@google/genai` with `gemini-3.6-flash`.

### 1. `parse-receipt` (Multimodal Vision OCR)
- **Path**: `supabase/functions/parse-receipt/index.ts`
- **Method**: `POST`
- **Request Headers**:
  ```http
  Content-Type: application/json
  Authorization: Bearer <SUPABASE_ANON_OR_SERVICE_KEY>
  ```
- **Request Body**:
  ```json
  {
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "mimeType": "image/jpeg"
  }
  ```
- **Response Schema** (`200 OK`):
  ```json
  {
    "merchant": "Swiggy / Instamart",
    "amount": 485.50,
    "date": "2026-09-18",
    "category": "Groceries",
    "taxAmount": 23.12,
    "confidenceScore": 97.8,
    "lineItems": [
      { "name": "Amul Toned Milk 1L", "quantity": 2, "price": 130.00 },
      { "name": "Organic Bananas 1kg", "quantity": 1, "price": 65.00 }
    ],
    "rawText": "Swiggy Instamart Order #849201 ..."
  }
  ```

---

### 2. `parse-sms` (Bank Transactional SMS NLP)
- **Path**: `supabase/functions/parse-sms/index.ts`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "smsText": "Rs 1,499.00 debited from HDFC Bank A/C **8912 on 18-SEP-26 to ZOMATO UPI. Avail Bal: Rs 45,210.00"
  }
  ```
- **Response Schema** (`200 OK`):
  ```json
  {
    "type": "debit",
    "amount": 1499.00,
    "merchant": "ZOMATO",
    "bankName": "HDFC Bank",
    "accountLast4": "8912",
    "date": "2026-09-18",
    "availableBalance": 45210.00,
    "category": "Food & Dining",
    "confidenceScore": 99.2,
    "isRecurring": false
  }
  ```

---

## Backend Express API Endpoints

The custom Node.js backend server (`/server.ts`) handles incoming web client requests on port `3000`.

### `POST /api/parse-receipt`
Processes image files uploaded by users to extract structured expense items.
- **Payload**:
  ```json
  {
    "imageBase64": "base64_string_here",
    "mimeType": "image/png"
  }
  ```
- **Response**: Extracted merchant, date, amount, taxes, confidence score, and items array.

---

### `POST /api/parse-sms`
Processes raw text from transactional SMS or WhatsApp alerts.
- **Payload**:
  ```json
  {
    "smsText": "Sent Rs. 350.00 to Chai Point via PhonePe from ICICI Bank A/C XXXX1042."
  }
  ```
- **Response**: Parsed transaction JSON containing amount, bank, category, and balance updates.

---

### `POST /api/generate-insights`
Analyzes recent user transaction histories, budget allocations, and savings goals to compute personalized AI recommendations.
- **Payload**:
  ```json
  {
    "transactions": [...],
    "budgets": [...],
    "goals": [...],
    "userProfile": { "monthly_income": 125000 }
  }
  ```
- **Response Schema**:
  ```json
  {
    "insights": [
      {
        "id": "ins_101",
        "title": "High Food Delivery Velocity",
        "description": "You spent ₹8,400 on Swiggy & Zomato this month, exceeding your Food budget by 18%.",
        "category": "dining_velocity",
        "severity": "warning",
        "potentialMonthlySavings": 3200
      }
    ],
    "forecast": {
      "projectedMonthEndExpenses": 68500,
      "savingsRatePercent": 45.2
    }
  }
  ```

---

### `GET /api/health`
Health check endpoint verifying server uptime and environment status.
- **Response**: `200 OK` -> `{"status": "ok", "timestamp": "2026-09-18T23:59:00Z"}`

---

## Gemini AI Interaction Flow

RupeeMind leverages **Gemini 3.6 Flash** via `@google/genai` for all AI capability layers.

### SDK & Model Configuration
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});
```

### Request & Response Sequence

```
[User Action: Upload Receipt / Paste SMS / Click Coach]
                        │
                        ▼
            [React Component State]
                        │
                        ▼
         [HTTP POST to Express / Edge Endpoint]
                        │
                        ▼
           [Construct System Prompt]
                        │
                        ▼
   [ai.models.generateContent({ model: 'gemini-3.6-flash' })]
                        │
                        ▼
      [Google Gemini AI Response Processing]
                        │
                        ▼
          [Parse Response JSON & Validate]
                        │
                        ▼
        [Save Record to Supabase PostgreSQL]
                        │
                        ▼
        [Update Zustand UI State Realtime]
```

### Structured JSON Schema Enforcement
To guarantee reliable parsing without markdown wrapping or syntax errors, all calls pass `responseMimeType: 'application/json'` in the generation config:

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: promptText,
  config: {
    responseMimeType: 'application/json',
  },
});

const parsedData = JSON.parse(response.text || '{}');
```

### Security & Key Management
- The `GEMINI_API_KEY` is maintained strictly as a **server-side secret environment variable**.
- It is **never** exposed to client browser bundles (`VITE_` prefix is strictly prohibited for secret keys).
- In Supabase Edge Functions, secrets are safely accessed via `Deno.env.get('GEMINI_API_KEY')`.
