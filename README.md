# Forest Atlas and Landscape Application CMS

[![Build Status](https://travis-ci.org/Vizzuality/forest-atlas-landscape-cms.svg?branch=master)](https://travis-ci.org/Vizzuality/forest-atlas-landscape-cms)

Multisite content management system for forest atlas and landscape applications

## Dependencies

Ruby 2.3.1
nodejs + npm

## Installation

Install global dependencies:

    gem install bundler

Install project dependencies:

    bundle install
    npm install

Set up environment variables by copying `.env.sample` to `.env` and filling up the necessary values accordingly

To set up the database, run:

    bundle exec rake db:create
    bundle exec rake db:migrate
    bundle exec rake db:seed

If you are on a development environment, you might also want to load some sample data:

    bundle exec rake db:sample

## Running

To run application:

    bundle exec rails server
