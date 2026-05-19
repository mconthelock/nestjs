FROM oraclelinux:8-slim

WORKDIR /app


# ติดตั้ง dnf ก่อน
RUN microdnf -y install dnf

# install node20
RUN dnf module disable -y nodejs && \
    dnf module enable -y nodejs:20 && \
    dnf install -y nodejs npm

# install build tools + odbc
RUN dnf install -y \
    python3 \
    gcc \
    gcc-c++ \
    make \
    unzip \
    unixODBC \
    unixODBC-devel \
    libtool-ltdl

COPY package*.json ./

COPY oracle/instantclient-basic-linux.x64-23.26.2.0.0.zip /tmp/instantclient.zip

RUN mkdir -p /opt/oracle && \
    unzip /tmp/instantclient.zip -d /opt/oracle && \
    rm -f /tmp/instantclient.zip

# TNS
COPY oracle/tns /etc/tns

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_26
ENV TNS_ADMIN=/etc/tns

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3010

CMD ["node", "dist/src/main.js"]