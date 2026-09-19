# RupeeMind End-to-End Sequence Diagrams

This document illustrates the execution lifecycle for the three primary workflows in RupeeMind.

---

## 1. Multimodal Receipt OCR Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as RupeeMind UI (Scan Modal)
    participant Server as Express Server (/api/receipts/scan)
    participant Gemini as Google Gemini 2.5 Flash API
    participant Store as Zustand Finance Store

    User->>UI: Selects or Drag-and-drops Receipt Image
    UI->>UI: Renders live image preview & validates MIME type
    User->>UI: Clicks "Scan with Gemini AI"
    UI->>Server: POST /api/receipts/scan (Multipart Form Data)
    Server->>Server: Reads Buffer & encodes to Base64
    Server->>Gemini: generateContent({ contents: [imagePart, systemPrompt], responseSchema: TransactionSchema })
    Gemini-->>Server: Structured JSON (Merchant, Amount, Category, Items, Tax)
    Server-->>UI: 200 OK with Parsed Transaction Object
    UI->>UI: Displays editable verification form (Merchant, Amount, Category)
    User->>UI: Confirms & clicks "Save Transaction"
    UI->>Store: addTransaction(parsedData)
    Store->>Store: Recalculates Budget Velocity & Goal Progress
    UI-->>User: Displays success toast & updates Dashboard
```

---

## 2. Bank SMS Natural Language Parsing

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as RupeeMind UI (SMS Modal)
    participant Server as Express Server (/api/sms/parse)
    participant Gemini as Google Gemini 2.5 Flash API
    participant Store as Zustand Finance Store

    User->>UI: Pastes Bank SMS snippet or selects template
    User->>UI: Clicks "Parse SMS"
    UI->>Server: POST /api/sms/parse { sms_text: string }
    Server->>Gemini: generateContent({ prompt: NLP Prompt, text: sms_text })
    Gemini-->>Server: Extracted JSON (Amount, Type, Merchant, Account Last 4, Category)
    Server-->>UI: 200 OK with Parsed Transaction
    UI->>UI: Displays verified card with confidence score
    User->>UI: Clicks "Add to Expenses"
    UI->>Store: addTransaction(parsedData)
    Store->>Store: Updates active state & recalculates totals
    UI-->>User: Instant reflection in transaction feed
```

---

## 3. Offline Transaction Caching & Reconnection Sync

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant UI as RupeeMind UI
    participant Store as Zustand Store
    participant Sync as OfflineSyncService
    participant Net as Network Listener
    participant Cloud as Remote Backend / Supabase

    Note over Net: Network goes OFFLINE (navigator.onLine = false)
    Net->>UI: Triggers "You are offline" notification banner
    User->>UI: Creates new manual transaction (₹450 Chai)
    UI->>Store: addTransaction(tx) [Optimistic Local Apply]
    Store->>Sync: enqueue('create', tx)
    Sync->>Sync: Stores action in localStorage['rupeemind_offline_sync_queue']
    UI-->>User: Displays transaction instantly with "Pending Sync" badge

    Note over Net: Network RESTORED (window.addEventListener('online'))
    Net->>Sync: Triggers processQueue()
    Sync->>Cloud: POST /api/transactions (Batch replay)
    Cloud-->>Sync: 200 OK Confirmation
    Sync->>Sync: Clears synced items from queue
    Sync->>UI: Dispatches queue cleared event
    UI-->>User: Displays "All offline transactions synced!" banner
```
