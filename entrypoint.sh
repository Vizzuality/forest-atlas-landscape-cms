#!/bin/bash
set -e

case "$1" in
    develop)
        echo "Running Development Server"
        exec rake db:exists RAILS_ENV=development
        exec bundle exec rails server -b 0.0.0.0

        ;;

    start)
        echo "Running Start"
        bundle exec rake db:exists

        exec bundle exec puma -C config/puma.rb
        ;;
    *)
        exec "$@"
esac
