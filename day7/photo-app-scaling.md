# SnapShare Scaling Plan

## 1. Assumptions and Estimates

**Assumptions:**
- Total registered users: 10,000,000
- Daily Active Users (DAU): 10% of registered users = 1,000,000 DAU
- Each active user uploads 1 photo per day.
- Each active user views 50 feed pages per day.
- Average photo size: 2 MB.
- Average thumbnail size: 50 KB (0.05 MB).
- Seconds in a day: 24 * 60 * 60 = 86,400 seconds.

**Calculations:**
- **Uploads per second (average):** 1,000,000 uploads / 86,400 seconds ≈ **12 uploads/sec**.
- **Feed views per second (average):** (1,000,000 users * 50 views) / 86,400 seconds = 50,000,000 / 86,400 ≈ **579 views/sec**.
- **Feed views per second (peak, 5x average):** 579 * 5 ≈ **2,895 views/sec**.
- **Storage per year:** 
  - Daily photo storage: 1,000,000 * 2 MB = 2,000,000 MB = 2 TB.
  - Daily thumbnail storage: 1,000,000 * 0.05 MB = 50,000 MB = 50 GB.
  - Total daily storage: 2.05 TB.
  - Total yearly storage: 2.05 TB * 365 days ≈ **748 TB/year**.

## 2. Read-Heavy vs. Write-Heavy

SnapShare is a **read-heavy** system. Users view 50 feed pages a day but only upload 1 photo, meaning read traffic is 50 times higher than write traffic. This means the architecture must be heavily optimized for fast reads using caching, Content Delivery Networks (CDNs), and database read replicas, while the write path can tolerate slightly higher latency.

## 3. Photo Storage Strategy

Photos should **not** be stored inside the relational database because storing large binary files (BLOBs) bloats the database, slows down queries, makes backups expensive, and is hard to scale. Instead, photos and thumbnails should be stored in **Object Storage** (like AWS S3), and the database should only store the URL/link to the image.

## 4. Architecture Diagram

```text
       [ User / Mobile App ]
                |
                v
          [ CDN (CloudFront) ] <--- Caches images for fast global delivery
                |
                v
        [ Load Balancer (Nginx) ] <--- Distributes traffic evenly
                |
        +-------+-------+
        v               v
 [ App Server 1 ]  [ App Server 2 ] <--- Handles API logic
        |               |
        +-------+-------+
                |
        +-------+-------+-----------------------+
        v               v                       v
 [ Cache (Redis) ]  [ Message Queue ]    [ Object Storage (S3) ]
        |          (RabbitMQ/SQS)        (Stores photos & thumbs)
        v               |
 [ DB Read Replica ]    v
        |          [ Thumbnail Worker ]
        v               |
 [ DB Primary ] --------+ (Writes new thumbnail URL to DB)
 (Handles writes)
```
## 5. Component Explanations
CDN: Solves the problem of slow image loading for global users by caching static images at edge servers close to the user.
Load Balancer: Solves the problem of a single server crashing under heavy traffic by distributing incoming requests across multiple app servers.
App Servers: Solve the problem of processing user requests and running the application logic without blocking the database.
Cache (Redis): Solves the problem of slow database reads for the feed by storing frequently accessed data in fast memory.
Database Primary: Solves the problem of data consistency by being the single source of truth for all write operations (new users, new photos).
Database Read Replica: Solves the problem of the primary database getting overwhelmed by read queries by handling all the feed-viewing traffic.
Object Storage: Solves the problem of storing massive amounts of unstructured binary data (photos) cheaply and scalably.
Message Queue: Solves the problem of the user having to wait for a slow thumbnail generation process by queuing the job for later.
Thumbnail Worker: Solves the problem of generating different image sizes by processing queued jobs in the background without slowing down the main app.
## 6. Step-by-Step Upload Flow
The user selects a photo and clicks "Upload" in the app.
The request hits the CDN, which passes it to the Load Balancer.
The Load Balancer routes the request to an available App Server.
The App Server saves the original 2 MB photo directly to Object Storage and gets a URL back.
The App Server saves the photo metadata (URL, user ID, timestamp) to the Primary Database.
The App Server sends a message to the Message Queue containing the photo URL.
The App Server immediately returns a "Success" response to the user.
In the background, the Thumbnail Worker picks up the message from the queue.
The Worker downloads the image, creates the 50 KB thumbnail, and saves it to Object Storage.
The Worker updates the database record with the thumbnail URL.
## 7. Trade-offs
Consistency vs. Availability (CAP Theorem): By using a read replica, there is a slight delay (replication lag) between writing a new photo to the primary database and it appearing on the read replica. We trade immediate consistency for high availability and faster read speeds.
Cost vs. Performance (CDN): Using a CDN drastically improves performance and reduces load on our servers, but it adds a significant monthly financial cost for data transfer and edge caching.