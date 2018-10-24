#!/bin/bash

git config --global user.email "builds@travis-ci.com"
git config --global user.name "Travis CI"
git tag $GIT_TAG -a -m "Generated tag from TravisCI build $TRAVIS_BUILD_NUMBER"
git push origin $GIT_TAG

