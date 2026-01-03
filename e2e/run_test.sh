#environment
env=$1


#cucumber tag
tag=$2


export COMMON_CONFIG_FILE=settings/settings.env
export NODE_ENV=$env

#run cucumber test & on failure run postcucumber
yarn run cucumber:$env --profile $tag || yarn run postcucumber