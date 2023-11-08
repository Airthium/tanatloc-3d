#!/bin/sh

set -e

# Install
yarn

# Depcheck
yarn depcheck

# Prettier
yarn prettier

# Test
yarn test

# Build
yarn build
