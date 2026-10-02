// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word) - returns notes whose text contains word (case-insensitive)
function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

// Test searchNotes
console.log(searchNotes("milk"));
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

console.log(searchNotes("xyz"));
// Expected: []

// 2. longestNote() - returns the note with the most characters, or null if empty
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, note) =>
    note.text.length > longest.text.length ? note : longest
  );
}

// Test longestNote
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

// Edge case: empty array
let originalNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = originalNotes; // restore

// 3. countByCategory() - returns object counting notes per category
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }
  return counts;
}

// Test countByCategory
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

// 4. getSummary() - returns a sentence like "5 notes: 2 personal, 1 work, 2 study."
function getSummary() {
  const counts = countByCategory();
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  const parts = Object.entries(counts).map(
    ([category, count]) => `${count} ${category}`
  );
  return `${total} ${noteWord}: ${parts.join(", ")}.`;
}

// Test getSummary
console.log(getSummary());
// Expected: "5 notes: 2 personal, 2 study, 1 work."

// 5. isDuplicate(text) - returns true if note with same text exists (ignoring case and extra spaces)
function isDuplicate(text) {
  const normalized = text.trim().toLowerCase();
  return notes.some(note => note.text.trim().toLowerCase() === normalized);
}

// Test isDuplicate
console.log(isDuplicate("Buy milk and bread"));
// Expected: true

console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true (ignores case and extra spaces)

console.log(isDuplicate("New unique note"));
// Expected: false

// 6. addNote(text, category) - adds note only if valid; returns true/false
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];

  if (text.length < 1 || text.length > 200) {
    console.log("Failed: text must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Failed: a note with this text already exists.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Failed: category must be personal, work, or study.");
    return false;
  }

  const newId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: text, category: category });
  console.log("Note added successfully.");
  return true;
}

// Test addNote - normal case
console.log(addNote("Read chapter 5", "study"));
// Expected: true (note added)

// Test addNote - duplicate
console.log(addNote("Buy milk and bread", "personal"));
// Expected: false (duplicate)

// Test addNote - invalid category
console.log(addNote("New task", "invalid"));
// Expected: false (invalid category)

// Test addNote - empty text
console.log(addNote("", "work"));
// Expected: false (text too short)

// Show final state of notes
console.log(notes);