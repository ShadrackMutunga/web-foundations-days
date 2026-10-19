# School Database Design

## Table Explanations
- **students**: Stores basic information about each student, including a unique identifier, their name, and a unique email address to ensure no duplicate accounts.
- **courses**: Stores information about available courses, including a unique identifier, the course name, and the number of credits.
- **enrolments**: A join table that records which student is taking which course, along with the grade they received for that specific course.

## Relationships
- The relationship between **students** and **enrolments** is **one-to-many** (one student can have many enrolment records).
- The relationship between **courses** and **enrolments** is **one-to-many** (one course can have many enrolment records).
- The relationship between **students** and **courses** is **many-to-many**. A student can take multiple courses, and a course can have multiple students. A join table (`enrolments`) is required to resolve this many-to-many relationship into two one-to-many relationships. This also allows us to store additional data specific to the relationship itself, such as the `grade`.

## Recommended Index
I would add an index on the `student_id` column in the `enrolments` table:
```sql
CREATE INDEX idx_enrolments_student_id ON enrolments(student_id);