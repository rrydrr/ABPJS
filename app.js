const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

app.use(express.json());

// Initialize Sequelize
const sequelize = new Sequelize('abp', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

// Define the User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users'
});

// Define the Student model
const Student = sequelize.define('Student', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    grade: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'students'
});

// Define the Teacher model
const Teacher = sequelize.define('Teacher', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'teachers'
});

// Sync the model with the database
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Error syncing the database:', err);
    });

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Add the new user
        await User.create({ username, password });
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error handling the request:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            return res.status(200).json({ message: 'Login successful' });
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error handling the request:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/logout', async (req, res) => {
    return res.status(200).json({ message: 'Logout Successful'})
});

// Create a new student
app.post('/students', async (req, res) => {
    const { name, age, grade , semester } = req.body;

    try {
        const student = await Student.create({ name, age, grade , semester});
        res.status(201).json({ message: 'Student created successfully', student });
    } catch (err) {
        console.error('Error creating student:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.findAll();
        res.status(200).json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single student by ID
app.get('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByPk(id);
        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, grade } = req.body;

    try {
        const student = await Student.findByPk(id);
        if (student) {
            student.name = name;
            student.age = age;
            student.grade = grade;
            await student.save();
            res.status(200).json({ message: 'Student updated successfully', student });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findByPk(id);
        if (student) {
            await student.destroy();
            res.status(200).json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new teacher
app.post('/teachers', async (req, res) => {
    const { name, age } = req.body;

    try {
        const teacher = await Teacher.create({ name, age });
        res.status(201).json({ message: 'Teacher created successfully', teacher });
    } catch (err) {
        console.error('Error creating teacher:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all teachers
app.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        res.status(200).json(teachers);
    } catch (err) {
        console.error('Error fetching teachers:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single teacher by ID
app.get('/teachers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findByPk(id);
        if (teacher) {
            res.status(200).json(teacher);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (err) {
        console.error('Error fetching teacher:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a teacher by ID
app.put('/teachers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;

    try {
        const teacher = await Teacher.findByPk(id);
        if (teacher) {
            teacher.name = name;
            teacher.age = age;
            await teacher.save();
            res.status(200).json({ message: 'Teacher updated successfully', teacher });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (err) {
        console.error('Error updating teacher:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a teacher by ID
app.delete('/teachers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findByPk(id);
        if (teacher) {
            await teacher.destroy();
            res.status(200).json({ message: 'Teacher deleted successfully' });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (err) {
        console.error('Error deleting teacher:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
