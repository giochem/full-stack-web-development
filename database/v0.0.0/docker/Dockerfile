FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Abc@123123#1010
ENV MSSQL_PID=Express

# Install SQL Server tools
RUN apt-get update && apt-get install -y mssql-tools unixodbc-dev

WORKDIR /usr/src/app

COPY script.sql .
COPY combined_data.sql .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 1433

USER mssql

ENTRYPOINT ["./entrypoint.sh"]
