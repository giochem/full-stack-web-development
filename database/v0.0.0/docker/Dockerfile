FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Abc@123123#1010
ENV MSSQL_PID=Express

# Install SQL Server tools and dos2unix
RUN apt-get update && apt-get install -y mssql-tools unixodbc-dev dos2unix

WORKDIR /var/opt/mssql/scripts

COPY script.sql .
COPY combined_data.sql .
COPY entrypoint.sh .

# Fix permissions and line endings
RUN dos2unix ./entrypoint.sh && \
    chmod +x ./entrypoint.sh && \
    chown mssql:mssql ./*

EXPOSE 1433

USER mssql

ENTRYPOINT ["/bin/bash", "/var/opt/mssql/scripts/entrypoint.sh"]
