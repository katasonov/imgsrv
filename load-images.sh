#!/bin/bash
while IFS='' read -r line || [[ -n "$line" ]]; do
    `sh load-img.sh $line`
done < "$1"
