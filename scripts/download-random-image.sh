#!/usr/bin/env bash

# specify the output file name as the first argument to the script
# e.g., ./download-random-image.sh cli-arguments-nodejs.png
if [ -z "$1" ]; then
  echo "Usage: $0 <output-file-name>"
  exit 1
fi

curl -L "https://picsum.photos/640/420?random=1" --output "$1"
mv "$1" ../src/assets/images/blog/$1