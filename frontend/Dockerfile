FROM node:12.14.1-stretch-slim

ARG FRONTEND_DOCUMENT_ROOT=/app-frontend

RUN apt-get update && apt-get upgrade -y && apt-get dist-upgrade -y && \
    apt-get install -y nano \
    wget \
    git \
    zip

WORKDIR ${FRONTEND_DOCUMENT_ROOT}

COPY . ${FRONTEND_DOCUMENT_ROOT}

RUN npm install

EXPOSE 3000

# start apache
CMD ["npm", "run", "start"]



