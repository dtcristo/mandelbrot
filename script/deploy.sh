#!/bin/sh
set -ex

if [ "$CIRCLECI" = "true" ]; then
  firebase deploy --token "$FIREBASE_TOKEN" --non-interactive
else
  firebase deploy
fi
