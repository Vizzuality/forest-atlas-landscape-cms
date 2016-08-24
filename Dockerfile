FROM ruby:2.3.1
MAINTAINER Raul Requero <raul.requero@vizzuality.com>

ENV NAME forest-atlas-landscape-cms

# Install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install -y nodejs

# Create app directory
RUN mkdir -p /usr/src/$NAME
WORKDIR /usr/src/$NAME

# Install app dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 20 --retry 5 --without development test

# Set Rails to run in production
ENV RAILS_ENV production
ENV RACK_ENV production

# Bundle app source
COPY . ./

# Precompile
RUN bundle exec rake assets:precompile

EXPOSE 4000

# Start puma
ENTRYPOINT ["./entrypoint.sh"]
