#!/usr/bin/env bash
if [ "$#" -eq 0 ]; then
    npm run build
fi
if [ "$#" -eq 1 ]; then
    if [ "$1" = "css" ]; then
        npm run build-css
    fi
    if [ "$1" = "js" ]; then
        npm run build-js
    fi
fi