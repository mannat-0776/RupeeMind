# RupeeMind REST API & Edge Function Specifications

RupeeMind features a high-throughput, microservice-inspired Express & Gemini server integration. All endpoints require standard JSON payloads or `multipart/form-data`.

---

## 1. Authentication & Headers

Client requests to protected endpoints should pass standard Supabase JWTs:
```http
Authorization: Bearer <supabase_jwt_token>
Content-Type: application/json
```

---

## 2. Endpoints Overview

| Method | Route | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health Check & System Status | None | `{ "status": "ok", "service": "RupeeMind" }` |
| `POST` | `/api/receipts/scan` | Gemini 2.5 Flash Vision OCR | Multipart Form (`image` file) | `ScanReceiptResponse` |
| `POST` | `/api/sms/parse` | Natural Language Bank SMS Parser | `{ "sms_text": string }` | `ParseSmsResponse` |
| `POST` | `/api/insights/generate` | Financial Intelligence & Suggestions | `{ "transactions": Transaction[], "budgets": Budget[] }` | `GenerateInsightsResponse` |

---

## 3. Detailed Request / Response Schemas

### `POST /api/receipts/scan`
Extracts line items, subtotal, GST / taxes, merchant details, category, and date from receipt images using Google Gemini 2.5 Flash Vision with structured JSON output schema.

#### Request (Multipart Form)
- `image`: Binary image file (`image/jpeg`, `image/png`, `image/webp`).

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "merchant": "Nature's Basket Supermarket",
    "amount": 3420.50,
    "category": "Food & Dining",
    "type": "expense",
    "date": "2026-03-16",
    "tax": 171.02,
    "confidence": 0.98,
    "items": [
      { "name": "Organic Almond Milk", "price": 420.00, "qty": 2 },
      { "name": "Himalayan Pink Salt", "price": 180.50, "qty": 1 },
      { "name": "Artisanal Sourdough", "price": 280.00, "qty": 1 }
    ]
  }
}
```

---

### `POST /api/sms/parse`
Parses raw debit/credit SMS strings from Indian financial institutions (HDFC, SBI, ICICI, Axis, Kotak, Paytm, UPI, CRED).

#### Request Body
```json
{
  "sms_text": "HDFC Bank: Rs.2,450.00 spent at ZOMATO BANGALORE on 14 Sep using Card XX5678. Avail Bal: Rs 48,210.00"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "amount": 2450.00,
    "merchant": "Zomato Bangalore",
    "category": "Food & Dining",
    "type": "expense",
    "date": "2026-09-14",
    "account_last4": "5678",
    "confidence": 0.99,
    "source": "sms"
  }
}
```

---

### `POST /api/insights/generate`
Generates personalized actionable financial advice, highlights high spending velocity categories, and calculates potential monthly SIP savings.

#### Response (`200 OK`)
```json
{
  "success": true,
  "insights": [
    {
      "id": "ins_9812",
      "category": "Food & Dining",
      "priority": "high",
      "message": "You spent 32% more on Food & Dining this week compared to last week.",
      "potential_savings": 2400,
      "action_text": "Adjust Meal Plan"
    }
  ]
}
```
