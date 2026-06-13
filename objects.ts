// give me an array of students with 5 fields and also an array of subjects with 3 fields

interface Subject {
  name: string;
  marks: number;
}

interface Student {
  id: number;
  name: string;
  age: number;
  grade: number;
  section: string;
  subjects: Subject[];
}

const students: Student[] = [
  {
    id: 1,
    name: "John",
    age: 15,
    grade: 10,
    section: "A",
    subjects: [
      {
        name: "Maths",
        marks: 80,
      },
      {
        name: "Science",
        marks: 90,
      },
      {
        name: "English",
        marks: 85,
      },
    ],
  },
  {
    id: 2,
    name: "Jane",
    age: 16,
    grade: 11,
    section: "B",
    subjects: [
      {
        name: "Maths",
        marks: 75,
      },
      {
        name: "Science",
        marks: 85,
      },
      {
        name: "English",
        marks: 80,
      },
    ],
  },
  {
    id: 3,
    name: "Bob",
    age: 14,
    grade: 9,
    section: "C",
    subjects: [
      {
        name: "Maths",
        marks: 70,
      },
      {
        name: "Science",
        marks: 80,
      },
      {
        name: "English",
        marks: 75,
      },
    ],
  },
];


