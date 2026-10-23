# TicketHub System Design

## 1. Requirements
**Functional Requirements:**
- Users can browse upcoming events.
- Users can view available seats for a specific event.
- Users can hold a seat temporarily while checking out.
- Users can pay for and confirm an order.
- Users can view their purchased tickets.

**Non-Functional Requirements:**
- **Speed:** Pages must load in under 200ms.
- **Correctness:** No double-booking (two people cannot buy the same seat).
- **Fairness:** During high demand, seats should be allocated on a first-come, first-served basis.
- **Availability:** The system must remain online even during massive traffic spikes.

## 2. Traffic Estimates
**Normal Day:**
- 50,000 visitors * 10 pages/visit = 500,000 page views/day.
- 500,000 / 86,400 seconds ≈ **6 requests per second**.
- 5,000 tickets sold / 86,400 seconds ≈ **0.06 tickets per second**.

**Big Sale Peak (Popular Concert):**
- 200,000 people trying to buy in 10 minutes (600 seconds).
- 200,000 / 600 ≈ **333 active users per second**.
- If each user refreshes or clicks 5 times, that is **~1,600 requests per second**.
- *Comparison:* The big sale generates roughly 250x more traffic than a normal day.

## 3. API Design
| Method | Path | Description |
|--------|------|-------------|
| GET | `/events` | List all upcoming events. |
| GET | `/events/{id}/seats` | View the seat map for a specific event. |
| POST | `/orders/hold` | Temporarily hold a seat (expires in 10 mins). |
| POST | `/orders/checkout` | Process payment and confirm the held seat. |
| GET | `/users/{id}/tickets` | View all tickets purchased by a user. |

## 4. Data Model & Double-Booking Prevention
**Tables:**
1. **users**: `id` (PK), `name`, `email`.
2. **events**: `id` (PK), `name`, `date`, `venue_id`.
3. **seats**: `id` (PK), `event_id` (FK), `row`, `number`, `price`, `status` (available/held/sold).
4. **orders**: `id` (PK), `user_id` (FK), `seat_id` (FK), `status`, `created_at`.

**Preventing Double-Booking:**
To ensure two people don't buy the same seat, we use **Database Transactions with Row-Level Locking**. When a user clicks "Buy", the database runs a transaction:
`SELECT * FROM seats WHERE id = 123 AND status = 'available' FOR UPDATE;`
The `FOR UPDATE` clause locks that specific row. If another user tries to buy seat 123 at the exact same millisecond, they must wait until the first transaction finishes. If the first user succeeds, the status changes to 'held', and the second user's transaction will find the seat is no longer 'available' and will fail gracefully.

## 5. Architecture Diagram
```text
[Client App] --> [CDN] --> [Load Balancer]
                               |
                     +---------+---------+
                     |                   |
              [App Server 1]      [App Server 2]
                     |                   |
               [Redis Cache]       [Message Queue]
                     |                   |
         +-----------+-----------+       |
         |                       |       v
  [DB Read Replica]      [DB Primary]  [Payment Worker]
  Component Explanations:
CDN: Serves static images (event posters) quickly to users globally.
Load Balancer: Distributes the 1,600 req/sec traffic across multiple app servers so none crash.
App Servers: Handle the logic for browsing and holding seats.
Redis Cache: Stores the seat map in memory. Checking if a seat is available in Redis is much faster than querying the database.
DB Primary: The only place where orders and seat statuses are written to ensure strict consistency.
DB Read Replica: Handles the heavy load of users just browsing events (reading data).
Message Queue: Handles payment processing in the background so the user doesn't have to wait for the bank to respond.
6. Trade-offs
Consistency vs. Performance (Caching): We cache seat availability in Redis for speed. However, there is a risk that Redis shows a seat as available when it was just sold in the database. We accept this minor risk because checking the database for every single page load would crash the system during a big sale.
Holding Seats vs. Inventory Lockup: We allow users to "hold" a seat for 10 minutes during checkout. This ensures fairness (they have time to enter credit card info), but it locks up inventory. If they don't pay, that seat is unavailable to others for 10 minutes. We mitigate this by strictly enforcing the 10-minute expiration.