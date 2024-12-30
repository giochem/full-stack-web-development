#!/bin/bash

# Start SQL Server
/opt/mssql/bin/sqlservr &

# Function to check if SQL Server is ready
is_sql_server_ready() {
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -Q "SELECT 1" &> /dev/null
    return $?
}

# Wait for SQL Server to be ready
echo "Waiting for SQL Server to be ready..."
while ! is_sql_server_ready
do
    sleep 5
done
echo "SQL Server is ready."

# Run the initialization script
echo "Running initialization script..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -i script.sql

# Run the data insertion script for CLOTHES369 database
echo "Running data insertion script for CLOTHES369 database..."
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -d CLOTHES369 -i combined_data.sql

echo "Database setup complete."

# Keep container running
tail -f /dev/null
