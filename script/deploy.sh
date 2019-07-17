#!/bin/sh
set -e
firebase deploy --token "$FIREBASE_TOKEN" --non-interactive
