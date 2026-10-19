# School Database Design

## Table Explanations
- **students**: Stores basic information about each student, including a unique identifier (`student_id`), their first and last name, and a unique email address to ensure no duplicate accounts.
- **courses**: Stores information about available courses, including a unique identifier (`course_id`), the course name, and the number of credits.
- **enrolments**: A join table that records which student is taking which course, along with the grade they received for that specific pairing.

## Relationships
- The relationship between **students** and **enrolments** is **one-to-many** (one student can have many enrolment records).
- The relationship between **courses** and **enrolments** is **one-to-many** (one course can have many enrolment records).
- The relationship between **students** and **courses** is **many-to-many**. A student can take multiple courses, and a course can have multiple students. A join table (`enrolments`) is strictly needed to resolve this many-to-many relationship into two one-to-many relationships. This also allows us to store additional data specific to the relationship itself, such as the `grade`.

## Recommended Index
I would add an index on the `student_id` column in the `enrolments` table:
```sql
CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);
Reason: Querying a specific student's courses (their transcript) is a very common operation in a school system. An index on this foreign key will significantly speed up JOIN operations when fetching a student's records, especially as the number of enrolments grows into the thousands.
SQL vs NoSQL Choice
I would choose SQL for this system. A school database requires strict data integrity, highly structured relationships, and complex queries (like joining students, courses, and grades, or calculating class averages). SQL databases enforce schema rules (like foreign keys, NOT NULL, and unique constraints), which prevents orphaned records (e.g., an enrolment for a deleted student) and ensures data consistency. NoSQL is better suited for unstructured data or massive scale where relationships are less rigid, which does not align with the highly structured, relational nature of academic records.