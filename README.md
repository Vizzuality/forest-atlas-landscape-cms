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

While not required, it's highly recommended that you use the included git hooks. 

    ./bin/git/init-hooks
    
You only have to do this once. Future changes to hooks will be loaded automatically.

## Running

To run application:

    bundle exec rails server

## Development

### Code Quality

To keep a good and consistent quality code we use `eslint` (JS) and `sass-lint` (CSS).

`eslint` rules are based on [Airbnb](http://airbnb.io/javascript/) ones.

`sass-lint` rules are based on [SMACSS](https://github.com/brigade/scss-lint/blob/master/data/property-sort-orders/smacss.txt) ones.

Also we have some custom rules you can check in `.eslintrc` and `.sass-lint`, respectively.

Have fun coding! 😁🌲


