FROM phusion/baseimage

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get upgrade -y

# Install nodejs
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs git

RUN npm install -g yarn
RUN npm install -g forever

RUN useradd --create-home --home /var/lib/gemtc gemtc

COPY . /var/lib/gemtc
RUN chown -R gemtc.gemtc /var/lib/gemtc

USER gemtc
WORKDIR /var/lib/gemtc
ENV HOME /var/lib/gemtc

RUN yarn
ARG WEBPACK_COMMAND
RUN if [ "$WEBPACK_COMMAND" != ""  ] ; then npm run $WEBPACK_COMMAND ; else npm run build-prod ; fi

EXPOSE 3001

CMD ["forever", "gemtc.js"]
