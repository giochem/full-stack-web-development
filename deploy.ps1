param (
    [string]$action
)

switch ($action) {
    "up" {
        Write-Host "Starting Docker environment..." -ForegroundColor Green
        docker-compose up --build
    }
    "down" {
        Write-Host "Stopping and cleaning Docker environment..." -ForegroundColor Yellow
        docker-compose down --volumes --rmi all --remove-orphans
    }
    default {
        Write-Host "Invalid action. Use 'up' or 'down'." -ForegroundColor Red
    }
}