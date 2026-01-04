@echo off

@REM environment (localhost / production)
set "env=%~1"

@REM cucumber tag
set "tag=%~2"

@REM config
set "COMMON_CONFIG_FILE=settings/settings.env"
set "NODE_ENV=%env%"

@REM DEBUG (remove later if you want)
echo [BATCH] env=%env%
echo [BATCH] NODE_ENV=%NODE_ENV%
echo [BATCH] tag=%tag%

@REM run cucumber
npm run cucumber:%env% -- --tags "@%tag%"