const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = process.env.port || 4000;
const { v4: uuidv4 } = require('uuid');

const countries_list = require('./countries_list.json');

// CORS Middleware (Middleware = Processing Step when a request is done)
app.use(cors({
    origin: 'https://addictive-media-frontend.herokuapp.com'
}));

const sequelize = new Sequelize('sql12553289', 'sql12553289', 'TESwRd1LCA', {
    dialect: 'mysql',
    host: 'sql12.freemysqlhosting.net',
    port: 3306
});

const UserDetails = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const cols = ['id', 'name', 'dob', 'country', 'resume'];

app.get('/add-credentials', async (req, res) => {
    try {
        await sequelize.authenticate();

        await UserDetails.create({
            ...req.query,
            id: uuidv4(),
            createdAt: new Date().toJSON(),
            updatedAt: new Date().toJSON()
        }, {
            fields: cols
        });

        res.send('Added!');
    } catch (error) {
        console.error('Unable to add to the database:', error);
        res.send(404);
    }
});

app.get('/delete-user', async (req, res) => {
    try {
        await sequelize.authenticate();

        const { id } = req.query;

        await UserDetails.destroy({ where: { id } });

        res.send('Added!');
    } catch (error) {
        console.error('Unable to delete user from the database:', error);
        res.send(404);
    }
});

app.get('/get-users', async (req, res) => {
    try {
        await sequelize.authenticate();

        const list = await UserDetails.findAll({ attributes: cols });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(list));
    } catch (error) {
        console.error('Unable to get user from the database:', error);
        res.send(404);
    }
});

app.get('/countries-list', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(countries_list));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});