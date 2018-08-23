FROM ruby:2.3.1
MAINTAINER Raul Requero <raul.requero@vizzuality.com>

ENV NAME forest-atlas-landscape-cms

# Install dependencies
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -qq -y build-essential nodejs yarn \
    libpq-dev \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
RUN mkdir -p /usr/src/$NAME
WORKDIR /usr/src/$NAME

# Install app dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle install --jobs 20 --retry 5 --without development test

# Install node dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

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
