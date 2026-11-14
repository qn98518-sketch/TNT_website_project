@echo off
cd /d "%~dp0"
node scripts/cms-local-postgres.cjs start
pause
