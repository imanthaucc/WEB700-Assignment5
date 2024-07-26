const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        const foundStudent = dataCollection.students.find(student => student.studentNum == num);

        if (!foundStudent) {
            reject("Query returned 0 results");
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        const filteredStudents = dataCollection.students.filter(student => student.course === course);

        if (filteredStudents.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find(course => course.courseId === id);
        if (course) {
            resolve(course);
        } else {
            reject("Query returned 0 results");
        }
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Set TA to false if undefined, true otherwise
        studentData.TA = studentData.TA === 'on' ? true : false;

        // Set studentNum to the length of dataCollection.students + 1
        studentData.studentNum = dataCollection.students.length + 1;

        // Push new studentData to dataCollection.students array
        dataCollection.students.push(studentData);

        // Write updated data to students.json file
        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), (err) => {
            if (err) {
                reject("Error writing to students file");
                return;
            }
            resolve();
        });
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Find the index of the student to update
        const index = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);
        
        if (index === -1) {
            reject("Student not found");
            return;
        }

        // Update the student data
        dataCollection.students[index] = {
            ...dataCollection.students[index],
            ...studentData,
            TA: studentData.TA === 'on' ? true : false // Handle checkbox input
        };

        // Write the updated data back to students.json file
        fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students, null, 2), (err) => {
            if (err) {
                reject("Error writing to students file");
                return;
            }
            resolve();
        });
    });
};
