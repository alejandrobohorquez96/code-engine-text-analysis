"use strict";
const myCOS = require('ibm-cos-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({
  silent: true
});


const cors = require("cors");
app.use(cors());

var config = {
    endpoint: 's3.us-south.cloud-object-storage.appdomain.cloud',
    apiKeyId: '<API_KEY>',
    ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
    serviceInstanceId: '<RESOURCE_INSTANCE_ID>'
};

var cosClient = new myCOS.S3(config);
const port = 3001;

var upload = multer({
  storage: multerS3({
    s3: cosClient,
    bucket: '<BUCKET_NAME>',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
});
/*
 * Default route for the web app
 */
app.get('/', function(req, res) {
    res.send("Hello World! from backend");
});
/*
 * Upload an image for object detection
 */
app.post('/upload', upload.array('files', 3), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
})

app.listen(port, () => console.log(`App listening on port ${port}!`));
