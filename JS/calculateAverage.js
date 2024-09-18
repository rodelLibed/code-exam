const student = {
  name: "John",
  age: 20,
  grades: [85, 90, 75, 95],
};

function calculateAverageGrade(student) {
  const grades = student.grades;
  console.log(grades);
  const sum = grades.reduce((acc, grade) => acc + grade, 0);

  const average = sum / grades.length;
  return parseFloat(average.toFixed(2));
}

console.log(calculateAverageGrade(student)); 
