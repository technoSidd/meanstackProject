//run command "npm run dev" instead of node server
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import isuueTB from './models/Issue';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issuesDB');

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully.');
});

router.route('/issues').get((req, res) => {
    isuueTB.find((err, issues) => {
        if(!err) {
            res.json(issues);
        } else {
            console.log(err);
        }
    });
});

router.route('/issues/:id').get((req, res) => {
    isuueTB.findById(req.params.id, (err, issue) => {
        if(!err) {
            res.json(issue);
        } else {
            console.log(err);
        }
    });
});

router.route('/issues/add').post((req, res) => {
    const issue = new isuueTB(req.body);
    issue.save().then(issue => {
        res.status(200).json({'issue': 'Added successfully'});
    }).catch(err => {
        res.status(400).send('Failed to create new record');
    });
});

router.route('/issues/update/:id').post((req, res) => {
    isuueTB.findById(req.params.id, (err, issue) => {
        if(!issue) {
            return next(new Error('Could not load document'));
        } else {
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/issues/delete/:id').get((req, res) => {
    isuueTB.findByIdAndRemove({_id: req.params.id}, (err, issue) => {
        if(err) {
            res.json(err);
        } else {
            res.json('Remove successfully');
        }
    });
});

app.use('/', router);

app.listen(4000, () => console.log('Express server is running on port 4000'));