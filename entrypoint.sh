#!/bin/bash
set -e

case "$1" in
    develop)
        echo "Running Development Server"
        rake db:exists RAILS_ENV=development
        exec bundle exec rails server -b 0.0.0.0

        ;;

    test)
        echo "Running Test"
        bundle exec rake db:exists RAILS_ENV=test

        exec rspec
        ;;

    start)
        echo "Running Start"
        bundle exec rake db:exists

        exec bundle exec puma -C config/puma.rb
        ;;
    *)
        exec "$@"
esac
