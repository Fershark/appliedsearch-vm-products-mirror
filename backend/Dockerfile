FROM node:12.14.1-stretch-slim

ARG BACKEND_DOCUMENT_ROOT=/app-backend

RUN apt-get update && apt-get upgrade -y && apt-get dist-upgrade -y && \
    apt-get install -y nano \
    wget \
    git \
    zip

WORKDIR ${BACKEND_DOCUMENT_ROOT}

COPY . .

RUN npm install

EXPOSE 5000

# start apache
CMD ["npm", "run", "start"]



