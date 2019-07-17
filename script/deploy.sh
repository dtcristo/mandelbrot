#!/bin/bash
set -e
if [ "$CIRCLECI" == "true" ]; then
  firebase deploy --token "$FIREBASE_TOKEN" --non-interactive
else
  firebase deploy
fi
