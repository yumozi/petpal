#!/usr/bin/env bash

set -o errexit  # exit on error
pip install --upgrade pip
pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py makemigrations blogs
python manage.py makemigrations likes
python manage.py migrate