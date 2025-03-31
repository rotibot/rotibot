#!/bin/bash
aws s3 sync ./dist s3://your-bucket-name --delete
