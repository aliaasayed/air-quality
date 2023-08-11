#!/bin/bash
# set -x
# set -e

function install() {
    echo '========= Starting Install ========='

    # install npm packages
    npm i
    
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