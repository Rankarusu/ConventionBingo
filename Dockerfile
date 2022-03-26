# STAGE 1: Install the node modules. 
# In a more sophisticated environment we would run the buildprocess as well.

FROM node as builder

COPY src /app
COPY package.json /app/
COPY package-lock.json /app/

WORKDIR /app

RUN npm install

# STAGE 2: Run nginx to serve the application

FROM nginx 

COPY --from=builder /app/ /usr/share/nginx/html/

EXPOSE 80