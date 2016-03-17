#!/bin/bash
last_val=`find $GOPATH/data -name '*.jpg' -a ! -name '*-*.jpg' | grep -P '\d+' -o | sort -nr | head -n1`

vals=`find $GOPATH/data -name '*.jpg' -a ! -name '*-*.jpg' | grep -P '\d+' -o | sort -n`

counter=0

for v in $vals
do
  counter=$((counter+1))

  #if ((counter < v)); then
  if [ "$counter" -lt "$v" ];then 
    break
  fi

done

next_val=$((last_val+1))
if [ "$counter" -lt "$last_val" ];then
  next_val=$counter
fi

echo `wget $1 -O $GOPATH/data/$next_val.jpg || rm -f $GOPATH/data/$next_val.jpg`
