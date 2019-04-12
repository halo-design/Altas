#!/bin/sh

if [ -z "$GH_TOKEN" ]; then
    echo "You must set the GH_TOKEN environment variable."
    read -p "请输入Github Token:" token
    export GH_TOKEN="token"
fi
    echo "You have already set the GH_TOKEN environment variable."