# Forest Atlas and Landscape Application CMS

![](sample-screenshot.png)


Multisite content management system for Forest Atlas and Landscape Applications

## CI status

[![Build Status](https://travis-ci.org/Vizzuality/forest-atlas-landscape-cms.svg?branch=master)](https://travis-ci.org/Vizzuality/forest-atlas-landscape-cms)

## Dependencies

Ruby 2.3.1
nodejs 8.x

### Enviroment variables

Set up environment variables by copying `.env.sample` to `.env` and filling up the necessary values accordingly

## Installation

### With Docker (Recommended)

Run this command to setup your docker machine `docker-compose -f docker-compose.dev.yml up web`

#### Create database

```
docker-compose -f docker-compose.dev.yml run web rake db:create
docker-compose -f docker-compose.dev.yml run web rake db:migrate
docker-compose -f docker-compose.dev.yml run web rake db:seed
```

Add some fake data: `docker-compose -f docker-compose.dev.yml run web rake db:sample`

#### Running

you open a terminal (if you have mac or windows, open a terminal with the 'Docker Quickstart Terminal') and execute the next command:
 ```bash
    ./service.sh develop
 ```

### Without Docker

Install global dependencies: `gem install bundler`

Install project dependencies: `bundle install && yarn install`

Before setting up the database, you need to create a postgres user, install homebrew then, run:

    ```bash
    brew install postgres
    initdb /usr/local/var/postgres
    /usr/local/Cellar/postgresql/<version>/bin/createuser -s postgres
    ```

Then to set up the database, run:

    ```bash
    bundle exec rake db:create
    bundle exec rake db:migrate
    bundle exec rake db:seed
    ```

If you're running a previous version of the application site settings, run: `bundle exec rake db:site_settings:update`

If you are on a development environment, you might also want to load some sample data:

    bundle exec rake db:sample db:site_settings:update db:site_templates:update

While not required, it's highly recommended that you use the included git hooks.

    ./bin/git/init-hooks

You only have to do this once. Future changes to hooks will be loaded automatically.

To run application run: `bundle exec rails server`

## Development

### Front-end Architecture

The application is built with react, [react rails](https://github.com/reactjs/react-rails) & Redux.

This is the core folder structure for the front-end app

Anything you add inside the **containers** folder, will be available in the rails templates.

```
- containers
 Public.js
 Admin.js
 Map.js
- pages (any page)
- shared (shared or common components)
- store (redux store)
- utils (any utility file)
```

Any component you write will have this structure to keep it consistant. If you dont need state, use stateless components and ignore the "*" optional files.

```
- folder (component name)
  index.js (container, Or statless component)
  {component-name}.component.js
  *store.js
  *dispatcher.js
```

To render your page, you have **react_component** available inside the rails template files.

```
<%= react_component('Container', {...any gon properties you need to pass here} ) %>
```

Please only use **page containers** when rendering your components inside the rails templates so we keep the logic consistant.

### Code Quality

To keep a good and consistent quality code we use `eslint` (JS) and `sass-lint` (CSS).

`eslint` rules are based on the Airbnb & [vizzuality](https://github.com/vizzuality/eslint-config-vizzuality) ones.
`sass-lint` rules are based on [SMACSS](https://github.com/brigade/scss-lint/blob/master/data/property-sort-orders/smacss.txt) ones.

### Common issues

1. `React.createElement: type is invalid -- expected a string or a class/function but got: undefined`
    *  you are most probably running the wrong version of some package. To solve this, you need to flush your files and clear yarn cashe by running this command: `rm yarn.lock && rm -rf node_modules && yarn cache clean && yarn install`.


Have fun coding! 😁🌲

## Deployment

We use [Capistrano](http://capistranorb.com/) as a deploy tool. To deploy to production, simply run:

    cap production deploy

What needs doing as well is (in server):
`RAILS_ENV=production bundle exec rake site:create_assets`

## Server Setup

### Cronjob

Add a cronjob to delete the old sessions from the database.
This can be accomplish by setting the cronjob like this:

    0 5 * * * cd /path/to/app/dir/ && rake RAILS_ENV=production sessions:trim > /dev/null 2>&1

This will run at 5 AM every day and delete the old sessions.

### Environment variables description

#### API_URL

URL of the API gateway. Used for user authentication.

#### GLOBAL_GA_KEY

Key for Google Analytics. Used on all sites. For site-specific GA integration, use the admin interface.

#### Usefull links

Map builder - https://github.com/wri/gfw-mapbuilder
React rails - https://github.com/reactjs/react-rails
webpacker - https://github.com/rails/webpacker