#!/bin/sh

set -e

# Install
yarn

# Depcheck
yarn depcheck

# Lint
yarn lint

# Prettier
yarn prettier

# Doc
yarn doc

# Test
yarn test

# Build
yarn build
