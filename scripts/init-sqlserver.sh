#!/bin/bash

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 15

# Create the TaskServiceDb database if it doesn't exist
echo "Creating TaskServiceDb database..."
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P Password_123 -C -Q "
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TaskServiceDb')
BEGIN
    CREATE DATABASE TaskServiceDb;
    PRINT 'TaskServiceDb created successfully.';
END
ELSE
BEGIN
    PRINT 'TaskServiceDb already exists.';
END
"

echo "Database initialization complete."
