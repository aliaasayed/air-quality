#!/bin/bash
# set -x
# set -e

function install() {
    echo '========= Starting Install ========='

    # install npm packages
    sudo npm i

    # install redis server
    sudo apt-get install redis-server
    
    # Hosts Manager Go Cli
    redis-server
    
}

function start() {
    echo '========= starting Server ========='

    # Run migration
    npm run migration:dev
    
    # Start program
    npm run start:dev
    
}

if [ -z $@ ]; then
    echo "Please use on of these functions as parameter "
fi

$@